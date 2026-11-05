import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'freezeAllowance', standalone: true })
export class FreezeAllowancePipe implements PipeTransform {
  transform(used: number | null | undefined, limit = 3): string {
    const remaining = Math.max(0, limit - (used ?? 0));
    return `${remaining} ${remaining === 1 ? 'freeze' : 'freezes'} remaining`;
  }
}
