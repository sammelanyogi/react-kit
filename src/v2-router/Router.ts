import React from 'react';
import { Route } from './Route.js';
import { Url } from './Url.js';

type MapRoute = (router: Router) => void;
type SetRoute = React.Dispatch<React.SetStateAction<Route<any> | null>>;
type ParentRouter = Router | null;
type Home = React.FC;

export class Router {
  private readonly setRoute: SetRoute;
  private readonly parentRouter: ParentRouter;
  private readonly mapRoute: MapRoute;
  private readonly stack: Array<Route> = [];

  private currentUrl?: Url;
  readonly home: React.FC;

  constructor(mapRoute: MapRoute, setRoute: SetRoute, parentRouter: ParentRouter, home: Home) {
    this.setRoute = setRoute;
    this.mapRoute = mapRoute;
    this.parentRouter = parentRouter;
    this.home = home;
  }

  use<T extends {}>(path: string, Component: React.FC<T>) {
    if (!this.currentUrl) return;

    const props = this.currentUrl.match(path) as T;

    if (props) {
      return this.show(Component, props);
    }
  }

  show<T extends {}>(Component: React.FC<T>, props: T) {
    const route = new Route(this, Component, props);
    this.stack.push(route);
    this.setRoute(route);
  }

  clearStack() {
    this.stack.length = 0;
  }

  pop = () => {
    this.stack.pop();

    /** we still have routes left in the current route */
    if (this.stack.length) {
      return this.setRoute(this.stack.at(-1));
    }

    /**
     * if this is the last route in this current router, and we have a parent router
     * set the last route from the parent route
     */
    if (this.parentRouter) {
      return this.parentRouter.pop();
    } else {
      return this.show(this.home, {});
    }
  };

  push = (uri: string | Url): void => {
    if (typeof uri === 'string') {
      if (uri.startsWith('/') && this.parentRouter) {
        return this.parentRouter.push(uri);
      }

      if (this.currentUrl && this.currentUrl.equals(uri)) return;

      this.currentUrl = new Url(uri);
    } else {
      this.currentUrl = uri;
    }

    this.mapRoute(this);
  };

  reset = () => {
    this.clearStack();

    if (this.parentRouter === null) {
      /** now, we have reached the root router, just show the home component */
      return this.show(this.home, {});
    }

    /** clearing all the stack as we propagate back to the root router */
    this.parentRouter.reset();
  };

  isRemaining = () => {
    if (!this.currentUrl) return false;
    return this.currentUrl.isRemaining();
  };

  getRemainingUrl = () => {
    if (!this.currentUrl) throw new Error('Invalid condition');

    const remaining = new Url(this.currentUrl);
    this.currentUrl = undefined;

    return remaining;
  };

  getQueryParams = () => {
    if (!this.currentUrl) return {};
    return this.currentUrl.query;
  };

  debugRoute() {
    return this.stack.map(s => s.component.name).join('/');
  }
}
