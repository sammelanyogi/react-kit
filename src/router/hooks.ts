import { useState, useEffect, useContext } from 'react';
import { Router, RouterContext, ConfirmTransition } from './Router';
import { Route } from './Route';

export function useRoute(router: Router) {
  const [route, setRoute] = useState<Route>();
  useEffect(() => router.register(setRoute), [router]);
  return route;
}

export function useRouter() {
  return useContext(RouterContext);
}

export function useRouteExit(beforeExit: ConfirmTransition) {
  const router = useRouter();
  useEffect(router.registerConfirm(beforeExit), [beforeExit]);
}
