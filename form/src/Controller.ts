import {
  FormDef,
  FormValidatorFunction,
  Listener,
  ValidationError,
  ValidatorFunction,
} from './types';

export class Controller<T extends FormDef, S = any> {
  private inputs: { [key in keyof T]: T[key]['value'] };

  private transformer: (data: { [key in keyof T]: T[key]['value'] } | {}) => S;

  private inputListeners: { [K in keyof T]: Array<Listener<T[K]['value']>> };
  private errorListeners: { [K in keyof T]: Array<Listener<ValidationError | undefined>> };

  private validators: { [key in keyof T]: Array<ValidatorFunction<T>> };
  private finalFormValidator?: FormValidatorFunction<S>;
  private onCommit?: (formData: any) => void;

  constructor(
    initialState: { [key in keyof T]: T[string]['value'] } | {},
    transformer: (data: { [key in keyof T]: T[string]['value'] }) => S,
    meta: { validator?: FormValidatorFunction<S>; onCommit?: (formData: any) => void } = undefined,
  ) {
    this.inputs = initialState || ({} as any);

    this.inputListeners = {} as any;
    this.errorListeners = {} as any;
    this.validators = {} as any;
    this.finalFormValidator = meta?.validator;
    this.onCommit = meta?.onCommit;

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

  getValidatorsFor<K extends keyof T>(name: K): T[K]['value'] | undefined {
    return this.validators[name];
  }

  getValidators(inputs?: string[]) {
    if (!inputs) {
      return this.validators;
    } else {
      const filteredV: { [key: string]: Array<ValidatorFunction<T>> } = {};
      inputs.forEach(input => {
        filteredV[input] = this.validators[input];
      });
      return filteredV;
    }
  }

  setValidatorsFor<K extends keyof T>(name: K, validators: Array<ValidatorFunction<T>>) {
    this.validators[name] = validators;
  }

  setError<K extends keyof T>(name: K, error: ValidationError | undefined) {
    this.errorListeners[name]?.forEach(listener => listener(error));
  }

  get<K extends keyof T>(name: K, defaultValue?: T[K]['value']): T[K]['value'] | undefined {
    const res = this.inputs[name];
    return res === undefined ? defaultValue : res;
  }

  set<K extends keyof T>(name: K, newValue: T[K]['value']) {
    // Object only if value changes
    if (newValue === this.inputs[name]) {
      return;
    }
    this.inputs = Object.assign({}, this.inputs, { [name]: newValue });
    this.inputListeners[name]?.forEach(l => l(newValue));
  }

  private register<V>(
    target: { [K in keyof T]: Array<Listener<T[K]['value']> | ValidationError | undefined> },
    name: keyof T,
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

  listenInput<Key extends keyof T>(name: keyof T, listener: (value: T[Key]['value']) => void) {
    return this.register(this.inputListeners, name, listener);
  }

  listenError(name: string, listener: (value: ValidationError) => void) {
    return this.register(this.errorListeners, name, listener);
  }
}
