import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-book-session',
  styleUrl: './book-session.scss',
  templateUrl: './book-session.html',
})
export class BookSession {

  className = 'HIIT Core Blast';
  branch = 'Downtown Branch';
  trainer = 'Sarah Jenkins';
  studio = 'Studio A';
  date = '';
  startTime = '';
  duration = 45;
  capacity = 20;

  memberName = '';
  memberId = '#TF-0452';
  memberStatus = 'Active';

  constructor(private router: Router) {

    const state = window.history.state;

    this.className = state?.className || this.className;
    this.branch = state?.branch || this.branch;
    this.trainer = state?.trainer || this.trainer;
    this.studio = state?.studio || this.studio;
    this.date = state?.date || this.date;
    this.startTime = state?.startTime || this.startTime;
    this.duration = state?.duration || this.duration;
    this.capacity = state?.capacity || this.capacity;

    this.memberName = state?.memberName || this.memberName;
    this.memberId = state?.memberId || this.memberId;
    this.memberStatus = state?.memberStatus || this.memberStatus;
  }

  goBack(): void {
    this.router.navigate(['/classes'], {
      queryParams: { openAdd: 'true' }
    });
  }

  updateMember(value: string): void {
    this.memberName = value;
  }

  confirmBooking(): void {

    if (!this.memberName.trim()) {
      return;
    }

    this.router.navigate(['/classes/book-session-member'], {
      state: {
        className: this.className,
        branch: this.branch,
        trainer: this.trainer,
        studio: this.studio,
        date: this.date,
        startTime: this.startTime,
        duration: this.duration,
        capacity: this.capacity,
        memberName: this.memberName.trim(),
        memberId: this.memberId,
        memberStatus: this.memberStatus
      }
    });
  }

}