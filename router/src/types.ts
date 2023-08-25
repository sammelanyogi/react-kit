export type RouteMap<T> = Record<string, (params: object, queries: object) => T>;

export type SetRoute<T> = (setter: () => T) => void;

export type NavigationOptions = {
  replace?: 'always' | 'level' | true; // Replace the current route on stack with the new one
  shallow?: boolean;
};

export const DEFAULT_PATH = 'default_path';
export const NAVIGATION = 'navigation';
export const BACK = 'back';

export type RouteChangeSource = typeof DEFAULT_PATH | typeof NAVIGATION | typeof BACK;

export type RouteChangeCB = (url: string, source?: RouteChangeSource) => void;

export interface RouterDriver {
  getInitialUrl(): string | Promise<string>;
  subscribe(onChange: (url: string) => void): () => void;
}
