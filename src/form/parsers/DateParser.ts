import { Parser } from "./Parser";

export class DateParser extends Parser<Date> {
  constructor() {
    super();
    this.add((value: string) => {
      return new Date(value);
    });
  }
}
