import { describe, expect, it } from 'vitest';
import {
  BILL_MIN_AMOUNT_TTC,
} from './bill.constraints';

describe('bill.constraints', () => {
  it('defines minimum amount TTC constraint', () => {
    expect(BILL_MIN_AMOUNT_TTC).toBe(0);
  });
});
