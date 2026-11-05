import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Member, MemberStatus } from '../../../../../core/api/members/member.dto';
import { MemberService } from '../../../../../core/api/members/member.service';

@Component({
  selector: 'app-freeze-membership',
  standalone: true,
  imports: [],
  templateUrl: './freeze-membership.html',
})
export class FreezeMembership implements OnInit {

  readonly MemberStatus = MemberStatus;
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly memberService = inject(MemberService);

  startDate = signal('');
  duration = signal('1');
  reason = signal('');
  notes = signal('');
  member = signal<Member | null>(null);
  errorMessage = signal('');
  loading = signal(true);

  newEndDate = computed(() => {
    const start = this.startDate();
    if (!start) return '';
    const baseDate = this.member()?.membershipEndDate || start;
    const date = new Date(`${baseDate}T12:00:00`);
    date.setMonth(date.getMonth() + Number(this.duration()));
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: '2-digit', year: 'numeric'
    }).format(date);
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage.set('Member ID is missing.');
      this.loading.set(false);
      return;
    }
    this.memberService.getById(id).subscribe(member => {
      this.member.set(member ?? null);
      this.loading.set(false);
      if (!member) this.errorMessage.set('Member not found.');
    });
  }

  cancel() {
    this.router.navigate(['/members']);
  }

  confirmFreeze() {
    if (!this.startDate()) {
      this.errorMessage.set('Choose a start date.');
      return;
    }
    if (!this.reason()) {
      this.errorMessage.set('Choose a reason for the freeze.');
      return;
    }
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.memberService.freeze(id, this.newEndDate(), this.reason(), this.notes()).subscribe(member => {
      if (!member) {
        this.errorMessage.set('This membership cannot be frozen.');
        return;
      }
      this.router.navigate(['/members', member.id.replace('#', '')]);
    });
  }
}
