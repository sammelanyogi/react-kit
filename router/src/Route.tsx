import React, { useContext, useEffect, useMemo } from 'react';

import { RouteContext, RouteController } from './RouteController.js';
import { RouterContext } from './RouterController.js';
import { RouteMap } from './types.js';

type Props<T> = {
  map: RouteMap<T>;
  defaultPath: string;
  children: React.ReactElement | Array<React.ReactElement>;
};

export function Route<T>({ map, defaultPath, children }: Props<T>) {
  const parentRoute = useContext(RouteContext);
  const mainController = useContext(RouterContext);

  const routeController = useMemo(() => {
    return new RouteController(
      parentRoute.fullPath,
      map,
      parentRoute.childUrl,
      defaultPath,
      parentRoute,
    );
  }, [map, defaultPath, parentRoute]);

  useEffect(() => {
    if (defaultPath) {
      mainController.updateDefaultPath(defaultPath, routeController.basePath);
    }
    return parentRoute.attach(routeController);
  }, [routeController]);

  return <RouteContext.Provider value={routeController}>{children}</RouteContext.Provider>;
}
