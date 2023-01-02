export enum MessageStatus {
  msSent = 1,
  msSeen = 2,
  msDeleted = 3,
}

export interface MessageInterface {
  userid: string;
  message?: string;
  attachment?: string | null;
  dateCreate?: Date;
}

export class MessageDetail {
  private userid: string;
  private message: string;
  private attachment?: string| null;
  private status: number;
  private dateCreate: Date;

  public constructor(
    userid: string,
    msg: string,
    status: number,
    dateCreate: Date,
    attachment?: string| null,
  ) {
    this.userid = userid;
    this.message = msg;
    this.status = status;
    this.dateCreate = dateCreate;
    this.attachment = attachment;
  }

  get UserID(): string {
    return this.userid;
  }

  get Text(): string {
    return this.message;
  }

  get Status(): number {
    return this.status;
  }

  get dateCreated(): Date {
    return this.dateCreate;
  }
}
