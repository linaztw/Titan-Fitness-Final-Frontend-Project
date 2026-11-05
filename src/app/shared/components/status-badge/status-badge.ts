import { Component, input } from '@angular/core';
import { HighlightPipe } from '../../pipes/highlight.pipe';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [HighlightPipe],
  templateUrl: './status-badge.html'
})
export class StatusBadgeComponent {
  readonly status = input.required<string>();
}
