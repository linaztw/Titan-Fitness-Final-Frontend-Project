import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Member, MemberStatus } from '../../../../../core/api/members/member.dto';
import { MemberService } from '../../../../../core/api/members/member.service';
import { FreezeAllowancePipe } from '../../../../../shared/pipes/freeze-allowance.pipe';
import { StatusBadgeComponent } from '../../../../../shared/components/status-badge/status-badge';
import { MatDialog } from '@angular/material/dialog';
import { AddMemberDialogComponent } from '../../add-member-dialog/add-member-dialog';

@Component({
  selector: 'app-member-profile',
  standalone: true,
  imports: [FreezeAllowancePipe, StatusBadgeComponent],
  templateUrl: './member-profile.html'
})
export class MemberProfileComponent implements OnInit {

  readonly MemberStatus = MemberStatus;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly memberService = inject(MemberService);
  private readonly dialog = inject(MatDialog);

  member = signal<Member | null>(null);
  loading = signal(true);
  errorMessage = signal('');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      const cleanId = id.replace('#', '');

      this.memberService.getById(cleanId).subscribe({
        next: (member) => {
          this.member.set(member ?? null);
          this.loading.set(false);
          if (!member) this.errorMessage.set('Member not found.');
        },
        error: () => {
          this.errorMessage.set('Could not load member.');
          this.loading.set(false);
        }
      });
    } else {
      this.errorMessage.set('Member ID is missing.');
      this.loading.set(false);
    }
  }

  goBack() {
    this.router.navigate(['/members']);
  }

  goToFreeze() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.router.navigate(['/members', id, 'freeze']);
    }
  }

  cancel() {
    this.goBack();
  }

  editMember(): void {
    const current = this.member();
    if (!current) return;
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      width: '520px',
      maxWidth: '95vw',
      data: current
    });
    dialogRef.afterClosed().subscribe(details => {
      if (!details) return;
      this.memberService.update(current.id, details).subscribe(updated => {
        if (updated) this.member.set(updated);
      });
    });
  }
}
