import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientsChantiers } from './clients-chantiers';

describe('ClientsChantiers', () => {
  let component: ClientsChantiers;
  let fixture: ComponentFixture<ClientsChantiers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsChantiers],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientsChantiers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
