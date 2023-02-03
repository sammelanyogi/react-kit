import React, { useEffect, useState, } from 'react';
import { RouteMap, RouterDriver } from './types.js';
import { RouteController, RouteContext } from './RouteController.js';
import { RouterController, RouterContext } from './RouterController.js';

export function withRouter<Props extends {}, T>(driver: RouterDriver, map: RouteMap<T>, defaultPath: string) {
  return (App: React.FC<Props>) => {
    return (props: Props) => {
      const [initial, setInitial] = useState<RouterController<T> | null>(null);
      
      useEffect(() => {
        let router: RouterController<T> = null;

        const initialUrl = driver.getInitialUrl();
        if (typeof initialUrl !== 'string') {
          initialUrl.then((url) => {
            router = new RouterController(new RouteController('/', map, url, defaultPath));
            setInitial(router);
          })
        } else {
          router = new RouterController(new RouteController('/', map, initialUrl, defaultPath));
          setInitial(router);
        }

        return driver.subscribe((url) => {
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
    }
  }
}
