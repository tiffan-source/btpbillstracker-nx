import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEnrichedBillUseCase } from '@btpbilltracker/bills';
import { CreateChantierUseCase } from '@btpbilltracker/chantiers';
import { CreateQuickClientUseCase } from '@btpbilltracker/clients';
import { MessageService } from 'primeng/api';
import { CreateBills } from './create-bills';

describe('CreateBills', () => {
  let component: CreateBills;
  let fixture: ComponentFixture<CreateBills>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBills],
      providers: [
        {
          provide: CreateEnrichedBillUseCase,
          useValue: { execute: async () => ({ success: true, data: { id: 'bill-1' } }) },
        },
        {
          provide: CreateQuickClientUseCase,
          useValue: { execute: async () => ({ success: true, data: { id: 'client-1' } }) },
        },
        {
          provide: CreateChantierUseCase,
          useValue: { execute: async () => ({ success: true, data: { id: 'chantier-1' } }) },
        },
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBills);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
