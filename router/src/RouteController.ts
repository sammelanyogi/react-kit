import { createContext } from 'react';
import { RouteMap, SetRoute } from './types.js';
import { matchUrl } from './matchUrl.js';

type Current<T> = {
  path: string;
  route: T;
  remaining: string;
  params: Record<string, string>;
};

export const RouteContext = createContext<RouteController<any>>(null as any);

export class RouteController<T> {
  public readonly basePath: string;

  private children: Array<RouteController<any>> = [];
  private parent?: RouteController<any>;
  private routeListeners: Array<SetRoute<T>> = [];
  private params: Record<string, string> = {};

  private readonly map: RouteMap<T>;
  private readonly defaultPath: string;

  private current: Current<T>;

  constructor(
    basePath: string,
    map: RouteMap<T>,
    path: string,
    defaultPath: string,
    parentRoute?: RouteController<any>,
  ) {
    this.parent = parentRoute;
    this.defaultPath = defaultPath;
    // Make sure the basePath always ends with a single '/';
    if (!basePath.endsWith('/')) {
      this.basePath = `${basePath}/`;
    } else {
      this.basePath = basePath;
    }
    if (parentRoute) {
      this.params = {
        ...getParamsFromRoute(parentRoute.routeKeys, parentRoute.currentPath),
        ...parentRoute.accumulatedParams,
      };
    }

    this.map = map;
    try {
      this.current = this.processMap(checkDefault(path, defaultPath));
    } catch (err) {
      console.warn('404 not found. Showing default.', this.basePath, path);
      this.current = this.processMap(defaultPath);
    }
  }

  get routeKeys() {
    return Object.keys(this.map);
  }
  get currentRoute() {
    return this.current.route;
  }

  get parentRoute() {
    return this.parent;
  }

  get currentPath() {
    return this.current.path;
  }

  get currentObj() {
    return this.current;
  }

  get childPaths() {
    return Object.keys(this.map);
  }

  get fullPath() {
    const fullpath = this.basePath + this.current.path;
    if (!fullpath.endsWith('/')) {
      return fullpath + '/';
    }
    return fullpath;
  }

  get childUrl() {
    return this.current.remaining;
  }

  get accumulatedParams() {
    return this.params;
  }

  private findMatch(url: string): Current<T> | null {
    const keys = Object.keys(this.map);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];

      const match = matchUrl(key, url);

      if (match) {
        return {
          path: match.match,
          route: this.map[key]({ ...this.params, ...match.params }, match.queries),
          remaining: match.remaining,
          params: match.params,
        };
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
    };
  }

  subscribe(setRoute: SetRoute<T>) {
    this.routeListeners.push(setRoute);
    return () => {
      const idx = this.routeListeners.indexOf(setRoute);
      if (idx >= 0) {
        this.routeListeners.splice(idx, 1);
      }
    };
  }

  private setChildUrl(url: string) {
    this.children.forEach(controller => {
      controller.setUrl(url || '');
    });
  }

  private setRoute(route: T) {
    this.routeListeners.forEach(l => l(() => route));
  }

  setShallowUrl(url: string) {
    try {
      this.current = this.processMap(checkDefault(url, this.defaultPath));
    } catch (err) {
      console.warn('404 not found. Ignoring', this.basePath, url);
    }
  }

  setUrl(url: string) {
    try {
      this.current = this.processMap(checkDefault(url, this.defaultPath));
      this.setRoute(this.current.route);
      this.setChildUrl(this.current.remaining);
    } catch (err) {
      console.warn('404 not found. Ignoring', this.basePath, url);
    }
  }
}

function getParamsFromRoute(routesKeys: string[], currentPath: string) {
  if (routesKeys.includes(currentPath)) {
    return {};
  }
  const params: Record<string, string> = {};
  routesKeys.forEach(val => {
    const parts = val.split('/');
    const pathParts = currentPath.split('/');
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].startsWith(':')) {
        params[parts[i].slice(1)] = pathParts[i];
        continue;
      }
      if (parts[i] !== pathParts[i]) {
        return;
      }
    }
    return val.startsWith(':');
  });
  return params;
}

function checkDefault(path: string, defaultPath: string) {
  path = path.trim();
  if (!path || path === '/') return defaultPath;
  let checkPos = 0;
  if (path.startsWith('/')) checkPos = 1;
  const separator = path.charAt(checkPos);
  if (separator === '?' || separator === '#') {
    return `${defaultPath}${path.substring(checkPos)}`;
  }

  return path;
}
