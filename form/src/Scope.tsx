import React, { createContext, useContext } from 'react';

const ScopeContext = createContext(
  null as unknown as { validator: (state: any) => any; inputs?: string[] },
);

type ScopeProps = {
  validator: (state: any) => boolean;
  children: React.ReactNode;
};

export function Scope({ validator, children }: ScopeProps) {
  return <ScopeContext.Provider value={{ validator }}>{children}</ScopeContext.Provider>;
}

export const useScopeContext = () => {
  try {
    const ctx = useContext(ScopeContext);
    return ctx;
  } catch (e) {
    return undefined;
  }
};
