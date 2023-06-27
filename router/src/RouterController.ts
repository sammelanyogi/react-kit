import { createContext } from "react";
import { RouteController } from "./RouteController.js";
import { normalize } from "./normalize.js";
import { NavigationOptions } from "./types.js";

export const RouterContext = createContext<RouterController<any>>(
  null as unknown as RouterController<any>
);

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

  navigateBack(count: number, route?: RouteController<any>) {
    while (count > 0) {
      this.stack.pop();
      count -= 1;
    }

    if (this.stack.length > 0) {
      this.currentPath = this.stack[this.stack.length - 1];
    } else {
      this.currentPath = "/";
    }
    let routeToUse: RouteController<any> | undefined = route;
    // search for route until it's parent route is found
    while (routeToUse) {
      if (this.currentPath.startsWith(routeToUse.basePath.slice(0, -1))) {
        break;
      }
      routeToUse = routeToUse.parentRoute;
    }
    // if parent route is not found then use root route
    routeToUse = routeToUse || this.root;
    routeToUse.setUrl(this.currentPath.substring(routeToUse.basePath.length));
  }

  navigate(
    route: RouteController<any>,
    path: string,
    options?: NavigationOptions
  ) {
    const fullPath = normalize(route.basePath, path);

    if (this.currentPath === fullPath) return;

    // We use the given route if possible otherwiser resort to the root router
    const routeToUse =
      path.startsWith("/") || !fullPath.startsWith(route.basePath.slice(0, -1))
        ? this.root
        : route;

    // based on the options see if we need to replace the existing page
    // on the stack
    if (options && options.replace && this.stack.length > 0) {
      if (options.replace === "always" || routeToUse === route) {
        this.stack.pop();
      }
    }

    this.stack.push(fullPath);

    // Limit the stack size to 100
    if (this.stack.length > 100) this.stack.length = 100;

    this.currentPath = fullPath;
    // See if we are able to use the given route

    routeToUse.setUrl(fullPath.substring(routeToUse.basePath.length));
  }
}
