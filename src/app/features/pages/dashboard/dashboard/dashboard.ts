import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';
import { Member, MemberStatus } from '../../../../core/api/members/member.dto';
import { MemberService } from '../../../../core/api/members/member.service';
import { FitnessClass } from '../../../../core/api/classes/class.dto';
import { ClassService } from '../../../../core/api/classes/class.service';
import { AddMemberDialogComponent } from '../../members/add-member-dialog/add-member-dialog';

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe, RouterLink, PageHeaderComponent],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {

  private readonly memberService = inject(MemberService);
  private readonly classService = inject(ClassService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  members = signal<Member[]>([]);
  classes = signal<FitnessClass[]>([]);

  checkInsToday = computed(() => this.members().filter(member => member.lastVisit.startsWith('Today')).length);
  activeMembers = computed(() => this.members().filter(member => member.status === MemberStatus.Active).length);
  membersOnFloor = computed(() => this.checkInsToday());
  upcomingClasses = computed(() => this.classes()
    .filter(item => item.state === 'Upcoming' || item.state === 'In Progress')
    .slice(0, 4)
    .map(item => ({
      time: item.time,
      name: item.name,
      details: `${item.studio} • ${item.trainer}`,
      enrolled: `${item.enrolled}/${item.capacity} Enrolled`,
      status: item.state === 'In Progress' ? 'Active' : 'Upcoming'
    })));

  ngOnInit(): void {
    this.refreshDashboard();
  }

  private refreshDashboard(): void {
    this.memberService.getAll().subscribe(members => this.members.set(members));
    this.classService.getAll().subscribe(classes => this.classes.set(classes));
  }

  addMember(): void {
    const dialogRef = this.dialog.open(AddMemberDialogComponent, { width: '520px', maxWidth: '95vw' });
    dialogRef.afterClosed().subscribe(details => {
      if (!details) return;
      this.memberService.create(details).subscribe(member => this.members.update(list => [member, ...list]));
    });
  }

  openClassScheduler(): void {
    this.router.navigate(['/classes'], { queryParams: { openAdd: 'true' } });
  }

}
