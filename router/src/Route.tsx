import React, { useEffect, useMemo, useContext } from 'react';
import { RouteController, RouteContext } from './RouteController.js';
import { RouteMap } from './types.js';

type Props<T> = {
  map: RouteMap<T>;
  defaultPath: string;
  children: React.ReactElement | Array<React.ReactElement>;
};

export function Route<T>({ map, defaultPath, children }: Props<T>) {
  const parentRoute = useContext(RouteContext);

  const routeController = useMemo(() => {
    let base = `${parentRoute.basePath}${parentRoute.currentPath}`;
    if (!base.endsWith('/')) {
      base += '/';
    }

    return new RouteController(base, map, parentRoute.childUrl, defaultPath, parentRoute);
  }, [map, defaultPath, parentRoute]);

  useEffect(() => {
    return parentRoute.attach(routeController);
  }, [routeController]);

  return <RouteContext.Provider value={routeController}>{children}</RouteContext.Provider>;
}
