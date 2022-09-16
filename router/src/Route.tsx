import React, { useEffect, useMemo, useContext, useState, Suspense } from "react";
import { RootRouter, Router } from "./Router";

export type RouteState = {
  Component: React.FC,
}

export interface MapRouter<T extends RouteState> {
  use(path: string, route: T): void;
}

export type MapRoute<T extends RouteState> = (router: MapRouter<T>) => T

type Props<T extends RouteState> = {
  mapRoute: MapRoute<T>,
  children: React.ReactElement | Array<React.ReactElement>,
}

const RouteContext = React.createContext<Router<any>>(null);

export function Route<T extends RouteState>({ mapRoute, ...other }: Props<T>) {
  const parentRouter = useContext(RouteContext);

  const router = useMemo(() => new Router(parentRouter, mapRoute), [mapRoute]);
  
  useEffect(() => {
    return parentRouter.registerChild(router);
  }, [router]);

  return (
    <RouteContext.Provider value={router} {...other} />
  );
}

export function useNavigate() {
  const router = useContext(RouteContext);

  return router.navigate.bind(router);
}

export function useCurrentRoute<T extends RouteState>() {
  const router = useContext(RouteContext) as Router<T>;
  const [route, setCurrentRoute] = useState(() => router.getCurrentRoute());
  useEffect(() => {
    return router.subscribe(setCurrentRoute);
  }, [router]);

  return route;
}

export function Outlet() {
  const router = useContext(RouteContext);
  const route = useCurrentRoute();

  const info = router.getMountInfo();

  return React.createElement(info.route.Component, Object.assign({key: info.mountPath}, info.props));
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
