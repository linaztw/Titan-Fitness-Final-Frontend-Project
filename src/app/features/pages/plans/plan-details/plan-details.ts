import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MembershipPlan, PlanAccessScope } from '../../../../core/api/plans/plan.dto';
import { PlanService } from '../../../../core/api/plans/plan.service';

@Component({
  selector: 'app-plan-details',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './plan-details.html'
})
export class PlanDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly planService = inject(PlanService);
  readonly id = this.route.snapshot.paramMap.get('id');
  readonly mode: 'view' | 'add' | 'edit' = this.route.snapshot.routeConfig?.path === 'new' ? 'add' : this.route.snapshot.url.some(part => part.path === 'edit') ? 'edit' : 'view';
  readonly plan = signal<MembershipPlan | null>(null);
  readonly name = signal('');
  readonly price = signal<number | null>(null);
  readonly durationMonths = signal<number | null>(null);
  readonly isPublished = signal(false);
  readonly maxFreezeDays = signal(0);
  readonly maxFreezes = signal(0);
  readonly guestPassQuota = signal(0);
  readonly accessScope = signal<PlanAccessScope>('Home branch only');
  readonly attempted = signal(false);
  readonly missing = signal(false);
  readonly isValid = computed(() => this.name().trim().length >= 2 && this.price() !== null && this.price()! >= 0 && this.durationMonths() !== null && this.durationMonths()! > 0 && this.maxFreezeDays() >= 0 && this.maxFreezes() >= 0 && this.guestPassQuota() >= 0);

  constructor() {
    if (this.id) this.planService.getById(this.id).subscribe(value => {
      this.plan.set(value ?? null);
      if (!value) { this.missing.set(true); return; }
      this.name.set(value.name); this.price.set(value.price); this.durationMonths.set(value.durationMonths);
      this.isPublished.set(value.isPublished); this.maxFreezeDays.set(value.maxFreezeDays);
      this.maxFreezes.set(value.maxFreezes); this.guestPassQuota.set(value.guestPassQuota); this.accessScope.set(value.accessScope);
    });
  }

  save(): void {
    this.attempted.set(true);
    if (!this.isValid()) return;
    const data = { name: this.name().trim(), price: Number(this.price()), durationMonths: Number(this.durationMonths()), isPublished: this.isPublished(), maxFreezeDays: Number(this.maxFreezeDays()), maxFreezes: Number(this.maxFreezes()), guestPassQuota: Number(this.guestPassQuota()), accessScope: this.accessScope() };
    if (this.mode === 'edit' && this.id) this.planService.update(this.id, data).subscribe(saved => saved && this.router.navigate(['/plans', saved.id]));
    else this.planService.create(data).subscribe(saved => this.router.navigate(['/plans', saved.id]));
  }
}
