import { Component, computed, inject, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-class-dialog',
  standalone: true,
  imports: [],
  templateUrl: './add-class-dialog.html',
  styleUrl: './add-class-dialog.scss'
})
export class AddClassDialogComponent {

  private readonly dialogRef = inject(
    MatDialogRef<AddClassDialogComponent>
  );

  className = signal('');
  branch = signal('Downtown Branch');
  trainer = signal('');
  studio = signal('');
  date = signal('');
  startTime = signal('');
  capacity = signal('');
  duration = signal('45');
  status = signal('Upcoming');
  description = signal('');

  isValid = computed(() => {
    return (
      this.className().trim() !== '' &&
      this.branch().trim() !== '' &&
      this.date().trim() !== '' &&
      this.startTime().trim() !== ''
    );
  });

  close(): void {
    this.dialogRef.close();
  }

  scheduleClass(): void {

    if (!this.isValid()) {
      return;
    }

    this.dialogRef.close({
      className: this.className(),
      branch: this.branch(),
      trainer: this.trainer(),
      studio: this.studio(),
      date: this.date(),
      startTime: this.startTime(),
      capacity: Number(this.capacity()) || 20,
      duration: Number(this.duration()),
      status: this.status(),
      description: this.description()
    });
  }
}