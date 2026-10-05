import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Member {
  id: string;
  name: string;
  status: 'Active' | 'Frozen' | 'Expired';
  branch: string;
  lastVisit: string;
  joinedDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private apiUrl = '/api/members';

  private members: Member[] = [
    {
      id: '#TF-8932',
      name: 'Jane Doe',
      status: 'Active',
      branch: 'Downtown',
      lastVisit: 'Today, 08:30 AM',
      joinedDate: 'Oct 12, 2023'
    },
    {
      id: '#TF-7741',
      name: 'John Smith',
      status: 'Frozen',
      branch: 'Uptown',
      lastVisit: 'Oct 12, 2023',
      joinedDate: 'Sep 18, 2023'
    },
    {
      id: '#TF-9012',
      name: 'Alice Williams',
      status: 'Active',
      branch: 'Downtown',
      lastVisit: 'Yesterday',
      joinedDate: 'Aug 04, 2023'
    },
    {
      id: '#TF-5521',
      name: 'Robert Johnson',
      status: 'Expired',
      branch: 'Downtown',
      lastVisit: 'Sep 01, 2023',
      joinedDate: 'Jan 15, 2023'
    }
  ];

  constructor(private http: HttpClient) {
    this.createMockMembers();
  }

  private createMockMembers(): void {
    const statuses: Member['status'][] = [
      'Active',
      'Frozen',
      'Expired'
    ];

    const branches = [
      'Downtown',
      'Uptown'
    ];

    for (let i = this.members.length + 1; i <= 240; i++) {
      this.members.push({
        id: `#TF-${6000 + i}`,
        name: `Member ${i}`,
        status: statuses[i % statuses.length],
        branch: branches[i % branches.length],
        lastVisit: 'Yesterday',
        joinedDate: 'Jan 10, 2023'
      });
    }
  }

  getAll(): Observable<Member[]> {
    return of(this.members);
  }

  getById(id: string): Observable<Member> {
    const member = this.members.find(
      item => item.id === id
    );

    return of(member as Member);
  }

  create(
    member: { name: string; branch: string }
  ): Observable<Member> {
    return this.http.post<Member>(
      this.apiUrl,
      member
    );
  }

  update(
    id: string,
    member: { name: string; branch: string }
  ): Observable<Member> {
    return this.http.put<Member>(
      `${this.apiUrl}/${id}`,
      member
    );
  }
}