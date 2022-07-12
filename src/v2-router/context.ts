import { createContext, useContext } from 'react';
import { Route } from './Route.js';
import type { Router } from './Router.js';

export const RouterContext = createContext<Route | null>(null);

/**
 * to be used only internally in the library
 * since on calling the router from the first time in the Portal it will return a null.
 */
export function useRouterPortal() {
  const route = useContext(RouterContext);
  if (!route) return null;

  return route.router;
}

/**
 * to be used only the App-level
 */
export function useRouter() {
  const route = useContext(RouterContext);

  /**
   * by the time, this hook is called in the app-level
   * there should be absolute certainity that a Portal has already initialized a router
   * if not, we throw an error.
   */
  if (!route) throw new Error('Router Error: Did you wrap your component with Portal');

  return route.router as Router;
}

export function useRoute() {
  return useContext(RouterContext);
}
