import { InvalidClientNameError } from '../errors/invalid-client-name.error';

export class Client {
  private readonly _id: string;
  private _firstName: string;
  private _lastName: string;
  private _email?: string;
  private _phone?: string;

  constructor(id: string, firstName: string, lastName: string) {
    if (!firstName || firstName.trim().length === 0) {
      throw new InvalidClientNameError();
    }
    this._id = id;
    this._firstName = firstName.trim();
    this._lastName = lastName.trim();
  }

  get id(): string { return this._id; }
  get firstName(): string { return this._firstName; }
  get lastName(): string { return this._lastName; }
  get email(): string | undefined { return this._email; }
  get phone(): string | undefined { return this._phone; }

  setFirstName(firstName: string): this {
    const value = firstName.trim();
    if (!value) {
      throw new InvalidClientNameError();
    }

    this._firstName = value;
    return this;
  }

  setLastName(lastName: string): this {
    const value = lastName.trim();
    if (!value) {
      throw new InvalidClientNameError();
    }

    this._lastName = value;
    return this;
  }

  setEmail(email: string): this {
    this._email = email.trim();
    return this;
  }

  setPhone(phone: string): this {
    this._phone = phone.trim();
    return this;
  }

}
