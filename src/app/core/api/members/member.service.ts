import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Member, MemberStatus } from './member.dto';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private members: Member[] = [
    {
      id: '#TF-8932',
      name: 'Jane Doe',
      status: MemberStatus.Active,
      branch: 'Downtown',
      lastVisit: 'Today, 08:30 AM',
      joinedDate: 'Oct 12, 2023',
      membershipEndDate: 'Oct 12, 2026',
      freezesUsed: 2,
      membershipPlan: 'Annual Pro Plan',
      planPrice: 899,
      guestPassesUsed: 1
    },
    {
      id: '#TF-7741',
      name: 'John Smith',
      status: MemberStatus.Frozen,
      branch: 'Uptown',
      lastVisit: 'Oct 12, 2023',
      joinedDate: 'Sep 18, 2023',
      membershipEndDate: 'Sep 18, 2026',
      freezesUsed: 1,
      membershipPlan: 'Monthly Fitness Plan',
      planPrice: 89,
      guestPassesUsed: 0
    },
    {
      id: '#TF-9012',
      name: 'Alice Williams',
      status: MemberStatus.Active,
      branch: 'Downtown',
      lastVisit: 'Yesterday',
      joinedDate: 'Aug 04, 2023',
      membershipEndDate: 'Aug 04, 2026',
      freezesUsed: 0,
      membershipPlan: 'Annual Pro Plan',
      planPrice: 899,
      guestPassesUsed: 2
    },
    {
      id: '#TF-5521',
      name: 'Robert Johnson',
      status: MemberStatus.Expired,
      branch: 'Downtown',
      lastVisit: 'Sep 01, 2023',
      joinedDate: 'Jan 15, 2023',
      membershipEndDate: 'Jan 15, 2026',
      freezesUsed: 0,
      membershipPlan: 'Monthly Fitness Plan',
      planPrice: 89,
      guestPassesUsed: 0
    }
  ];

  constructor() {
    this.createMockMembers();
  }

  private createMockMembers(): void {
    const statuses = [MemberStatus.Active, MemberStatus.Frozen, MemberStatus.Expired];
    const branches = ['Downtown', 'Uptown'];

    for (let i = this.members.length + 1; i <= 240; i++) {
      this.members.push({
        id: `#TF-${6000 + i}`,
        name: `Member ${i}`,
        status: statuses[i % statuses.length],
        branch: branches[i % branches.length],
        lastVisit: 'Yesterday',
        joinedDate: 'Jan 10, 2023',
        membershipPlan: 'Standard Fitness Plan',
        planPrice: 0,
        guestPassesUsed: 0
      });
    }
  }

  getAll(): Observable<Member[]> {
    return of(this.members.map(member => ({ ...member })));
  }

  getById(id: string): Observable<Member | undefined> {
    const normalizedId = this.normalizeId(id);
    const member = this.members.find(item => this.normalizeId(item.id) === normalizedId);
    return of(member ? { ...member } : undefined);
  }

  create(details: { name: string; branch: string }): Observable<Member> {
    const member: Member = {
      id: `#TF-${Date.now().toString().slice(-6)}`,
      name: details.name.trim(),
      status: MemberStatus.Active,
      branch: details.branch,
      lastVisit: 'Never',
      joinedDate: new Intl.DateTimeFormat('en-US', {
        month: 'short', day: '2-digit', year: 'numeric'
      }).format(new Date()),
      membershipPlan: 'Standard Fitness Plan',
      planPrice: 0,
      guestPassesUsed: 0
    };
    this.members.unshift(member);
    return of({ ...member });
  }

  update(id: string, details: { name: string; branch: string }): Observable<Member | undefined> {
    const member = this.members.find(item => this.normalizeId(item.id) === this.normalizeId(id));
    if (!member) return of(undefined);
    Object.assign(member, { name: details.name.trim(), branch: details.branch });
    return of({ ...member });
  }

  checkIn(id: string): Observable<Member | undefined> {
    const member = this.members.find(item => this.normalizeId(item.id) === this.normalizeId(id));
    if (!member || member.status !== MemberStatus.Active) return of(undefined);
    member.lastVisit = `Today, ${new Intl.DateTimeFormat('en-US', {
      hour: '2-digit', minute: '2-digit'
    }).format(new Date())}`;
    return of({ ...member });
  }

  freeze(id: string, endDate: string, reason: string, notes = ''): Observable<Member | undefined> {
    const member = this.members.find(item => this.normalizeId(item.id) === this.normalizeId(id));
    if (!member || member.status !== MemberStatus.Active) return of(undefined);
    member.status = MemberStatus.Frozen;
    member.freezeEndDate = endDate;
    member.membershipEndDate = endDate;
    member.freezesUsed = (member.freezesUsed ?? 0) + 1;
    member.freezeReason = reason;
    member.freezeNotes = notes.trim();
    return of({ ...member });
  }

  private normalizeId(id: string): string {
    return id.replace(/^#/, '').toLowerCase();
  }
}
