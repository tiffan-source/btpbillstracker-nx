import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextError } from './text-error';

describe('TextError', () => {
  let component: TextError;
  let fixture: ComponentFixture<TextError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextError],
    }).compileComponents();

    fixture = TestBed.createComponent(TextError);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
