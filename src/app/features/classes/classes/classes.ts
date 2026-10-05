import { Component, computed, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService, FitnessClass } from '../class';
import { AddClassDialogComponent } from '../add-class-dialog/add-class-dialog';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [],
  templateUrl: './classes.html',
  styleUrl: './classes.scss'
})
export class ClassesComponent {

  classes = signal<FitnessClass[]>([]);

  searchText = signal('');
  selectedView = signal<'Day' | 'Week'>('Day');
  selectedDate = signal('Today');

  filteredClasses = computed(() => {
    const search = this.searchText().toLowerCase().trim();

    if (!search) {
      return this.classes();
    }

    return this.classes().filter(item =>
      item.name.toLowerCase().includes(search) ||
      item.trainer.toLowerCase().includes(search) ||
      item.studio.toLowerCase().includes(search)
    );
  });

  totalClasses = computed(() => this.classes().length);

  totalEnrolled = computed(() =>
    this.classes().reduce((total, item) => total + item.enrolled, 0)
  );

  totalCapacity = computed(() =>
    this.classes().reduce((total, item) => total + item.capacity, 0)
  );

  constructor(
    private classService: ClassService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
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

  openAddClassDialog() {

    const dialogRef = this.dialog.open(AddClassDialogComponent, {
      width: '760px',
      maxWidth: '95vw',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {

      if (!result) {
        return;
      }

      const newClass: FitnessClass = {
        id: String(Date.now()),
        name: result.className,
        trainer: result.trainer || 'Unassigned',
        studio: result.studio || 'Unassigned',
        branch: result.branch,
        time: result.startTime,
        duration: result.duration,
        state: result.status,
        enrolled: 0,
        capacity: result.capacity,
        waitlist: 0
      };

      this.classes.update(currentClasses => [
        ...currentClasses,
        newClass
      ]);

      this.router.navigate(['/classes/book-session'], {
        state: {
          className: result.className,
          branch: result.branch,
          trainer: result.trainer,
          studio: result.studio,
          date: result.date,
          startTime: result.startTime,
          duration: result.duration,
          capacity: result.capacity
        }
      });

    });
  }

  setView(view: 'Day' | 'Week') {
    this.selectedView.set(view);
  }

  setSearch(value: string) {
    this.searchText.set(value);
  }

  previousDay() {
    this.selectedDate.set('Previous Day');
  }

  nextDay() {
    this.selectedDate.set('Next Day');
  }
}