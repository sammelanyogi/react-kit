import { useContext } from 'react';
import { RouteContext } from './RouteController.js';
import { RouterContext } from './RouterController.js';
import { NavigationOptions } from './types.js';

export function useNavigate() {
  const router = useContext(RouterContext);
  const route = useContext(RouteContext);

  return (path: string | number, options?: NavigationOptions) => {
    if (typeof path === 'number') {
      router.navigateBack(route, -1 * path);
    } else {
      router.navigate(route, path, options);
    }
  };
}
