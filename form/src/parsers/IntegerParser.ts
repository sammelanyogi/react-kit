import { DecimalParser } from './DecimalParser.js';

export class IntegerParser extends DecimalParser {
  constructor() {
    super();

    this.add((value: string) => {
      if (!value) return null;
      if (/^[-+]?(\d+)$/.test(value)) {
        return Number(value);
      }
      throw new Error('Please provide a numeric value without decimal.');
    });
  }
}
