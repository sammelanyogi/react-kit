import { useState, useEffect, useContext } from 'react';
import { Router, RouterContext, ConfirmTransition } from './Router.js';
import { Route } from './Route.js';

export function useRoute(router: Router) {
  const parentRouter = useRouter();
  const isParent = parentRouter === router;
  const [route, setRoute] = useState<Route>(() => router.getInitialRoute(isParent ? null : parentRouter));
  useEffect(() => {
    const unreg = parentRouter.registerChild(router);
    const regRoute = router.register(setRoute);
    return () => {
      regRoute();
      unreg();
    };
  }, [parentRouter, router]);
  return route;
}

export function useRouter() {
  return useContext(RouterContext);
}

export function useRouteExit(beforeExit: ConfirmTransition) {
  const router = useRouter();
  useEffect(router.registerConfirm(beforeExit), [beforeExit]);
}
