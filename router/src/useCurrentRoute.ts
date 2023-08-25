import { useContext, useState, useEffect } from 'react';
import { RouteContext } from './RouteController.js';

export function useCurrentRoute() {
  const routeController = useContext(RouteContext);
  const [route, setRoute] = useState(() => routeController.currentRoute);

  useEffect(() => {
    return routeController.subscribe(setRoute);
  }, []);

  return route;
}
