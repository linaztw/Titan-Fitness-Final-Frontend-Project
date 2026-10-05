import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface FitnessClass {
  id: string;
  time: string;
  name: string;
  trainer: string;
  studio: string;
  branch: string;
  duration: number;
  state: 'Upcoming' | 'In Progress' | 'Full' | 'Completed' | 'Cancelled';
  enrolled: number;
  capacity: number;
  waitlist: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  private classes: FitnessClass[] = [
    {
      id: '1',
      time: '06:00 AM',
      name: 'HIIT Core Blast',
      trainer: 'Sarah Jenkins',
      studio: 'Studio A',
      branch: 'Downtown Branch',
      duration: 45,
      state: 'In Progress',
      enrolled: 28,
      capacity: 30,
      waitlist: 0
    },
    {
      id: '2',
      time: '08:00 AM',
      name: 'Strength Training',
      trainer: 'Mike Johnson',
      studio: 'Studio B',
      branch: 'Downtown Branch',
      duration: 60,
      state: 'Upcoming',
      enrolled: 18,
      capacity: 25,
      waitlist: 0
    },
    {
      id: '3',
      time: '09:30 AM',
      name: 'Yoga Flow',
      trainer: 'Emma Davis',
      studio: 'Studio A',
      branch: 'Downtown Branch',
      duration: 45,
      state: 'Full',
      enrolled: 20,
      capacity: 20,
      waitlist: 3
    },
    {
      id: '4',
      time: '11:00 AM',
      name: 'Pilates',
      trainer: 'Olivia Brown',
      studio: 'Studio C',
      branch: 'Downtown Branch',
      duration: 60,
      state: 'Upcoming',
      enrolled: 12,
      capacity: 20,
      waitlist: 0
    },
    {
      id: '5',
      time: '01:00 PM',
      name: 'Boxing Basics',
      trainer: 'James Wilson',
      studio: 'Studio B',
      branch: 'Downtown Branch',
      duration: 45,
      state: 'Upcoming',
      enrolled: 15,
      capacity: 20,
      waitlist: 0
    }
  ];

  getAll(): Observable<FitnessClass[]> {
    return of(this.classes);
  }

  getById(id: string): Observable<FitnessClass | undefined> {
    const fitnessClass = this.classes.find(item => item.id === id);

    return of(fitnessClass);
  }
}