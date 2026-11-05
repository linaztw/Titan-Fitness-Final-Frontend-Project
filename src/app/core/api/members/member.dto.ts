export enum MemberStatus {
  Active = 'Active',
  Frozen = 'Frozen',
  Expired = 'Expired'
}

export interface Member {
  id: string;
  name: string;
  status: MemberStatus;
  branch: string;
  lastVisit: string;
  joinedDate: string;
  freezeEndDate?: string;
  membershipEndDate?: string;
  freezesUsed?: number;
  membershipPlan?: string;
  planPrice?: number;
  guestPassesUsed?: number;
  freezeReason?: string;
  freezeNotes?: string;
}
