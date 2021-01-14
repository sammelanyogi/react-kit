import { Parser } from './Parser';

export class DecimalParser extends Parser<number> {
  constructor() {
    super();
    this.add((value: string) => {
      if (!value) return null;
      const v = Number(value);
      if (isNaN(v)) throw new Error('Numeric value is required');
      return v;
    });
  }

  min(min: number) {
    this.add((value: number) => {
      if (value < min) throw new Error(`Value must be greater than ${min}`);
      return value;
    });
    return this;
  }

  max(max: number) {
    this.add((value: number) => {
      if (value > max) throw new Error(`Value must be less than ${max}`);
      return value;
    });
    return this;
  }

  range(min: number, max: number) {
    this.min(min);
    this.max(max);
    return this;
  }
}
