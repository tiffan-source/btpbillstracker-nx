type IntervalAndMessage = {
  interval: number;
  messageTitle: string;
  emailMessage: string;
  smsMessage: string;
};

export class Reminder {
  private readonly _id: string;
  private readonly _title: string;
  private readonly _messagesToSend: IntervalAndMessage[] = [];
  private readonly _description?: string;


  constructor(id: string, title: string, description?: string) {
    this._id = id;
    this._title = title;
    this._description = description;
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get description() {
    return this._description;
  }

    get messagesToSend() {
    return this._messagesToSend;
  }

  addMessageToSend(interval: number, messageTitle: string, emailMessage: string, smsMessage: string) {
    this._messagesToSend.push({ interval, messageTitle, emailMessage, smsMessage });
  }
}