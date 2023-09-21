import { Parser } from './Parser.js';

export class TextParser extends Parser<string> {
  minLength(n: number, errorMsg?: string) {
    this.add((value: string) => {
      const v = value.trim();
      if (v.length < n) {
        throw new Error(errorMsg || `At least ${n} characters are required`);
      }
      return v;
    });
    return this;
  }

  maxLength(n: number, errorMsg?: string) {
    this.add((value: string) => {
      const v = value.trim();
      if (v.length > n) throw new Error(errorMsg || `No more than ${n} characters allowed`);
      return v;
    });
    return this;
  }
}
