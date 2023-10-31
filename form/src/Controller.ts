import {
  GenericState,
  Listener,
  Listeners,
  ValidationError,
  ValidatorFunction,
} from './types';

export class Controller<T extends GenericState> {
  private state: T;
  private inputs: GenericState;

  private transformer: (data: T) => any;

  private inputListeners: Listeners<any>;
  private errorListeners: Listeners<ValidationError | undefined>;
  private validators: {[key: string]: Array<ValidatorFunction>};

  constructor(initialState: any, transformer: (data: T) => any) {
    this.state = (initialState as T) || {};
    this.inputs = initialState || {};

    this.inputListeners = {};
    this.errorListeners = {};
    this.validators = {};

    this.transformer = transformer;
  }

  get currentState() {
    return this.state;
  }

  get data() {
    return this.transformer(this.state);
  }

  get tempState() {
    return this.inputs;
  }

  get inputValidators() {
    return this.validators;
  }

  getValidatorsFor(name: string) {
    return this.validators[name];
  }

  getValidators(inputs?: string[]) {
    if (!inputs) {
      return this.validators;
    } else {
      const filteredV: {[key: string]: Array<ValidatorFunction>} = {};
      inputs.forEach(input => {
        filteredV[input] = this.validators[input];
      });
      return filteredV;
    }
  }

  setValidatorsFor(name: string, validators: Array<ValidatorFunction>) {
    this.validators[name] = validators;
  }

  setError(name: string, error: ValidationError | undefined) {
    this.errorListeners[name]?.forEach(listener => listener(error));
  }

  get<K extends keyof T>(name: K, defaultValue?: T[K]): T[K] | undefined {
    const res = this.state[name];
    return res === undefined ? defaultValue : res;
  }

  set(name: string, newValue: any) {
    // Object only if value changes
    if (newValue === this.state[name]) {
      return;
    }
    this.state = Object.assign({}, this.state, {[name]: newValue});
    const listeners = this.inputListeners[name];
    if (listeners) {
      listeners.forEach(l => l(newValue));
    }
  }

  getInput<I>(name: string): I {
    const k = this.inputs[name];
    return k;
  }

  setInput<I>(name: string, newValue: I) {
    this.inputs[name] = newValue;
  }

  private register<V>(
    target: Listeners<V>,
    name: keyof T,
    listener: Listener<V>,
  ) {
    let list = target[name as string];
    if (!list) {
      list = [];
      target[name as string] = list;
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

  listenInput<Key extends keyof T>(
    name: keyof T,
    listener: (value: T[Key]) => void,
  ) {
    return this.register(this.inputListeners, name, listener);
  }

  listenError(name: string, listener: (value: ValidationError) => void) {
    return this.register(this.errorListeners, name, listener);
  }
}
