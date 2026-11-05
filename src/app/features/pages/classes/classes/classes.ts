import { Component, computed, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FitnessClass } from '../../../../core/api/classes/class.dto';
import { ClassService } from '../../../../core/api/classes/class.service';
import { AddClassDialogComponent } from '../add-class-dialog/add-class-dialog';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [PageHeaderComponent],
  templateUrl: './classes.html'
})
export class ClassesComponent {

  private readonly classService = inject(ClassService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  classes = signal<FitnessClass[]>([]);

  searchText = signal('');
  selectedView = signal<'Day' | 'Week'>('Day');
  selectedDate = signal('Today');
  selectedBranch = signal('All Branches');
  expandedClassId = signal<string | null>(null);
  actionMessage = signal('');

  filteredClasses = computed(() => {
    const search = this.searchText().toLowerCase().trim();
    const branch = this.selectedBranch();

    return this.classes().filter(item =>
      (branch === 'All Branches' || item.branch === branch) &&
      (!search || item.name.toLowerCase().includes(search) ||
        item.trainer.toLowerCase().includes(search) || item.studio.toLowerCase().includes(search))
    );
  });

  totalClasses = computed(() => this.classes().length);

  totalEnrolled = computed(() =>
    this.classes().reduce((total, item) => total + item.enrolled, 0)
  );

  totalCapacity = computed(() =>
    this.classes().reduce((total, item) => total + item.capacity, 0)
  );

  constructor() {
    this.loadClasses();

    this.route.queryParams.subscribe(params => {

      if (params['openAdd'] === 'true') {
        this.openAddClassDialog();
      }

    });
  }

  loadClasses() {
    this.classService.getAll().subscribe({
      next: (data) => {
        this.classes.set(data);
      }
    });
  }

  openAddClassDialog(existing?: FitnessClass) {

    const dialogRef = this.dialog.open(AddClassDialogComponent, {
      width: '760px',
      maxWidth: '95vw',
      disableClose: true,
      data: existing ?? null
    });

    dialogRef.afterClosed().subscribe(result => {

      if (!result) {
        return;
      }

      const newClass: FitnessClass = {
        id: existing?.id ?? String(Date.now()),
        name: result.className,
        trainer: result.trainer || 'Unassigned',
        studio: result.studio || 'Unassigned',
        branch: result.branch,
        date: result.date,
        time: result.startTime,
        duration: result.duration,
        state: result.status,
        enrolled: 0,
        capacity: result.capacity,
        waitlist: 0
      };

      const save$ = existing
        ? this.classService.update(existing.id, newClass)
        : this.classService.create(newClass);

      save$.subscribe(savedClass => {
        if (!savedClass) return;
        if (existing) {
          this.classes.update(items => items.map(item => item.id === savedClass.id ? savedClass : item));
          this.actionMessage.set(`${savedClass.name} updated.`);
          return;
        }
        this.classes.update(items => [...items, savedClass]);
        this.router.navigate(['/classes/book-session'], {
          state: {
            classId: savedClass.id,
            className: savedClass.name,
            branch: savedClass.branch,
            trainer: savedClass.trainer,
            studio: savedClass.studio,
            date: result.date,
            startTime: savedClass.time,
            duration: savedClass.duration,
            capacity: savedClass.capacity
          }
        });
      });

    });
  }

  setView(view: 'Day' | 'Week') {
    this.selectedView.set(view);
  }

  setSearch(value: string) {
    this.searchText.set(value);
  }

  setBranch(value: string): void {
    this.selectedBranch.set(value);
  }

  toggleDetails(item: FitnessClass): void {
    this.expandedClassId.set(this.expandedClassId() === item.id ? null : item.id);
  }

  editClass(item: FitnessClass): void {
    this.openAddClassDialog(item);
  }

  cancelClass(item: FitnessClass): void {
    this.classService.cancel(item.id).subscribe(updated => {
      if (!updated) return;
      this.classes.update(items => items.map(current => current.id === updated.id ? updated : current));
      this.actionMessage.set(`${item.name} cancelled.`);
    });
  }

  previousDay() {
    this.selectedDate.set('Previous Day');
  }

  nextDay() {
    this.selectedDate.set('Next Day');
  }
}
