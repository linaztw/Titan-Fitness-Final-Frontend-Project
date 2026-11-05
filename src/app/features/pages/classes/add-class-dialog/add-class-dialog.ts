import { Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FitnessClass } from '../../../../core/api/classes/class.dto';

@Component({
  selector: 'app-add-class-dialog',
  standalone: true,
  imports: [],
  templateUrl: './add-class-dialog.html'
})
export class AddClassDialogComponent {

  private readonly initialClass = inject(MAT_DIALOG_DATA, { optional: true }) as FitnessClass | null;

  private readonly dialogRef = inject(
    MatDialogRef<AddClassDialogComponent>
  );

  className = signal(this.initialClass?.name ?? '');
  branch = signal(this.initialClass?.branch ?? 'Downtown Branch');
  trainer = signal(this.initialClass?.trainer === 'Unassigned' ? '' : this.initialClass?.trainer ?? '');
  studio = signal(this.initialClass?.studio === 'Unassigned' ? '' : this.initialClass?.studio ?? '');
  date = signal(this.initialClass?.date ?? new Date().toISOString().slice(0, 10));
  startTime = signal(this.initialClass?.time ?? '');
  capacity = signal(this.initialClass ? String(this.initialClass.capacity) : '');
  duration = signal(String(this.initialClass?.duration ?? 45));
  status = signal(this.initialClass?.state ?? 'Upcoming');
  description = signal('');
  attemptedSubmit = signal(false);
  isEditing = computed(() => this.initialClass !== null);

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
    this.attemptedSubmit.set(true);
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
