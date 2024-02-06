import { useCallback, useContext } from "react";
import { RouteContext } from "./RouteController.js";
import { RouterContext } from "./RouterController.js";
import { NavigationOptions } from "./types.js";

export function useNavigate() {
  const router = useContext(RouterContext);
  const route = useContext(RouteContext);

  const navigate = useCallback(
    (path: string | number, options?: NavigationOptions) => {
      if (typeof path === "number") {
        router.navigateBack(-1 * path, route);
      } else {
        router.navigate(route, path, options);
      }
    },
    [router, route]
  );
  return navigate;
}
