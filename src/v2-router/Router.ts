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
  private readonly stack: Array<Route<any>> = [];

  constructor(parentRouter: Router, setRoute: SetRoute) {
    this.parentRouter = parentRouter;
    this.setRoute = setRoute;
  }

  show<T extends {}>(route: Route<T>) {
    this.setRoute(route);
  }

  push(url: string) {
    if (url.startsWith('/')) return this.parentRouter.push(url);
    this.setRoute(UrlParser.create(url));
  }

  public pop = (): void => {

  }
}
