import React, { createContext, useContext, useRef } from 'react';
import { Controller } from './Controller';
import { FormInputs, FormMeta } from './types';

const FormContext = createContext(null as unknown as Controller);

export function useFormController<S = any>(
  inititalState: FormInputs,
  transform: (data: FormInputs) => S,
  meta?: FormMeta<S>,
) {
  const ref = useRef<Controller<S> | null>(null);
  if (!ref.current) {
    ref.current = new Controller<S>(inititalState, transform, meta);
  }
  return ref.current;
}

type Props<S> = {
  controller: Controller<S>;
  children: React.ReactNode;
};

export function Form<S>({ controller, children }: Props<S>) {
  return <FormContext.Provider value={controller}>{children}</FormContext.Provider>;
}

export function useFormContext<S>() {
  const ctx = useContext<Controller<S>>(FormContext);
  return ctx;
}
