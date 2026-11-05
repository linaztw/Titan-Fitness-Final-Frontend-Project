import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Trainer } from './trainer.dto';

@Injectable({ providedIn: 'root' })
export class TrainerService {
  private trainers: Trainer[] = [
    { id: 'TR-1042', name: 'Sarah Jenkins', specialty: 'HIIT / Strength', branch: 'Downtown', email: 's.jenkins@titanfitness.com', phone: '+1 (555) 019-4471', isActive: true },
    { id: 'TR-1057', name: 'Marcus Lee', specialty: 'Yoga / Mobility', branch: 'Downtown', email: 'marcus.lee@titanfitness.com', phone: '+1 (555) 019-2214', isActive: true },
    { id: 'TR-1063', name: 'Elena Rodriguez', specialty: 'Cycling', branch: 'Uptown', email: 'elena.rodriguez@titanfitness.com', phone: '+1 (555) 019-8240', isActive: true },
    { id: 'TR-1071', name: 'Mike Turner', specialty: 'Pilates', branch: 'Uptown', email: 'mike.turner@titanfitness.com', phone: '+1 (555) 019-1472', isActive: false },
    { id: 'TR-1084', name: 'Olivia Brown', specialty: 'Pilates / Core', branch: 'Downtown', email: 'olivia.brown@titanfitness.com', phone: '+1 (555) 019-3918', isActive: true },
    { id: 'TR-1090', name: 'James Wilson', specialty: 'Boxing', branch: 'Uptown', email: 'james.wilson@titanfitness.com', phone: '+1 (555) 019-6321', isActive: true },
    { id: 'TR-1102', name: 'Emma Davis', specialty: 'Yoga', branch: 'Downtown', email: 'emma.davis@titanfitness.com', phone: '+1 (555) 019-7782', isActive: false },
    { id: 'TR-1115', name: 'Noah Carter', specialty: 'Strength', branch: 'Uptown', email: 'noah.carter@titanfitness.com', phone: '+1 (555) 019-8056', isActive: true }
  ];

  getAll(): Observable<Trainer[]> {
    return of(this.trainers.map(trainer => ({ ...trainer })));
  }

  getById(id: string): Observable<Trainer | undefined> {
    const trainer = this.trainers.find(item => item.id === id);
    return of(trainer ? { ...trainer } : undefined);
  }

  create(data: Omit<Trainer, 'id'>): Observable<Trainer> {
    const trainer: Trainer = { ...data, id: `TR-${Date.now().toString().slice(-4)}` };
    this.trainers = [...this.trainers, trainer];
    return of({ ...trainer });
  }

  update(id: string, changes: Omit<Trainer, 'id'>): Observable<Trainer | undefined> {
    const trainer = this.trainers.find(item => item.id === id);
    if (!trainer) return of(undefined);
    Object.assign(trainer, changes);
    return of({ ...trainer });
  }
}
