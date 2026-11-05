import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../../../../core/api/trainers/trainer.service';
import { Trainer } from '../../../../core/api/trainers/trainer.dto';

@Component({
  selector: 'app-trainer-directory',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './trainer-directory.html'
})
export class TrainerDirectoryComponent {
  private readonly trainerService = inject(TrainerService);
  readonly trainers = signal<Trainer[]>([]);
  readonly search = signal('');
  readonly branch = signal('All branches');
  readonly page = signal(1);
  readonly pageSize = 4;
  readonly filtered = computed(() => this.trainers().filter(trainer => {
    const query = this.search().trim().toLowerCase();
    return (!query || `${trainer.name} ${trainer.id} ${trainer.specialty}`.toLowerCase().includes(query)) &&
      (this.branch() === 'All branches' || trainer.branch === this.branch());
  }));
  readonly pageItems = computed(() => this.filtered().slice((this.page() - 1) * this.pageSize, this.page() * this.pageSize));
  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));
  readonly displayEnd = computed(() => Math.min(this.page() * this.pageSize, this.filtered().length));

  constructor() { this.load(); }
  load(): void { this.trainerService.getAll().subscribe(items => this.trainers.set(items)); }
  setSearch(value: string): void { this.search.set(value); this.page.set(1); }
  setBranch(value: string): void { this.branch.set(value); this.page.set(1); }
  changePage(delta: number): void { this.page.set(Math.max(1, Math.min(this.pageCount(), this.page() + delta))); }
}
