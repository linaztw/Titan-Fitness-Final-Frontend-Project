import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MembershipPlan } from '../../../../core/api/plans/plan.dto';
import { PlanService } from '../../../../core/api/plans/plan.service';

@Component({
  selector: 'app-plan-catalogue',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './plan-catalogue.html'
})
export class PlanCatalogueComponent {
  private readonly planService = inject(PlanService);
  readonly plans = signal<MembershipPlan[]>([]);
  readonly search = signal('');
  readonly status = signal('All plans');
  readonly page = signal(1);
  readonly pageSize = 4;
  readonly filtered = computed(() => this.plans().filter(plan => {
    const query = this.search().trim().toLowerCase();
    return (!query || `${plan.name} ${plan.id}`.toLowerCase().includes(query)) &&
      (this.status() === 'All plans' || (this.status() === 'Published' ? plan.isPublished : !plan.isPublished));
  }));
  readonly pageItems = computed(() => this.filtered().slice((this.page() - 1) * this.pageSize, this.page() * this.pageSize));
  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));
  readonly displayEnd = computed(() => Math.min(this.page() * this.pageSize, this.filtered().length));

  constructor() { this.planService.getAll().subscribe(items => this.plans.set(items)); }
  setSearch(value: string): void { this.search.set(value); this.page.set(1); }
  setStatus(value: string): void { this.status.set(value); this.page.set(1); }
  changePage(delta: number): void { this.page.set(Math.max(1, Math.min(this.pageCount(), this.page() + delta))); }
}
