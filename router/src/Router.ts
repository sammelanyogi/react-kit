import React from 'react';
import { MapRoute } from './Route.js';
import { UrlParser } from './Url.js';

type SetRouteState<T> = React.Dispatch<React.SetStateAction<T>>

type NavigationOptions = {
  replace?: boolean,
}

export class Router<T> {
  /**
   * The parent router for this router
   */
  private readonly parent: Router<any>;
  private map: MapRoute<T>;

  protected childUrl: string | string[];
  private readonly defaultRoute: T;
  private currentRoute: T;

  /**
   * The route change listeners. There must be at least one Route
   * change listener - the Outlet within the Route.
   */
  private readonly routeSubscriptions: Array<SetRouteState<T>> = [];

  constructor(parent: Router<any> | string, map: MapRoute<T>, defaultRoute: T) {
    if (typeof parent === 'string') {
      this.childUrl = parent;
      this.parent = null;
    } else {
      this.parent = parent;
    }

    this.map = map;

    this.defaultRoute = defaultRoute;
    this.currentRoute = defaultRoute;
    this.updateRoute();
  }

  /**
   * Handle changes to the mapping function
   * @param map 
   * @returns 
   */
  updateMap(map: MapRoute<T>) {
    if (map === this.map) return;
    this.map = map;

    this.updateRoute();
  }

  updateChild(router: Router<any>) {
    // NO effect, overridden by RootRouter for updating the root level component
  }

  get url() {
    if (typeof this.parent.childUrl === 'string') {
      return this.parent.childUrl;
    } else {
      return this.parent.childUrl[0];
    }
  }

  /**
   * Update currentRoute based on the url (parent.childUrl) and the route mapper
   */
  updateRoute() {
    const urlMapper = new UrlParser<T>(this.url);

    this.map(urlMapper);
    
    if(urlMapper.matched) {
      if (typeof this.parent.childUrl === 'string') {
        this.childUrl = urlMapper.matched.remainingUrl;
      } else {
        this.childUrl = this.parent.childUrl.slice(1);
        if (this.childUrl[0] === undefined) {
          this.childUrl[0] = urlMapper.matched.remainingUrl;
        }
      }

      this.changeRoute(urlMapper.matched.route);
    } else {
      // Render default route in case the url didn't match anything
      this.changeRoute(this.defaultRoute);
    }
  }

  private changeRoute(route: T) {
    if (route === this.currentRoute) return;
    this.currentRoute = route;
    this.routeSubscriptions.forEach(sub => sub(route));
  }

  protected consume(url: string, options: NavigationOptions) {
    console.log('Consume url', url);
    if (url.startsWith('/')) {
      if (this.parent.consume(url, options)) this.updateRoute();
    } else if (url.startsWith('../')) {
      let startOffset = 3;
      while (url.charAt(startOffset) === '/') startOffset += 1;
      if (this.parent.consume(url, options)) this.updateRoute();
    } else {
      // the url is consumed by setting the childUrl property on the parent router
      // this flow is used for the root router to update the root level route
      this.parent.childUrl = url;
      this.updateStack(url, (options && options.replace), -1);
      return true;
    }

    return false;
  }

  navigate(to: number): void
  navigate(to: string, options?: NavigationOptions): void
  navigate(to: number | string, options?: NavigationOptions) {
    if (typeof to === 'number') {
      if (to >= 0) return;
      this.pop()
    } else {
      if (this.consume(to, options)) this.updateRoute();
    }
  }

  protected pop() {
    this.parent.pop();
  }

  protected updateStack(url: string, replace: boolean, depth: number) {
    this.parent.updateStack(url, replace, depth + 1);
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

  subscribe(updateRoute: SetRouteState<T>) {
    this.routeSubscriptions.push(updateRoute);
    return () => {
      const idx = this.routeSubscriptions.indexOf(updateRoute);
      if (idx >= 0) this.routeSubscriptions.splice(idx, 1);
    }
  }
}

export class RootRouter extends Router<any> {
  // Initial stackTree with the initial Url
  private stack: Array<{ depth: number, url: string }> = [];
  private child: Router<any>;

  constructor(initialUrl: string) {
    super(initialUrl, null, null);
    this.stack.push({
      depth: 0,
      url: initialUrl,
    });
  }

  protected updateStack(url: string, replace: boolean, depth: number) {
    console.log(`Update Stack replace=${replace}`)
    if (replace) {
      // Replace until we have a higher depth
      while (this.stack.length > 0) {
        const peek = this.stack[this.stack.length - 1];
        // Cannot replace with lower depth
        if (peek.depth < depth) break;
        this.stack.pop();
        if (peek.depth === depth) break;
      }
    } 
      
    this.stack.push({ depth, url });
    console.log('Current Stack', this.stack);
  }

  protected pop() {
    console.log('Current Stack before pop', this.stack);
    // Generate a call stack for the the last data on stack
    if (this.stack.length === 0) {
      this.childUrl = '';
      if (this.child) this.child.updateRoute();
      return;
    }

    this.stack.pop();

    // We got no where to go
    if (this.stack.length === 0) {
      this.childUrl = '';
      if (this.child) this.child.updateRoute();
      return;
    }

    const peeked = this.stack[this.stack.length - 1];
    this.childUrl = new Array(peeked.depth + 1);

    this.childUrl[peeked.depth] = peeked.url;
    let lastDepth = peeked.depth;
    if (this.stack.length > 1) {
      for (let i = this.stack.length - 2; i >= 0; i -= 1) {
        const item = this.stack[i];
        if (item.depth < lastDepth) {
          this.childUrl[item.depth] = item.url;
          if (item.depth === 0) break;
        }
      }
    }

    if (this.child) this.child.updateRoute();
  }

  updateChild(router: Router<any>): void {
    this.child = router;
  }

  protected consume(url: string) {
    // get rid of the slashes and continue the update
    let pos = 0;
    while (url.charAt(pos) === '/') pos += 1;
    this.childUrl = url.substring(pos);
    return true;
  }

  updateRoute(): void {
    // Root router cannot update the route
  }
}
