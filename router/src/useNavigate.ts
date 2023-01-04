import { useContext } from "react";
import { RouteContext } from "./RouteController.js";
import { RouterContext } from "./RouterController.js";

export function useNavigate() {
  const router = useContext(RouterContext);
  const route = useContext(RouteContext);

  return (path: string | number) => {
    if (typeof path === 'number') {
      router.navigateBack(-1 * path);
    } else {
      router.navigate(route, path);
    }
  }
}
