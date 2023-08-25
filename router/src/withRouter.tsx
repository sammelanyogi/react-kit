import React, { useEffect, useState } from 'react';

import { RouteContext, RouteController } from './RouteController.js';
import { RouterContext, RouterController } from './RouterController.js';
import { RouteMap, RouterDriver } from './types.js';

export function withRouter<Props extends {}, T>(
  driver: RouterDriver,
  map: RouteMap<T>,
  defaultPath: string,
  onRouteChange?: (url: string) => void,
) {
  return (App: React.FC<Props>) => {
    return (props: Props) => {
      const [initial, setInitial] = useState<RouterController<T> | null>(null);

      useEffect(() => {
        let router: RouterController<T>;

        const initialUrl = driver.getInitialUrl();
        if (typeof initialUrl !== 'string') {
          initialUrl.then(url => {
            router = new RouterController(
              new RouteController('/', map, url, defaultPath),
              onRouteChange,
            );
            setInitial(router);
          });
        } else {
          router = new RouterController(
            new RouteController('/', map, initialUrl, defaultPath),
            onRouteChange,
          );
          setInitial(router);
        }

        return driver.subscribe(url => {
          if (router) {
            router.navigate(router.root, url);
          }
        });
      }, []);

      if (!initial) return null;

      return (
        <RouterContext.Provider value={initial}>
          <RouteContext.Provider value={initial.root}>
            <App {...props} />
          </RouteContext.Provider>
        </RouterContext.Provider>
      );
    };
  };
}
