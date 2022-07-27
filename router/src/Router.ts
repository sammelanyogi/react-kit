import React from 'react';
import { Route } from './Route.js';
import { UrlParser } from './Url.js';

type SetRoute = React.Dispatch<React.SetStateAction<Route<any> | UrlParser>>;

export interface Router {
  show<T extends {}>(Component: React.FC<T>, props?: T): void;
  push(url: string): void;
  pop(): void;
  reset(): void;
}

export class PortalRouter implements Router {
  private readonly setRoute: SetRoute;
  private readonly parentRouter: Router;
  private readonly stack: Array<Route<any> | string> = [];

  constructor(parentRouter: Router, setRoute: SetRoute) {
    this.parentRouter = parentRouter;
    this.setRoute = setRoute;
  }

  static create<T>(parentRouter: Router, setRoute: SetRoute) {
    return new PortalRouter(parentRouter, setRoute);
  }

  show<T extends {}>(Component: React.FC<T>, props?: T) {
    const route = new Route(Component, props);
    this.stack.push(route);
    this.setRoute(route);
  }

  push(url: string) {
    if (url.startsWith('/')) return this.parentRouter.push(url);

    this.stack.push(url);
    return this.setRoute(UrlParser.create(url));
  }

  public pop = (): void => {
    this.stack.pop();

    if (!this.stack.length) return this.parentRouter.pop();

    const last = this.stack[this.stack.length - 1];
    return this.setRoute(typeof last === 'string' ? UrlParser.create(last) : last);
  };

  public reset() {
    this.stack.length = 0;
    this.parentRouter.reset();
  }

  public set = (url: string): void => {
    this.stack.length = 0;
    return this.push(url);
  };
}
