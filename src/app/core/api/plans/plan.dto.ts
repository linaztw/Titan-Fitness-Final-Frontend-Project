export type PlanAccessScope = 'Home branch only' | 'All branches';

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  isPublished: boolean;
  maxFreezeDays: number;
  maxFreezes: number;
  guestPassQuota: number;
  accessScope: PlanAccessScope;
}
