import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateBills } from './create-bills';

describe('CreateBills', () => {
  let component: CreateBills;
  let fixture: ComponentFixture<CreateBills>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBills],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBills);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
