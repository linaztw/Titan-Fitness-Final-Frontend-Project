import {
  Component,
  OnInit,
  computed,
  signal
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import {
  Member,
  MemberService
} from '../member';

import { AddClassDialogComponent } from '../../classes/add-class-dialog/add-class-dialog';

@Component({
  selector: 'app-members',
  imports: [RouterLink],
  templateUrl: './members.html',
  styleUrl: './members.scss'
})
export class MembersComponent implements OnInit {

  members = signal<Member[]>([]);

  loading = signal(true);
  errorMessage = signal('');

  searchTerm = signal('');
  selectedStatus = signal<'All' | Member['status']>('All');
  selectedBranch = signal('All');

  currentPage = signal(1);

  openMenuId = signal<string | null>(null);

  pageSize = 4;

  constructor(
    private memberService: MemberService,
    private dialog: MatDialog
  ) {}

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

  bookClass(member: Member): void {

    this.openMenuId.set(null);

    const dialogRef = this.dialog.open(
      AddClassDialogComponent,
      {
        width: '760px',
        maxWidth: '95vw',
        disableClose: true
      }
    );

    dialogRef.afterClosed().subscribe(result => {

      if (!result) {
        return;
      }

      console.log(
        `Class booking requested for ${member.name}`,
        result
      );

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