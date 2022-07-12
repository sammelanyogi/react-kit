import React, { createElement, useRef, useEffect, useState } from 'react';
import { Route } from './Route.js';
import { useRouter, RouterContext, useRouterPortal } from './context.js';
import { Router } from './Router.js';

type Props = {
  mapRoute: (router: Router) => void;
  home: React.FC;
  getInitialUrl: () => Promise<string>;
};

export function Portal({ mapRoute, getInitialUrl, home }: Props) {
  const [route, setRoute] = useState<Route | null>(null);

  const parentRouter = useRouterPortal();
  const childRouterRef = useRef<Router>();
  if (!childRouterRef.current) {
    childRouterRef.current = new Router(mapRoute, setRoute, parentRouter, home);
  }
  const childRouter = childRouterRef.current;

  useEffect(() => {
    (async () => {
      if (!parentRouter) {
        const initialUrl = await getInitialUrl();
        if (initialUrl) return childRouter.push(initialUrl);
      } else {
        if (parentRouter.isRemaining()) {
          return childRouter.push(parentRouter.getRemainingUrl());
        }
      }

      childRouter.show(home, {});
    })();
  }, []);

  useEffect(() => {
    if (parentRouter?.isRemaining()) {
      const remaining = parentRouter.getRemainingUrl();
      childRouter.push(remaining);
    }
  });

  if (!route) return null;

  return createElement(RouterContext.Provider, { value: route }, route?.createElement());
}
