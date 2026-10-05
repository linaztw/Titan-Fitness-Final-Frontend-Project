import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookSession } from './book-session';

describe('BookSession', () => {
  let component: BookSession;
  let fixture: ComponentFixture<BookSession>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookSession],
    }).compileComponents();

    fixture = TestBed.createComponent(BookSession);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
