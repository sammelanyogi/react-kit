export type Listener<V> = (v: V) => void;

export class ValidationError extends Error {
  name: string;
  title?: string;

  constructor(name: string, obj?: { title?: string; message: string }) {
    super(obj?.message);
    this.name = name;
    this.title = obj?.title;
  }
}
export type ValidatorFunction<T> = (value: T, name: string, state: FormInputs) => T;
export type FormValidatorFunction<S = any> = (state: S) => boolean;

export type FormValidators = {
  [k: string]: Array<ValidatorFunction<any>>;
};

export type FormInputs = {
  [k: string]: any;
};

export type FormMeta<S> =
  | {
      validator?: FormValidatorFunction<S>;
      inputValidators?: FormValidators;
      onCommit?: (formData: any) => void;
    }
  | undefined;
