import { Parser } from './Parser.js';

export class DecimalParser extends Parser<number> {
  constructor() {
    super();
    this.add((value: string) => {
      if (!value) return null;
      const v = Number(value);
      if (isNaN(v)) throw new Error('Please enter a numeric value.');
      return v;
    });
  }

  min(min: number, errorMsg?: string) {
    this.add((value: number) => {
      if (value < min) throw new Error(errorMsg || `Value must be greater than ${min}`);
      return value;
    });
    return this;
  }

  max(max: number, errorMsg?: string) {
    this.add((value: number) => {
      if (value > max) throw new Error(errorMsg || `Value must be less than ${max}`);
      return value;
    });
    return this;
  }

  range(min: number, max: number, minErrorMsg?: string, maxErrorMsg?: string) {
    this.min(min, minErrorMsg);
    this.max(max, maxErrorMsg);
    return this;
  }
}
