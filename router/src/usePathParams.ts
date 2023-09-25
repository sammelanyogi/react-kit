import { useContext } from 'react';
import { RouteContext } from './RouteController.js';

export function usePathParams() {
  const route = useContext(RouteContext);

  return { ...route.accumulatedParams, ...route.currentObj?.params };
}
