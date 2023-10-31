import {useEffect, useState} from 'react';
import {useFormContext} from './Form';
import {ValidationError, ValidatorFunction} from './types';

export function useFormInput<T>(
  name: string,
  validators: Array<ValidatorFunction>,
  defaultValue?: T,
  errorsAssociated?: string[],
): [
  v: T | undefined,
  fn: (newVal: T) => void,
  blr: () => void,
  fcs: () => void,
] {
  const ctx = useFormContext();
  const [value, setValue] = useState<T | undefined>(
    ctx.getInput(name) || defaultValue,
  );

  const onChangeText = (newVal: T) => {
    setValue(newVal);
    ctx.setInput(name, newVal);
    ctx.setError(name, undefined);
    ctx.setError('scope', undefined);
    errorsAssociated?.forEach(e => ctx.setError(e, undefined));
  };

  const onFocus = () => {
    // ctx.setError(name, undefined);
  };

  const onBlur = () => {
    try {
      validators.forEach(fn => fn(value, name, ctx.tempState));
    } catch (e: any) {
      let vE: ValidationError = e;
      if (!(e instanceof ValidationError)) {
        vE = new ValidationError(name, {
          message: e.message,
        });
      }
      ctx.setError(vE.name, vE);
    }
  };

  useEffect(() => {
    ctx.setValidatorsFor(name, validators);
  }, [ctx, name, validators]);

  useEffect(() => ctx.listenInput(name, setValue), [ctx, name, validators]);

  return [value, onChangeText, onBlur, onFocus];
}

export function useInputError(name: string) {
  const ctx = useFormContext();
  const [error, setError] = useState<ValidationError | undefined>(undefined);
  useEffect(() => ctx.listenError(name, setError), [ctx, name]);
  return error;
}
