import React, { useContext, createContext, useRef } from 'react';
import { Controller } from './Controller';
import { FormValidatorFunction, FormDef } from './types';

const FormContext = createContext(null);

export function useFormController<T extends FormDef, S = any>(
  inititalState: { [key in keyof T]: T[string]['value'] },
  transform: (data: { [key in keyof T]: T[string]['value'] }) => S,
  meta?: {
    validator?: FormValidatorFunction<S>;
    onCommit?: (formData: T) => void;
  },
) {
  const ref = useRef<Controller<T, S> | null>(null);
  if (!ref.current) {
    ref.current = new Controller<T, S>(inititalState, transform, meta);
  }
  return ref.current;
}

type Props<T extends FormDef, S> = {
  controller: Controller<T, S>;
  children: React.ReactNode;
};

export function Form<T extends FormDef, S>({ controller, children }: Props<T, S>) {
  return <FormContext.Provider value={controller}>{children}</FormContext.Provider>;
}

export function useFormContext<T extends FormDef, S>() {
  const ctx = useContext<Controller<T, S>>(FormContext);
  return ctx;
}
