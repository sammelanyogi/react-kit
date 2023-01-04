import React, { useEffect, useState, } from 'react';
// import { UrlParser } from './Url.js';
import { RouteMap, RouterDriver } from './types.js';
import { RouteController, RouteContext } from './RouteController.js';
import { RouterController, RouterContext } from './RouterController.js';

export function withRouter<Props extends {}, T>(driver: RouterDriver, map: RouteMap<T>, defaultRoute: T) {
  const initialUrl = driver.getInitialUrl();

  return (App: React.FC<Props>) => {
    return (props: Props) => {
      const [initial, setInitial] = useState<RouterController<T> | null>(() => {
        return typeof initialUrl === 'string' 
          ? new RouterController(new RouteController('/', map, initialUrl, defaultRoute))
          : null
      });
      
      useEffect(() => {
        let router = initial;

        if (typeof initialUrl !== 'string') {
          initialUrl.then((url) => {
            router = new RouterController(new RouteController('/', map, url, defaultRoute));
            setInitial(router);
          })
        }
        
        return driver.subscribe((url) => {
          if (router) {
            router.navigate(router.root, url);
          }
        })
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
