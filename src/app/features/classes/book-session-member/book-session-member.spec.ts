import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookSessionMember } from './book-session-member';

describe('BookSessionMember', () => {
  let component: BookSessionMember;
  let fixture: ComponentFixture<BookSessionMember>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookSessionMember],
    }).compileComponents();

    fixture = TestBed.createComponent(BookSessionMember);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
