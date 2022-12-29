import React, { useEffect, useMemo, useContext, useState, Suspense, ReactElement } from "react";
import { RootRouter, Router } from "./Router";

export interface MapRequest {
  readonly query: Record<string, string>;
  readonly param: Record<string, string>;
}

export interface MapRouter<T> {
  use(path: string, createRoute: (req: MapRequest) => T): void;
}

export type MapRoute<T> = (router: MapRouter<T>) => void;

type Props<T> = {
  map: MapRoute<T>,
  defaultRoute: T,
  children: ReactElement | Array<ReactElement>
}

const RouteContext = React.createContext<Router<any>>(null);

export function Route<T>({map, defaultRoute, ...other}: Props<T>) {
  const parentRouter = useContext(RouteContext);
  const [router] = useState(() => new Router(parentRouter, map, defaultRoute));
  
  useEffect(() => {
    parentRouter.updateChild(router);
    // if and when the map changes, let the router update it's route
    router.updateMap(map);
  }, [map]);

  return (
    <RouteContext.Provider key={router.url} value={router} {...other} />
  );
}

export function useNavigate() {
  const router = useContext(RouteContext);

  return router.navigate.bind(router);
}

export function useRouteEffect<T>(effect: (route: T) => void, deps: Array<any> = []) {
  const router = useContext(RouteContext);

  useEffect(() => {
    return router.subscribe(effect);
  }, deps);
}

export function useRouteSelector<T, R>(selector: (route: T) => R, deps: Array<any> = []) {
  const router = useContext(RouteContext);
  const [value, setValue] = useState(() => selector(router.getCurrentRoute()));

  useEffect(() => {
    return router.subscribe((route) => {
      setValue(selector(route));
    });
  }, deps);

  return value;
}

export function Outlet() {
  const route = useRouteSelector((res) => res) as ReactElement;
  return route;
}

export function withRouter<T extends {}>(initialUrl: string | (() => Promise<string>) = '') {
  return (App: React.FC<T>) => {
    return (props: T) => {
      const [router, setRouter] = useState<RootRouter | null>(typeof initialUrl === 'function' ? null : new RootRouter(initialUrl));

      // Register an effect to load the initial url
      useEffect(() => {
        if (typeof initialUrl === 'function') {
          initialUrl().then((res) => setRouter(new RootRouter(res)));
        }
      }, []);

      // Since we need to read the initial url via promise, we will
      // render null within that period
      if (router === null) return null;

      return (
        <RouteContext.Provider value={router}>
          <App {...props}/>
        </RouteContext.Provider>
      );
    }
  }
}
