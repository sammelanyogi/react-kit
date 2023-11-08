import { ValidationError } from './types';

type ErrorMsg = {
  title?: string;
  message: string;
};

export function isRequired(errorMsg: ErrorMsg) {
  return (value: any, name: string) => {
    if (!value || value.length === 0) {
      throw new ValidationError(name, errorMsg);
    }
    return value;
  };
}

export function isNumber(errorMsg: ErrorMsg) {
  return (value: string, name: string) => {
    if (!value || isNaN(Number(value))) {
      throw new ValidationError(name, errorMsg);
    }
  };
}

export function isInteger(errorMsg: ErrorMsg) {
  return (value: string, name: string) => {
    if (!value || !(Number.isInteger(parseFloat(value)) && parseFloat(value) > 0)) {
      throw new ValidationError(name, errorMsg);
    }
  };
}

export function minLength<T extends string | Array<any> = string>(x: number, errorMsg: ErrorMsg) {
  return (value: T, name: string) => {
    if (!value || value.length < x) {
      throw new ValidationError(name, errorMsg);
    }
    return value;
  };
}

export function maxLength<T extends string | Array<any> = string>(x: number, errorMsg: ErrorMsg) {
  return (value: T, name: string) => {
    if (!value || value.length > x) {
      throw new ValidationError(name, errorMsg);
    }
    return value;
  };
}

export function minValue(x: number, errorMsg: ErrorMsg) {
  return (value: string | undefined, name: string) => {
    if (!x || parseFloat(value) < x) {
      throw new ValidationError(name, errorMsg);
    }
    return value;
  };
}

export function maxValue(x: number, errorMsg: ErrorMsg) {
  return (value: string, name: string) => {
    if (parseFloat(value) > x) {
      throw new ValidationError(name, errorMsg);
    }
    return value;
  };
}
