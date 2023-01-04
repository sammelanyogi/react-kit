import { createContext } from 'react';
import { RouteController } from './RouteController.js';
import { normalize } from './normalize.js';

export const RouterContext = createContext<RouterController<any>>(null);

export class RouterController<T> {
  /**
   * Stack to keep track of the paths that we have been 
   * browsing
   */
  private stack: Array<string> = [];

  /**
   * The current path being rendered on the router
   */
  private currentPath: string;

  public readonly root: RouteController<T>;

  constructor(root: RouteController<T>) {
    this.root = root;
  }

  navigateBack(count: number) {
    while (count > 0) {
      this.stack.pop();
      count -= 1;
    }

    if (this.stack.length > 0) {
      this.currentPath = this.stack[this.stack.length - 1];
    } else {
      this.currentPath = '/';
    }

    this.root.setUrl(this.currentPath.substring(this.root.basePath.length));
  }

  navigate(route: RouteController<any>, path: string) {
    const fullPath = normalize(route.basePath, path);
    
    if (this.currentPath === fullPath) return;
    
    this.stack.push(fullPath);

    // Limit the stack size to 100
    if (this.stack.length > 100) this.stack.length = 100;

    this.currentPath = fullPath;
    // See if we are able to use the given route

    const routeToUse = fullPath.startsWith(route.basePath) ? route : this.root;
    
    routeToUse.setUrl(fullPath.substring(routeToUse.basePath.length));
  }
}
