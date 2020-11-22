import { createContext } from 'react';
import { EffectHandler } from '../EffectHandler';
import { Route } from './Route';

type Transition = {
  confirm: () => void;
  cancel: () => void;
  route: Route;
}

export type ConfirmTransition = (transition: Transition) => void;

type UrlMapper = (url: string) => Route | null;

/**
 * Router is an extension of effect handler
 * and should maintain a stack
 */
export class Router extends EffectHandler<Route> {
  private readonly mapUrl?: UrlMapper;

  private ConfirmTransitions: Array<ConfirmTransition> = [];
  private currentTransition: Array<ConfirmTransition> = null;

  /**
   * Create a router for handling route changes, with a
   * custom url mapper that is used by `setUrl`, for mapping
   * the url to a proper Route element.
   *
   * @param mapUrl
   */
  constructor(mapUrl?: UrlMapper) {
    super();
    this.mapUrl = mapUrl;
  }

  /**
   * Add route to the router stack. The push will not work if a
   * transition is already in progress, or one of the transition
   * confirmation handler cancels the transition
   * @param route
   */
  push(route: Route) {
    // Do not allow multiple transitions
    if (this.currentTransition) {
      // console.log('An async transition is already in progress')
      return;
    }

    // Fire the route instantly if there aren't any confirmations required
    if (!this.ConfirmTransitions.length) {
      return this.fire(route);
    }

    function complete(handler?: ConfirmTransition) {
      if (this.currentTransition) {
        if (!handler) {
          // The effect has been cancelled
          this.currentTransition = null;
        } else {
          const idx = this.currentTransition.indexof(handler);
          if (idx >= 0) {
            this.currentTransition.splice(idx, 1);
            if (this.currentTransition.length === 0) {
              this.currentTransition = null;
              this.fire(route);
            }
          }
        }
      }
    }

    this.currentTransition = this.ConfirmTransitions;

    this.ConfirmTransitions.forEach(handler => handler({
      route,
      cancel: complete,
      confirm: () => complete(handler),
    }));
  }

  /**
   * Change the url to generate a new route and display using the
   * current router
   * @param url
   */
  setUrl = (url: string | null) => {
    if (!this.mapUrl) {
      throw new Error(`Router cannot handle url changes. Trying to change url to ${url}`);
    }

    const newRoute = this.mapUrl(url || '');
    if (newRoute) {
      this.push(newRoute);
    }
  }

  /**
   * Register a transition confirmation handler to cancel a route
   * change.
   * @param effect
   */
  registerConfirm(effect: ConfirmTransition) {
    this.ConfirmTransitions = this.ConfirmTransitions.concat(effect);

    return () => {
      this.ConfirmTransitions = this.ConfirmTransitions.filter(k => k !== effect);
      // if the effect is part of the current transition, consider it as a
      // confirmation
    }
  }
}

/**
 * A default top level router available for all the applications.
 * In most cases, use the defaultRouter to map between login and main app.
 * For all other use cases create your own router
 */
export const defaultRouter = new Router();

export const RouterContext = createContext<Router>(defaultRouter);


