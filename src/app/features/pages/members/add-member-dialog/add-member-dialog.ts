import { Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppAutofocusDirective } from '../../../../shared/directives/app-autofocus.directive';
import { Member } from '../../../../core/api/members/member.dto';

@Component({
  selector: 'app-add-member-dialog',
  standalone: true,
  imports: [AppAutofocusDirective],
  templateUrl: './add-member-dialog.html'
})
export class AddMemberDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AddMemberDialogComponent>);
  readonly initialMember = inject(MAT_DIALOG_DATA, { optional: true }) as Member | null;

  name = signal(this.initialMember?.name ?? '');
  branch = signal(this.initialMember?.branch ?? 'Downtown');
  attemptedSubmit = signal(false);
  isEditing = computed(() => !!this.initialMember);
  isValid = computed(() => this.name().trim().length >= 2 && !!this.branch());

  save(): void {
    this.attemptedSubmit.set(true);
    if (!this.isValid()) return;
    this.dialogRef.close({ name: this.name().trim(), branch: this.branch() });
  }

  close(): void {
    this.dialogRef.close();
  }
}
