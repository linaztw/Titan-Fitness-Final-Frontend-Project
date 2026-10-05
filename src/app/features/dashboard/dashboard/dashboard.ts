import { Component, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {

  checkInsToday = signal(142);
  activeMembers = signal(1240);
  membersOnFloor = signal(45);
  weeklyCheckInChange = signal('+12%');

  upcomingClasses = signal([
    {
      time: '09:00 AM',
      name: 'HIIT Blast',
      details: 'Studio A • Sarah J.',
      enrolled: '24/30 Enrolled',
      status: 'Active'
    },
    {
      time: '10:30 AM',
      name: 'Power Yoga',
      details: 'Studio B • Mike T.',
      enrolled: '15/20 Enrolled',
      status: 'Upcoming'
    }
  ]);

}