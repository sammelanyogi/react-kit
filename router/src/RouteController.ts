import { createContext } from 'react';
import { RouteMap, SetRoute } from './types.js';
import { matchUrl } from './matchUrl.js';

type Current<T> = {
  path: string,
  route: T,
  remaining: string,
}

export const RouteContext = createContext<RouteController<any>>(null as any);

export class RouteController<T> {
  public readonly basePath: string;

  private children: Array<RouteController<any>> = [];
  private routeListeners: Array<SetRoute<T>> = [];  

  private readonly map: RouteMap<T>;
  private readonly defaultPath: string;

  private current: Current<T>;

  constructor(basePath: string, map: RouteMap<T>, path: string, defaultPath: string) {
    this.defaultPath = defaultPath;
    // Make sure the basePath always ends with a single '/';
    if (!basePath.endsWith('/')) {
      this.basePath = `${basePath}/`;
    } else {
      this.basePath = basePath;
    }
    
    this.map = map;
    path = trimPath(path) || defaultPath;
    this.current = this.processMap(path);
  }

  get currentRoute() {
    return this.current.route;
  }

  get currentPath() {
    return this.current.path;
  }

  get childUrl() {
    return this.current.remaining;
  }

  private findMatch(url: string): Current<T> | null {
    const keys = Object.keys(this.map);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      
      const match = matchUrl(key, url);
      if (match) {
        return {
          path: match.match,
          route: this.map[key](match.params, match.queries),
          remaining: match.remaining,
        }
      }
    }
    return null;
  }

  private processMap(url: string): Current<T> {
    const match = this.findMatch(url);
    if (match) return match;
    throw new Error('404');
  }

  attach(child: RouteController<any>) {
    this.children.push(child);
    return () => {
      const idx = this.children.indexOf(child);
      if (idx >= 0) {
        this.children.splice(idx, 1);
      }
    }
  }

  subscribe(setRoute: SetRoute<T>) {
    this.routeListeners.push(setRoute);
    return () => {
      const idx = this.routeListeners.indexOf(setRoute);
      if (idx >= 0) {
        this.routeListeners.splice(idx, 1);
      }
    }
  }

  private setChildUrl(url: string) {
    this.children.forEach(controller => {
      controller.setUrl(url || '');
    })
  }

  private setRoute(route: T) {
    this.routeListeners.forEach(l => l(() => route));
  }
  
  setUrl(url: string) {
    try {
      this.current = this.processMap(trimPath(url) || this.defaultPath);
      this.setRoute(this.current.route);

      // When changing the route, the existing child is not
      // unmounted immediately and received the remaining
      // url. So, changing the child url in the next event loop
      setImmediate(() => {
        this.setChildUrl(this.current.remaining);
      });
    } catch (err) {
      console.warn('Url not found', this.basePath, url);
    }
  }
}

function trimPath(path: string) {
  if (path === '/') return '';
  return path.trim();
}

