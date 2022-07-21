import React, { createElement, useContext, useState, useRef } from 'react';
import { Route } from './Route.js';
import { RouterContext } from './context.js';
import { PortalRouter } from './Router.js';
import { UrlParser } from './Url.js';

type MapRouter = {
  use(path: string, Comp: React.FC): void;
}

type MapRoute = (router: MapRouter) => void;

type Props = {
  /* name to uniquely identify the portal */
  name: string,
  mapRoute: MapRoute,
  home: React.FC<any>;
  onRouteChange?: (route: Route) => void;
};

function convertRoute(route: UrlParser | Route, mapRoute: MapRoute, home: React.FC): {
  remaining: UrlParser | null,
  element: React.ReactElement,
} {
  if (route === null) {
    return {
      remaining: null,
      element: React.createElement(home),
    }
  }

  if (!(route instanceof UrlParser)) { 
    return {
      remaining: null,
      element: route.createElement(),
    };
  }

  const parser = route;
  mapRoute(parser);

  // If we were able to detect a route for the given url, we will use that directly
  if (parser.route) {
    return {
      remaining: parser.remaining,
      element: parser.route.createElement(),
    }
  }

  // Since we couldn't map the url to a route, we will route to home
  return {
    remaining: null,
    element: React.createElement(home),
  };
}

export function Portal({ name, mapRoute, home }: Props) {
  // Get the parent router, this can be null in case of the top level router
  const { url, router: parentRouter } = useContext(RouterContext);

  const forwardedUrl = useRef();

  // Get an initial Route for initial render, the router will always return an
  // initial route, either via parent router or the default route
  const [route, setRoute] = useState<Route | UrlParser>(() => new Route(home));
  const [router] = useState(() => new PortalRouter(parentRouter, setRoute));
  
  let routeToRender = route;

  // If the forwarded url has changed, then we always render using the url
  if (url !== forwardedUrl.current) {
    forwardedUrl.current = url;
    if (url !== null) routeToRender = url;
  } 

  const { remaining, element } = convertRoute(routeToRender, mapRoute, home);

  return createElement(RouterContext.Provider, { 
    key: name,
    value: {
      url: remaining,
      router,
    }
  }, element);
}
