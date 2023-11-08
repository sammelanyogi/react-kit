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
export type ValidatorFunction<T, S = any> = (value: T, name: string, state: S) => T;
export type FormValidatorFunction<S = any> = (state: S) => boolean;

export type InputField<T = any, S = any> = {
  value: T;
  validators: Array<(value: T, name: string, state: S) => T>;
};

export interface FormDef {
  [key: string]: InputField;
}

// {
//   firstName: {
//     type: string,
//     validators: [function ko list]
//   },
//   lastName: {
//     type: AbortController,
//     validators: []function
//   }
// }

// useFormInput<EditProfileForm>('firstName', [] )

// FileSystemFileEntry()
