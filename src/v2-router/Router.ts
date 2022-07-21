import React from 'react';
import { Route } from './Route.js';
import { UrlParser } from './Url.js';

type SetRoute = React.Dispatch<React.SetStateAction<Route<any> | UrlParser>>;

export interface Router {
  show<T extends {}>(route: Route<T>): void;
  push(url: string): void;
  pop(): void;
}

export class PortalRouter implements Router {
  private readonly setRoute: SetRoute;
  private readonly parentRouter: Router;
  private readonly stack: Array<Route<any> | string> = [];

  constructor(parentRouter: Router, setRoute: SetRoute) {
    this.parentRouter = parentRouter;
    this.setRoute = setRoute;
  }

  show<T extends {}>(route: Route<T>) {
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

    if (this.stack.length) {
      const last = this.stack[this.stack.length - 1];
      return this.setRoute(typeof last === 'string' ? UrlParser.create(last) : last);
    }

    return this.parentRouter.pop();
  };

  public set = (url: string): void => {
    this.stack.length = 0;
    this.push(url);
  };
}
