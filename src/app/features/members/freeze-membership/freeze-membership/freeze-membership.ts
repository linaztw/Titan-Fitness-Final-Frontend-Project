import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-freeze-membership',
  standalone: true,
  imports: [],
  templateUrl: './freeze-membership.html',
  styleUrl: './freeze-membership.scss'
})
export class FreezeMembership {

  startDate = signal('');
  duration = signal('1');
  reason = signal('');
  notes = signal('');

  constructor(private router: Router) {}

  cancel() {
    this.router.navigate(['/members']);
  }

  confirmFreeze() {
    alert('Membership freeze confirmed');
  }
}