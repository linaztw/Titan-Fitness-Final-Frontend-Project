import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import {
  Member,
  MemberStatus
} from '../../../../core/api/members/member.dto';
import { MemberService } from '../../../../core/api/members/member.service';

import { ClassService } from '../../../../core/api/classes/class.service';
import { AddMemberDialogComponent } from '../add-member-dialog/add-member-dialog';
import { AppClickOutsideDirective } from '../../../../shared/directives/app-click-outside.directive';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator';

@Component({
  selector: 'app-members',
  imports: [RouterLink, AppClickOutsideDirective, PageHeaderComponent, StatusBadgeComponent, PaginatorComponent],
  templateUrl: './members.html',
})
export class MembersComponent implements OnInit {

  readonly MemberStatus = MemberStatus;
  private readonly memberService = inject(MemberService);
  private readonly classService = inject(ClassService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  members = signal<Member[]>([]);

  loading = signal(true);
  errorMessage = signal('');

  searchTerm = signal('');
  selectedStatus = signal<'All' | MemberStatus>('All');
  selectedBranch = signal('All');
  actionMessage = signal('');

  currentPage = signal(1);

  openMenuId = signal<string | null>(null);

  pageSize = 4;

  filteredMembers = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const status = this.selectedStatus();
    const branch = this.selectedBranch();

    return this.members().filter(member => {

      const matchesSearch =
        !search ||
        member.name.toLowerCase().includes(search) ||
        member.id.toLowerCase().includes(search);

      const matchesStatus =
        status === 'All' ||
        member.status === status;

      const matchesBranch =
        branch === 'All' ||
        member.branch === branch;

      return matchesSearch && matchesStatus && matchesBranch;
    });
  });

  totalPages = computed(() => {
    return Math.max(
      1,
      Math.ceil(
        this.filteredMembers().length / this.pageSize
      )
    );
  });

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();

    const start = Math.max(
      1,
      Math.min(current - 1, total - 3)
    );

    const end = Math.min(
      total,
      start + 3
    );

    const pages: number[] = [];

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    return pages;
  });

  visibleMembers = computed(() => {
    const start =
      (this.currentPage() - 1) * this.pageSize;

    return this.filteredMembers().slice(
      start,
      start + this.pageSize
    );
  });

  showingFrom = computed(() => {
    if (this.filteredMembers().length === 0) {
      return 0;
    }

    return (this.currentPage() - 1) * this.pageSize + 1;
  });

  showingTo = computed(() => {
    return Math.min(
      this.currentPage() * this.pageSize,
      this.filteredMembers().length
    );
  });

  ngOnInit(): void {
    this.loadMembers();
  }

  setSearchTerm(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  setStatus(value: string): void {
    this.selectedStatus.set(value === 'All' ? 'All' : value as MemberStatus);
    this.currentPage.set(1);
  }

  setBranch(value: string): void {
    this.selectedBranch.set(value);
    this.currentPage.set(1);
  }

  addMember(existing?: Member): void {
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      width: '520px',
      maxWidth: '95vw',
      data: existing ?? null
    });

    dialogRef.afterClosed().subscribe(details => {
      if (!details) return;
      if (existing) {
        this.memberService.update(existing.id, details).subscribe(member => {
          if (!member) return;
          this.members.update(members => members.map(item => item.id === member.id ? member : item));
          this.actionMessage.set(`${member.name} was updated.`);
        });
        return;
      }
      this.memberService.create(details).subscribe(member => {
        this.members.update(members => [member, ...members]);
        this.actionMessage.set(`${member.name} was added.`);
        this.currentPage.set(1);
      });
    });
  }

  checkIn(member: Member): void {
    this.memberService.checkIn(member.id).subscribe(updated => {
      if (!updated) return;
      this.members.update(members => members.map(item => item.id === updated.id ? updated : item));
      this.actionMessage.set(`${member.name} checked in.`);
    });
  }

  loadMembers(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.memberService.getAll().subscribe({
      next: members => {
        this.members.set(members);
        this.loading.set(false);
      },

      error: () => {
        this.errorMessage.set(
          'Could not load members.'
        );
        this.loading.set(false);
      }
    });
  }

  toggleMenu(memberId: string): void {
    if (this.openMenuId() === memberId) {
      this.openMenuId.set(null);
    } else {
      this.openMenuId.set(memberId);
    }
  }

  closeActionMenu(): void {
    this.openMenuId.set(null);
  }

  bookClass(member: Member): void {
    this.openMenuId.set(null);
    this.classService.getAll().subscribe(classes => {
      const firstClass = classes[0];
      if (!firstClass) return;
      this.router.navigate(['/classes/book-session'], {
        state: {
          className: firstClass.name,
          branch: firstClass.branch,
          trainer: firstClass.trainer,
          studio: firstClass.studio,
          date: new Date().toISOString().slice(0, 10),
          startTime: firstClass.time,
          duration: firstClass.duration,
          capacity: firstClass.capacity,
          memberName: member.name,
          memberId: member.id,
          memberStatus: member.status
        }
      });
    });
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }

    this.currentPage.set(page);
    this.openMenuId.set(null);
  }

}
