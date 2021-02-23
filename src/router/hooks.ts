import { useState, useEffect, useContext } from 'react';
import { Router, RouterContext, ConfirmTransition } from './Router.js';
import { Route } from './Route.js';

export function useRoute(router: Router) {
  const [route, setRoute] = useState<Route>(router.getInitialRoute);
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
