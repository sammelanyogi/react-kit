import { createContext, useContext } from 'react';
import { Route } from './Route.js';
import type { Router } from './Router.js';

export const RouterContext = createContext<Route | null>(null);

/**
 * to be used only internally in the library
 * since on calling the router from the first time in the Portal it will return a null.
 * The null is an absolute necessity to initialize the root router.
 */
export function useRouterPortal() {
  const route = useContext(RouterContext);
  if (!route) return null;

  return route.router;
}

/**
 * to be used only the App-level
 * since @useRouterPortal returns a null, we need to check for null in the app-level code.
 * otherwise, the ts-compiler will complain.
 * To make it more ergonomic, we simply use **useRouter** in the app-level.
 */
export function useRouter() {
  const route = useContext(RouterContext);

  /**
   * by the time, this hook is called in the app-level
   * there should be an absolute certainity that a Portal has already initialized a router
   * if not, we throw an error.
   */
  if (!route) {
    throw new Error(
      'Router Error: useRouter should always be called within the context of the Portal. \n Did you wrap your component with Portal',
    );
  }

  return route.router as Router;
}

export function useRoute() {
  return useContext(RouterContext);
}

export function useQueryParams() {
  const router = useRouter();
  return router.getQueryParams();
}
