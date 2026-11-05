import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'highlight', standalone: true })
export class HighlightPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    switch ((value ?? '').toLowerCase()) {
      case 'active': return 'bg-success text-white';
      case 'frozen': return 'bg-warning text-dark';
      case 'expired': return 'bg-secondary text-white';
      default: return 'bg-light text-dark';
    }
  }
}
