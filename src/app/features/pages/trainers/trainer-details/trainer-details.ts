import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Trainer } from '../../../../core/api/trainers/trainer.dto';
import { TrainerService } from '../../../../core/api/trainers/trainer.service';

@Component({
  selector: 'app-trainer-details',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './trainer-details.html'
})
export class TrainerDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly trainerService = inject(TrainerService);
  readonly id = this.route.snapshot.paramMap.get('id');
  readonly mode: 'view' | 'add' | 'edit' = this.route.snapshot.routeConfig?.path === 'new' ? 'add' : this.route.snapshot.url.some(part => part.path === 'edit') ? 'edit' : 'view';
  readonly trainer = signal<Trainer | null>(null);
  readonly name = signal('');
  readonly specialty = signal('');
  readonly branch = signal('');
  readonly email = signal('');
  readonly phone = signal('');
  readonly isActive = signal(false);
  readonly attempted = signal(false);
  readonly missing = signal(false);
  readonly emailIsValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email()));
  readonly isValid = computed(() => this.name().trim().length >= 2 && !!this.branch() && this.emailIsValid());

  constructor() {
    if (this.id) this.trainerService.getById(this.id).subscribe(value => {
      this.trainer.set(value ?? null);
      if (!value) { this.missing.set(true); return; }
      this.name.set(value.name); this.specialty.set(value.specialty); this.branch.set(value.branch);
      this.email.set(value.email); this.phone.set(value.phone); this.isActive.set(value.isActive);
    });
  }

  save(): void {
    this.attempted.set(true);
    if (!this.isValid()) return;
    const data = { name: this.name().trim(), specialty: this.specialty().trim(), branch: this.branch(), email: this.email().trim(), phone: this.phone().trim(), isActive: this.isActive() };
    if (this.mode === 'edit' && this.id) this.trainerService.update(this.id, data).subscribe(saved => saved && this.router.navigate(['/trainers', saved.id]));
    else this.trainerService.create(data).subscribe(saved => this.router.navigate(['/trainers', saved.id]));
  }
}
