import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-session-member',
  standalone: true,
  imports: [],
  templateUrl: './book-session-member.html',
  styleUrl: './book-session-member.scss'
})
export class BookSessionMember {

  className = 'HIIT Core Blast';
  branch = 'Downtown Branch';
  trainer = 'Sarah Jenkins';
  studio = 'Studio A';
  date = '';
  startTime = '';
  duration = 45;
  capacity = 20;

  memberName = 'Alex Mercer';
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

  done(): void {
    this.router.navigate(['/classes']);
  }

}