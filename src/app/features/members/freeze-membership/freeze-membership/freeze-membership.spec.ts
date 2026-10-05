import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FreezeMembership } from './freeze-membership';

describe('FreezeMembership', () => {
  let component: FreezeMembership;
  let fixture: ComponentFixture<FreezeMembership>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreezeMembership],
    }).compileComponents();

    fixture = TestBed.createComponent(FreezeMembership);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
