import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

@Directive({ selector: '[appAutofocus]', standalone: true })
export class AppAutofocusDirective implements AfterViewInit {
  private readonly element = inject(ElementRef<HTMLInputElement>);

  ngAfterViewInit(): void {
    queueMicrotask(() => this.element.nativeElement.focus());
  }
}
