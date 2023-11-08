import { useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext } from './Form';
import { ValidationError, ValidatorFunction } from './types';

export function useFormInput<T, S = any>(
  name: string,
  metadata: {
    validators?: ValidatorFunction<T, S>[];
    defaultValue?: T;
    errorsAssociated?: string[];
    formDef?: T;
  } = { validators: [] },
): [v: T, fn: (newVal: T) => void, blr: () => void, fcs: () => void] {
  const ctx = useFormContext<any, S>();
  const { validators, defaultValue, errorsAssociated } = metadata;
  const [value, setValue] = useState<T>(ctx.get(name) || defaultValue);

  const onChangeText = (newVal: T) => {
    setValue(newVal);
    ctx.set(name, newVal);
    ctx.setError(name, undefined);
    ctx.setError('scope', undefined);
    errorsAssociated?.forEach(e => ctx.setError(e, undefined));
  };

  const onFocus = () => {
    // ctx.setError(name, undefined);
  };

  const onBlur = () => {
    try {
      validators.forEach(fn => fn(value, name as string, ctx.tempState));
    } catch (e: any) {
      let vE: ValidationError = e;
      if (!(e instanceof ValidationError)) {
        vE = new ValidationError(name.toString(), {
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

export function useSetInput<T = any>(name: string) {
  const ctx = useFormContext();
  return (value: T) => {
    ctx.set(name, value);
    ctx.setError(name, undefined);
    ctx.setError('scope', undefined);
  };
}

export function useSetError(name: string) {
  const ctx = useFormContext();
  return (error: ValidationError) => ctx.setError(name, error);
}

export function useFormValue<T = any>(name: string) {
  const form = useFormContext();
  const [value, setValue] = useState<T>(form.get(name));
  useEffect(() => form.listenInput(name, setValue), [form, name]);
  return value;
}

export function useTempInput<T = any>(name: string): [fn: () => void, f: () => boolean] {
  const form = useFormContext();
  const preservedValue = useRef<T>(form.get(name));

  const discardChanges = useCallback(() => {
    form.set(name, preservedValue.current);
  }, []);

  const isValueChanged = useCallback(() => {
    return form.get(name) !== preservedValue.current;
  }, []);
  return [discardChanges, isValueChanged];
}
