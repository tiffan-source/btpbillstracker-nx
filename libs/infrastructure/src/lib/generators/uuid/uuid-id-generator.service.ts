import { Injectable } from '@angular/core';
import { v7 as uuidv7 } from 'uuid';
import { IdGeneratorPort } from '@btpbilltracker/chore';

@Injectable({ providedIn: 'root' })
export class UuidIdGeneratorService extends IdGeneratorPort {
  generate(): string {
    return uuidv7();
  }
}

