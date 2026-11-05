import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MembershipPlan } from './plan.dto';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private plans: MembershipPlan[] = [
    { id: 'PL-2001', name: 'Annual Pro', price: 899, durationMonths: 12, isPublished: true, maxFreezeDays: 60, maxFreezes: 3, guestPassQuota: 5, accessScope: 'All branches' },
    { id: 'PL-2002', name: 'Quarterly', price: 279, durationMonths: 3, isPublished: true, maxFreezeDays: 15, maxFreezes: 1, guestPassQuota: 2, accessScope: 'All branches' },
    { id: 'PL-2003', name: 'Monthly', price: 99, durationMonths: 1, isPublished: true, maxFreezeDays: 0, maxFreezes: 0, guestPassQuota: 0, accessScope: 'Home branch only' },
    { id: 'PL-2004', name: 'Student 2024', price: 69, durationMonths: 1, isPublished: false, maxFreezeDays: 0, maxFreezes: 0, guestPassQuota: 0, accessScope: 'Home branch only' }
  ];

  getAll(): Observable<MembershipPlan[]> {
    return of(this.plans.map(plan => ({ ...plan })));
  }

  getById(id: string): Observable<MembershipPlan | undefined> {
    const plan = this.plans.find(item => item.id === id);
    return of(plan ? { ...plan } : undefined);
  }

  create(data: Omit<MembershipPlan, 'id'>): Observable<MembershipPlan> {
    const plan: MembershipPlan = { ...data, id: `PL-${Date.now().toString().slice(-4)}` };
    this.plans = [...this.plans, plan];
    return of({ ...plan });
  }

  update(id: string, changes: Omit<MembershipPlan, 'id'>): Observable<MembershipPlan | undefined> {
    const plan = this.plans.find(item => item.id === id);
    if (!plan) return of(undefined);
    Object.assign(plan, changes);
    return of({ ...plan });
  }
}
