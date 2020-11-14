export default class Card{
  email: string;
  select: string;
  chips: string[];
  title: string;
  desc: string;
  isComplete: boolean;

  constructor(email: string, select: string, chips: string[], title: string, desc: string) {
    this.email = email;
    this.select = select;
    this.chips = chips;
    this.title = title;
    this.desc = desc;
    this.isComplete = false;
  }

  complete(status: boolean) {
    this.isComplete = status;
  }
}
