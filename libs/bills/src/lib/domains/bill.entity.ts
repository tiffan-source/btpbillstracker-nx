export enum BILL_STATUS {
  DRAFT = 'DRAFT',
  VALIDATED = 'VALIDATED',
  PAID = 'PAID'
}

export enum BILL_TYPES {
  SITUATION = 'Situation',
  SOLDE = 'Solde',
  ACOMPTES = 'Acompte'
}

export enum PAYMENT_MODES {
  VIREMENT = 'Virement',
  CHEQUE = 'Chèque',
  ESPECES = 'Espèces',
CARTE_BANCAIRE = 'Carte bancaire'
}

import {
  BILL_MIN_AMOUNT_TTC,
} from '../values/bill.constraints';

import { BillAmountBelowMinError } from '../errors/bill-amount-below-min.error';
import { BillClientRequiredError } from '../errors/bill-client-required.error';
import { BillDueDateRequiredError } from '../errors/bill-due-date-required.error';
import { BillExternalReferenceRequiredError } from '../errors/bill-external-reference-required.error';
import { InvalidBillTypeError } from '../errors/invalid-bill-type.error';
import { InvalidPaymentModeError } from '../errors/invalid-payment-mode.error';
import { BillChantierRequiredError } from '../errors/bill-chantier-required.error';

export class Bill {
  private readonly _id: string;
  private _clientId: string;
  private _chantierId: string;
  private _status: BILL_STATUS = BILL_STATUS.DRAFT;
  private _amountTTC?: number;
  private _dueDate?: string;
  private _externalInvoiceReference?: string;
  private _type?: BILL_TYPES;
  private _paymentMode?: PAYMENT_MODES;
  private _reminderScenarioId?: string;

  constructor(id: string, reference: string, clientId: string, chantierId: string) {
    if (!reference || reference.trim().length === 0) {
      throw new BillExternalReferenceRequiredError();
    }
    if (!clientId || clientId.trim().length === 0) {
      throw new BillClientRequiredError();
    }
    if (!chantierId || chantierId.trim().length === 0) {
      throw new BillChantierRequiredError();
    }

    this._id = id;
    this._externalInvoiceReference = reference;
    this._clientId = clientId;
    this._chantierId = chantierId;
  }

  get id(): string { return this._id; }
  get clientId(): string { return this._clientId; }
  get status(): BILL_STATUS { return this._status; }
  get amountTTC(): number | undefined { return this._amountTTC; }
  get dueDate(): string | undefined { return this._dueDate; }
  get externalInvoiceReference(): string | undefined { return this._externalInvoiceReference; }
  get type(): BILL_TYPES | undefined { return this._type; }
  get paymentMode(): PAYMENT_MODES | undefined { return this._paymentMode; }
  get chantierId(): string | undefined { return this._chantierId; }
  get chantier(): string | undefined { return this._chantierId; }
  get reminderScenarioId(): string | undefined { return this._reminderScenarioId; }

  setAmountTTC(amountTTC: number): this {
    if (amountTTC < BILL_MIN_AMOUNT_TTC) {
      throw new BillAmountBelowMinError();
    }
    this._amountTTC = amountTTC;
    return this;
  }

  setDueDate(dueDate: string): this {
    if (!dueDate || dueDate.trim().length === 0) {
      throw new BillDueDateRequiredError();
    }
    this._dueDate = dueDate;
    return this;
  }

  setExternalInvoiceReference(externalInvoiceReference: string): this {
    if (!externalInvoiceReference || externalInvoiceReference.trim().length === 0) {
      throw new BillExternalReferenceRequiredError();
    }
    this._externalInvoiceReference = externalInvoiceReference;
    return this;
  }

  setType(type: string): this {
    if (!isBillType(type)) {
      throw new InvalidBillTypeError();
    }
    this._type = type;
    return this;
  }

  setPaymentMode(paymentMode: string): this {
    if (!isPaymentMode(paymentMode)) {
      throw new InvalidPaymentModeError();
    }
    this._paymentMode = paymentMode;
    return this;
  }

  setClientId(clientId: string): this {
    if (!clientId || clientId.trim().length === 0) {
      throw new BillClientRequiredError();
    }
    this._clientId = clientId;
    return this;
  }

  setChantierId(chantierId: string): this {
    if (!chantierId || chantierId.trim().length === 0) {
      throw new BillChantierRequiredError();
    }
    this._chantierId = chantierId;
    return this;
  }

  setChantier(chantier: string): this {
    this.setChantierId(chantier);
    return this;
  }

  setStatus(status: BILL_STATUS): this {
    this._status = status;
    return this;
  }

  configureReminder(reminderScenarioId: string): this {
    this._reminderScenarioId = reminderScenarioId;
    return this;
  }
}

function isBillType(type: string): type is BILL_TYPES {
    return Object.values(BILL_TYPES).includes(type as BILL_TYPES);
}

function isPaymentMode(paymentMode: string): paymentMode is PAYMENT_MODES {
    return Object.values(PAYMENT_MODES).includes(paymentMode as PAYMENT_MODES);
}
