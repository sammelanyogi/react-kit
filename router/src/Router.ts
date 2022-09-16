import React from 'react';
import { MapRoute, RouteState } from './Route.js';
import { UrlParser } from './Url.js';

type SetRouteState<T extends RouteState> = React.Dispatch<React.SetStateAction<T>>

type NavigationOptions = {
  replace?: boolean,
}

export class Router<T extends RouteState> {
  /**
   * The child routers. There is typically one child per router, but
   * as per use case, there can be multiple routers within a router.
   */
  private readonly children: Array<Router<any>> = [];

  /**
   * The parent router for this router
   */
  private readonly parent: Router<any>;

  /**
   * The route change listeners. There must be at least one Route
   * change listener - the Outlet within the Route.
   */
  private readonly routeSubscriptions: Array<SetRouteState<T>> = [];

  // The current route that is mounted
  private currentRoute: T;
  private currentRouteProps: {};

  // The path used to mount the route
  private mountPath: string;

  // The path remaining after the mount path was
  // mounted. This path is used by the children for their
  // own mounting
  private remainingPath: string = '';

  private readonly mapRoute: MapRoute<T>;

  // A navigation stack maintained by the parent rounter
  private navigationStack: string[];

  constructor(parent: Router<any>, mapRoute: MapRoute<T>, remainingPath: string = '') {
    this.parent = parent;
    this.mapRoute = mapRoute;
    this.remainingPath = remainingPath;

    if (parent !== null) {
      this.mount(parent.remainingPath);
    }
  }

  getMountInfo() { 
    return {
      mountPath: this.mountPath,
      route: this.currentRoute,
      props: this.currentRouteProps,
    };
  };


  registerChild(child: Router<any>) {
    this.children.push(child);
    return () => {
      const idx = this.children.indexOf(child);
      if (idx >= 0) this.children.splice(idx, 1);
    }
  }

  navigate(to: string, options?: NavigationOptions) {
    if (to.startsWith('/')) {
      // Any path starting with '/' will have to be handled by the root router
      this.parent.navigate(to, options);
    } else if (to.startsWith('../')) {
      // Any path starting with '..' will have to be handled by the parent router
      this.parent.navigate(to.substring(3));
    } else {
      // Update the route on the parent router, which should trigger all the children
      this.parent.update(to, options);

      this.parent.updateStack(0, this.mountPath, options && options.replace);
    }
  }

  update(childPath: string, options?: NavigationOptions) {
    this.children.forEach((child) => {
      child.mount(childPath);
    });
  }

  updateStack(depth: number, mountPath: string, replace: boolean) {
    this.parent.updateStack(depth + 1, mountPath, replace);
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

  mount(path: string) {
    if (this.mountPath === path) return;

    this.mountPath = path;
    const urlParser = new UrlParser<T>(path);
    const defaultRoute = this.mapRoute(urlParser);
    
    if (urlParser.matched) {
      this.currentRoute = urlParser.matched.route;
      this.currentRouteProps = urlParser.matched.props;
      this.remainingPath = urlParser.matched.remainingUrl;
    } else {
      this.currentRoute = defaultRoute;
      // we are resorting to default Route since no match
      // was found
      this.remainingPath = '';
    }

    // Fire the subscriptions for the current route
    this.routeSubscriptions.forEach((sub) => {
      sub(this.currentRoute);
    });
  }

  subscribe(updateRoute: SetRouteState<T>) {
    this.routeSubscriptions.push(updateRoute);
    return () => {
      const idx = this.routeSubscriptions.indexOf(updateRoute);
      if (idx >= 0) this.routeSubscriptions.splice(idx, 1);
    }
  }
}

class TreeStack {
  path: string;
  stack: Array<TreeStack> = [];

  constructor(path: string) {
    this.path = path;
  }

  update(depth: number, path: string, replace: boolean) {
    if (depth === 0) {
      this.stack.unshift(new TreeStack(path));
    } else {
      if (this.stack.length === 0) {
        this.stack.unshift(new TreeStack(''));
      }
      this.stack[0].update(depth - 1, path, replace);
    }
  }

  toString(indent: number = 0) {
    let str = `${' '.repeat(indent * 4)} - [${this.path}]`;
    for (let i = 0; i < this.stack.length; i += 1) {
      str += "\n" + this.stack[i].toString(indent + 1);
    }
    return str;
  }

  static recursiveUpdate(target: Array<TreeStack>, depth: number, path: string, replace: boolean) {
    if (depth === 0) {
      if (replace) {
        target[0] = new TreeStack(path);
      } else {
        target.unshift(new TreeStack(path));
      }
    } else {
      if (target.length === 0) {
        target.unshift(new TreeStack(''));
      }
      target[0].update(depth - 1, path, replace);
    }
  }

  static debug(depth: number, stack: Array<TreeStack>) {
    for (const tree of stack) {
      console.log(' '.repeat(depth * 2), tree.path);
      this.debug(depth + 1, tree.stack);
    }
  }
}

export class RootRouter extends Router<any> {
  // Initial stackTree with the initial Url
  private stack: Array<TreeStack> = [];

  constructor(initialUrl: string) {
    super(null, null, initialUrl);
    this.stack.unshift(new TreeStack(initialUrl));
  }

  updateStack(depth: number, path: string, replace: boolean) {
    TreeStack.recursiveUpdate(this.stack, depth, path, replace);

    TreeStack.debug(0, this.stack);
  }

  navigate(to: string, options?: NavigationOptions) {
    // get rid of the slashes and continue the update
    let pos = 0;
    while (to.charAt(pos) === '/') { pos += 1; };
    const childPath = to.substring(pos);

    this.update(childPath, options);
  }
}


