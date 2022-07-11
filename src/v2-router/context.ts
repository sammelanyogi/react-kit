import { createContext, useContext } from 'react';
import { Route } from './Route.js';
import type { Router } from './Router.js';

export const RouterContext = createContext<Route | null>(null);

export function useRouter() {
  const route = useContext(RouterContext);
  if (!route) return null;

  return route.router as Router;
}

export function useRoute() {
  return useContext(RouterContext);
}
