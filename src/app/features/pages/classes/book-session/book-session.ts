import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ClassService } from '../../../../core/api/classes/class.service';

@Component({
  imports: [],
  selector: 'app-book-session',
  templateUrl: './book-session.html',
})
export class BookSession {

  private readonly router = inject(Router);
  private readonly classService = inject(ClassService);

  className = 'HIIT Core Blast';
  classId = '';
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
  errorMessage = '';

  constructor() {

    const state = window.history.state;

    this.classId = state?.classId || this.classId;
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
    this.router.navigate(['/classes']);
  }

  updateMember(value: string): void {
    this.memberName = value;
    this.errorMessage = '';
  }

  confirmBooking(): void {

    if (!this.memberName.trim()) {
      this.errorMessage = 'Enter a member name to continue.';
      return;
    }
    if (this.memberStatus !== 'Active') {
      this.errorMessage = 'Only active members can book a class.';
      return;
    }
    if (!this.classId) {
      this.errorMessage = 'Class details are missing. Return to the class schedule and try again.';
      return;
    }

    this.classService.book(this.classId).subscribe(bookedClass => {
      if (!bookedClass) {
        this.errorMessage = 'This class is no longer available for booking.';
        return;
      }
      this.router.navigate(['/classes/book-session-member'], {
        state: {
          classId: bookedClass.id,
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
          memberStatus: this.memberStatus,
          waitlisted: bookedClass.enrolled >= bookedClass.capacity && bookedClass.waitlist > 0
        }
      });
    });
  }

}
