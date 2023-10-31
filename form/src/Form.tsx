import React, {useContext, createContext, useRef} from 'react';
import {Controller} from './Controller';
import {GenericState} from './types';

const FormContext = createContext<Controller<any>>(
  null as unknown as Controller<any>,
);

export function useFormController<T extends GenericState>(
  inititalState: any,
  transform: (data: any) => any,
) {
  const ref = useRef<Controller<T> | null>(null);
  if (!ref.current) {
    ref.current = new Controller<any>(inititalState, transform);
  }
  return ref.current;
}

type Props<T extends GenericState> = {
  controller: Controller<T>;
  children: React.ReactNode;
};

export function Form<T extends GenericState>({controller, children}: Props<T>) {
  return (
    <FormContext.Provider value={controller}>{children}</FormContext.Provider>
  );
}

export const useFormContext = () => {
  const ctx = useContext(FormContext);
  return ctx;
};
