import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';

@Directive({ selector: '[appClickOutside]', standalone: true })
export class AppClickOutsideDirective {
  readonly clickedOutside = output<void>({ alias: 'appClickOutside' });
  private readonly element = inject(ElementRef<HTMLElement>);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target;
    if (target instanceof Node && !this.element.nativeElement.contains(target)) {
      this.clickedOutside.emit();
    }
  }
}
