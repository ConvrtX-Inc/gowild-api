export enum MessageStatus {
  msSent = 1,
  msSeen = 2,
  msDeleted = 3,
}

export interface MessageInterface {
  userid: string;
  text?: string;
  attachment?: attachmentInterface | null;
  dateCreate?: Date;
}

interface attachmentInterface {
  extension: string;
  base64: string;
}
export class MessageDetail {
  private userid: string;
  private text: string;
  private attachment?: attachmentInterface| null;
  private status: number;
  private dateCreate: Date;

  public constructor(
    userid: string,
    msg: string,
    status: number,
    dateCreate: Date,
    attachment?: attachmentInterface| null,
  ) {
    this.userid = userid;
    this.text = msg;
    this.status = status;
    this.dateCreate = dateCreate;
    this.attachment = attachment;
  }

  get UserID(): string {
    return this.userid;
  }

  get Text(): string {
    return this.text;
  }

  get Status(): number {
    return this.status;
  }

  get dateCreated(): Date {
    return this.dateCreate;
  }
}
