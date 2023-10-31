export type GenericState = {
  [name: string]: any;
};

export type Listener<V> = (v: V) => void;
export type Listeners<T> = {
  [key: string]: Array<Listener<T>>;
};

export class ValidationError extends Error {
  name: string;
  title?: string;

  constructor(name: string, obj?: {title?: string; message: string}) {
    super(obj?.message);
    this.name = name;
    this.title = obj?.title;
  }
}
export type ValidatorFunction = (value: any, name: string, state: any) => any;
