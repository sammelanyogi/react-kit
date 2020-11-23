# Router Library
Create a [Router](#Router) controller which can be used to
update the routes by [push](#push)ing [Route](#Route)
with required `Component` and `props`. The [Route](#Route) is
rendered at the [Portal](#Portal).

Url links can also be used, which require the [Router](#Router)
controller to be initialized with url mapper that returns a
proper [Route](#Route) for the given url. The [setUrl](#seturl)
member of the [Router](#Router) controller can then be used
to move to specific url.

## Router
  > `const router = new Router(urlMapper)`

  Create a router controller instance with an optional url mapper

### push
  > `router.push(route: Route)`

  Display a new route at the [Portal](#Portal). The route display is
  asynchronous and it is possible that the push might not be successful
  if another route change is in process or the change is cancelled from
  within the app.

### setUrl
  > `router.setUrl(url: string)`

  If a URL mapper is provided with the [Router](#router) controller, it
  would be possible to change the route with the url. For every `setUrl`
  call a push is triggered with the [Route](#route) returned by the
  url mapper.

## Portal
  The Portal component displays the Route. It provides a place holder
  so that the route can work on specific part of the view.
  > `<Portal router={router} />`

  The Portal also starts a context that provides the router to the
  underlying components that are available via hooks like `useRouter`
  and `useRouteExit`.

## Route
  > `const route = new Route(Home, { user: 'John' })`

  The Route provides the component to be rendered with props.

## Hooks
### useRouter
  > `const router = useRouter()`

  Get the current router available within the `Portal`.

### useRoute
  > `const route = useRoute(router)`

  Retrieve the current route for the given router. Useful for
  selecting specific options on a navigation menu.

### useRouteExit
  > `useRouteExit(beforeExit: ConfirmHandler)`
   - `ConfirmHandler:= (transition: Transition) => void`
   - `Transition:= { cancel: () => void, confirm: () => void, route: Route }`

  Hook to the route exit which is called before a route changes.
  When using this hook make sure either the `transition.cancel` or
  `transition.confirm` is called.
