import { useContext, useEffect, useRef, useState } from 'react';
import { FormContext, FormController } from './FormController.js';
import { FormDefinition, GenericState } from './types.js';

export function useInputError(name: string): undefined | null | Error {
  const controller = useContext(FormContext);
  const [error, setError] = useState<Error | null | undefined>(() => controller.checkError(name));
  useEffect(() => {
    return controller.listenError(name, setError);
  }, [name, controller]);

  return error;
}

export function useMultipleInputErrors(names?: string[]): (undefined | null | Error)[] {
  const controller = useContext(FormContext);
  const [errors, setErrors] = useState<(Error | null | undefined)[]>(() =>
    names ? names.map(name => controller.checkError(name)) : [],
  );

  useEffect(() => {
    return controller.listenErrors(
      Object.fromEntries(
        names
          ? names.map(name => [
              name,
              (err: Error) =>
                setErrors(prev => {
                  const idx = names.indexOf(name);
                  if (prev[idx] === err || prev[idx]?.message === err?.message) {
                    return prev;
                  }
                  prev[idx] = err;
                  return [...prev];
                }),
            ])
          : [],
      ),
    );
  }, [names, controller]);

  if (!controller || !names) {
    return undefined;
  }
  return errors;
}

export function useFormValue<T extends GenericState>(name: keyof T) {
  const controller = useContext(FormContext);
  return useFormValueOf<T>(controller, name);
}

export function useFormValueOf<T extends GenericState>(
  controller: FormController<T>,
  name: keyof T,
) {
  const [value, setValue] = useState(controller.get(name));

  useEffect(() => {
    return controller.listen(name, setValue);
  }, [controller, name]);

  return value;
}

export function useFormInput<E = string>(
  name: string,
  extractValue?: (evt: E) => string,
): [string, (evt: E) => void] {
  const controller = useContext(FormContext);
  const [value, setValue] = useState(controller.getInput(name));

  return [
    value,
    (newValue: E) => {
      const k = extractValue ? extractValue(newValue) : (newValue as never as string);
      controller.setInput(name, k);
      setValue(k);
    },
  ];
}

export function useFormController<T extends GenericState>(
  def: FormDefinition<T>,
  initialState?: Partial<T>,
  action?: string,
) {
  const parentForm = useContext(FormContext);
  const ref = useRef<FormController<T>>();
  if (!ref.current) {
    ref.current = new FormController(def, initialState, action, parentForm);
  }

  return ref.current;
}
