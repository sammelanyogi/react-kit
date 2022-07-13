import React, { createElement, useRef, useEffect, useState } from 'react';
import { Route } from './Route.js';
import { RouterContext, useParentRouter } from './context.js';
import { Router } from './Router.js';

type Props = {
  mapRoute: (router: Router) => void;
  home: React.FC<any>;

  onRouteChange?: (route: Route) => void;
  getInitialUrl?: () => Promise<string>;
};

export function Portal(props: Props) {
  const { mapRoute, getInitialUrl, home, onRouteChange } = props;
  const [route, setRoute] = useState<Route | null>(null);

  const parentRouter = useParentRouter();
  const routerRef = useRef<Router>();
  if (!routerRef.current) {
    routerRef.current = new Router(mapRoute, setRoute, parentRouter, home);
  }
  const childRouter = routerRef.current;

  useEffect(() => {
    (async () => {
      if (!parentRouter) {
        if (getInitialUrl) {
          const initialUrl = await getInitialUrl();
          if (initialUrl) return childRouter.push(initialUrl);
        }
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

  useEffect(() => {
    if (onRouteChange && route) onRouteChange(route);
  }, [route, onRouteChange]);

  if (!route) return null;

  return createElement(RouterContext.Provider, { value: route }, route?.createElement());
}
