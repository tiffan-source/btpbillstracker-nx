import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Toogle } from './toogle';

describe('Toogle', () => {
  let component: Toogle;
  let fixture: ComponentFixture<Toogle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Toogle],
    }).compileComponents();

    fixture = TestBed.createComponent(Toogle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
