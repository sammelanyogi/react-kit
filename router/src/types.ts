import React from "react";

export type RouteMap<T> = Record<string, (params: object, queries: object) => T>;

export type SetRoute<T> = (setter: () => T) => void;

export type NavigationOptions = {
  replace?: 'always' | 'level' | true,  // Replace the current route on stack with the new one
}

export interface RouterDriver {
  getInitialUrl(): string | Promise<string>;
  subscribe(onChange: (url: string) => void): (() => void);
}
