import {
  FormInputs,
  FormMeta,
  FormValidatorFunction,
  FormValidators,
  Listener,
  ValidationError,
  ValidatorFunction,
} from './types';

export class Controller<S = any> {
  private inputs: FormInputs;

  private transformer: (data: FormInputs | {}) => S;

  private inputListeners: { [k: string]: Array<Listener<any>> };
  private errorListeners: { [k: string]: Array<Listener<ValidationError | undefined>> };

  private validators: FormValidators;
  private finalFormValidator?: FormValidatorFunction<S>;
  private onCommit?: (formData: FormInputs) => void;

  constructor(
    initialState: FormInputs | {},
    transformer: (data: FormInputs) => S,
    meta?: FormMeta<S> | undefined,
  ) {
    this.inputs = initialState || ({} as any);

    this.inputListeners = {} as any;
    this.errorListeners = {} as any;
    this.finalFormValidator = meta?.validator;
    if (meta) {
      this.validators = meta.inputValidators || {};
      this.onCommit = meta?.onCommit;
    } else {
      this.validators = {};
    }

    this.transformer = transformer;
  }

  get data() {
    return this.transformer(this.inputs);
  }

  get rawData() {
    return this.inputs;
  }

  commit() {
    if (this.onCommit) {
      this.onCommit(this.inputs);
    }
  }

  get validator() {
    return this.finalFormValidator;
  }

  get tempState() {
    return this.inputs;
  }

  get inputValidators() {
    return this.validators;
  }

  getValidatorsFor<T>(name: string): Array<ValidatorFunction<T>> | undefined {
    return this.validators[name];
  }

  getValidators(inputs?: string[]) {
    if (!inputs) {
      return this.validators;
    } else {
      const filteredV: { [key: string]: Array<ValidatorFunction<any>> } = {};
      inputs.forEach(input => {
        filteredV[input] = this.validators[input];
      });
      return filteredV;
    }
  }

  setValidatorsFor<T>(name: string, validators: Array<ValidatorFunction<T>>) {
    this.validators[name] = validators;
  }

  setError(name: string, error: ValidationError | undefined) {
    this.errorListeners[name]?.forEach(listener => listener(error));
  }

  get<T>(name: string, defaultValue?: T): T | undefined {
    const res = this.inputs[name];
    return res === undefined ? defaultValue : res;
  }

  set<T>(name: string, newValue: T) {
    // Object only if value changes
    if (newValue === this.inputs[name]) {
      return;
    }
    this.inputs = Object.assign({}, this.inputs, { [name]: newValue });
    this.inputListeners[name]?.forEach(l => l(newValue));
  }

  updateBulk(value: FormInputs) {
    Object.entries(value).forEach(([name, value]) => {
      this.inputs[name] = value;
      this.inputListeners[name]?.forEach(l => l(value));
    });
  }

  private register<V>(
    target: { [k: string]: Array<Listener<any | ValidationError | undefined>> },
    name: string,
    listener: Listener<V>,
  ) {
    let list = target[name as string];
    if (!list) {
      list = [];
      target[name] = list;
    }
    list.push(listener);

    return () => {
      const idx = list.indexOf(listener);
      list.splice(idx, 1);
      if (list.length === 0) {
        delete target[name as string];
      }
    };
  }

  listenInput<T>(name: string, listener: (value: T) => void) {
    return this.register(this.inputListeners, name, listener);
  }

  listenError(name: string, listener: (value: ValidationError) => void) {
    return this.register(this.errorListeners, name, listener);
  }
}
