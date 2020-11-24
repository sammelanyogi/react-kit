import React, { ReactNode, useContext, useEffect, useState } from "react";

export class EffectHandler<T> {
  private listeners: Array<(newValue: T) => void> = [];
  private lastValue?: T;

  constructor(initialValue?: T) {
    this.lastValue = initialValue;
  }

  get = () => this.lastValue;

  fire = (value: T) => {
    if (value !== this.lastValue) {
      this.lastValue = value;
      this.listeners.forEach(l => l(value));
      return true;
    }

    return false;
  }

  register = (listener: (newValue: T) => void) => {
    this.listeners.push(listener);
    return () => {
      const idx = this.listeners.indexOf(listener);
      if (idx >= 0) {
        this.listeners.splice(idx, 1);
      }
    }
  }
}

type Props = {
  children: ReactNode | Array<ReactNode>;
}

export function createEffectContext<T>(createHandler: () => EffectHandler<T>) {
  const handler = createHandler();
  const context = React.createContext(handler);

  return {
    useTrigger: () => {
      const handler = useContext(context);
      return handler.fire;
    },
    useState: () => {
      const handler = useContext(context);
      const [value, setValue] = useState(handler.get);
      useEffect(() => handler.register(setValue), []);
      return [value, handler.fire];
    },
    useValue: () => {
      const handler = useContext(context);
      const [value, setValue] = useState(handler.get);
      useEffect(() => handler.register(setValue), []);
      return value;
    },
    Boundary: (props: Props) => {
      const [handler] = useState(createHandler);
      return React.createElement(context.Provider, { value: handler }, props.children);
    }
  }
}
