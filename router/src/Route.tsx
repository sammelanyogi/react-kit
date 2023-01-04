import React, { useEffect, useMemo, useContext } from "react";
import { RouteController, RouteContext } from "./RouteController.js";
import { RouteMap } from "./types.js";

type Props<T> = {
  map: RouteMap<T>,
  defaultRoute: T,
  children: React.ReactElement | Array<React.ReactElement>,
}

export function Route<T>({ map, defaultRoute, children }: Props<T>) {
  const parentRoute = useContext(RouteContext);

  const routeController = useMemo(() => {
    let base = `${parentRoute.basePath}${parentRoute.currentPath}`;
    if (!base.endsWith('/')) {
      base += '/';
    }

    return new RouteController(base, map, parentRoute.childUrl, defaultRoute);
  }, [map, defaultRoute, parentRoute]);
  
  useEffect(() => {
    return parentRoute.attach(routeController);
  }, [map, defaultRoute, parentRoute]);

  return (
    <RouteContext.Provider value={routeController}>
      {children}
    </RouteContext.Provider>
  );
}
