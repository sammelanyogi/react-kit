import { createElement } from 'react';
import { Router, RouterContext } from './Router.js';
import { useRoute } from './hooks.js';

type Props = {
  router: Router,
};

/**
 * A portal renders the current route for the given router,
 * and provides the router to the underlying components via
 * context.
 */
export function Portal({ router }: Props) {
  // List for change on the route
  const route = useRoute(router);
  // Do not render anything until a route is available
  if (!route) return null;

  return createElement(RouterContext.Provider, { value: router }, route.createElement());
}
