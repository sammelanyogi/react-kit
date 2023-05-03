# React Router

`@bhoos/react-kit-router` is the minimal implementation of router module for react native apps.

## Getting started

There are no dependencies for this package. Just add the package in your existing react-native project.
```bash
yarn add @bhoos/react-kit-router
```


## Usage

This package exposes three major things:
  - `Route` - for defining routes where components resides with specific urls
  - `Outlet` - Outlet for the url, which is more like a placeholder of the components
  - `useCurrentRoute` - This hook gives information about the routes that we have defined in `Route`


For react-kit-router to work, you need to wrap your App with `withRouter` in order to use `Route`.

### Example:

```tsx
import { useCurrentRoute, withRouter } from '@bhoos/react-kit-router';

type PathParams = {
  videoId: string
}

type QueryParams = {
  t?: string
}

const mapRoutes = {
  // VP is an example video player component with arbitary implementation.
  'videoPlayer/:videoId':
      ({ videoId }: PathParams, { t }: QueryParams) => () => <VP videoId={videoId} t={t} />,
  '': () => App,
}

export const App = withRouter(
    driver,
    mapRoutes,
    '', // default path for the router
  )(() => {
    const Route = useCurrentRoute();
    return <Route />;
  });
```

`withRouter` takes in three parameters, as listed below in order.

- ### Router Driver:
  This is used set handlers for initial url and subscribe to route change event from out of the app.
    **Example:**
    The app can be opened with notification or external url. We can easily set the handlers for changing and getting initial route path.
    <br>
    ```tsx
    import { Linking } from 'react-native';

    import { RouterDriver } from '@bhoos/react-kit-router';

    const driver: RouterDriver = {
      async getInitialUrl() {
        const linkingUrl = await Linking.getInitialURL();
        // sanitize external url
        return sanitizeUrl(linkingUrl || '') || '/';
      },

      subscribe(onChange: (url: string) => void) {
        const subscription = Linking.addEventListener('url', ({ url }) => {
          // Sanitize your url
          const link = sanitizeUrl(url);
          if (link) {
            onChange(link);
          }
        });
        return () => {
          subscription.remove();
        };
      },
    };
    ```
  The two attributes in driver, `getInitialUrl` and `subscribe`, can be used to set handler for changing url for getting route when app is in closed state and listening route change when app is in opened state, ie background or foreground respectively.

- ### Map Routes:
  This is used to define routes that are used in the app.
    1. The key of the map is used to define `path` of the route
    2. The value is used to define `route`, which can be a function returning JSX element or also another map with some key for JSX element.


  <br>

    > :warning:
    > If you use anything other than function returning `JSX.Element` as `value` of map, you need to handle getting the `Component` for the path using `useCurrentRoute`. (which we will see later in example)

    **Example:**

    ```tsx
    const mapRoutes = {
      // VP is an example video player component with arbitary implementation.
      'videoPlayer/:videoId':
          ({ videoId }: PathParams, { t }: QueryParams) => () => <VP videoId={videoId} t={t} />,
      '': () => App,
    }
    ```

- ### Default Path:
  This defines the default component which mounts in the route.

## Route

The `Route` component is used to define the different routes and the components.

### Usage:

```tsx
const mapRoutes = {
  'create/:campaignId': ({ campaignId }: any, q: any) => {
    console.log('QQeries', q);
    return () => (
      <CreateCampaignScreen campaignId={campaignId} budget={q.budget} editOptions={q.editOptions} />
    );
  },
  'create':
    (_: any, { budget, editOptions }: any) =>
    () =>
      <CreateCampaignScreen budget={budget} editOptions={editOptions} />,
  'assignManager':
    (_: any, { budget }: any) =>
    () =>
      <AssignManagerScreen budget={budget} />,
  '': () => () => null as unknown as JSX.Element,
};


export function NavRoutes() {
  return (
    <Route map={mapRoutes} defaultPath="">
      <Text>Routes</Text>
      <Outlet />
    </Route>
  );
}
```

## `useNavigate` hook

This hook can be used to navigate through the routes with the help of urls.

The path urls can be relative or absolute.

### Usage:

Here is an example implementation of Tablet Navigation (Kindof like TopTabRouter) using everything.

```tsx

type Props = {
  campaignId: string;
};

const TabletNavigation = () => {
  const route = useCurrentRoute();
  const navigate = useNavigate();
  const navigateAboutPage = () => {
    // replace: 'always' replaces the top of the stack with new route.
    navigate('about', { replace: 'always' });
  };
  const navigateLiveReportPage = () => {
    navigate('live-report', { replace: 'always' });
  };

  return (
    <View style={styles.tabletWrapper}>
      <Tablet
        isSelected={route.name === 'about'}
        text="About Campaign"
        onPress={navigateAboutPage}
      />
      <View style={styles.gap} />
      <Tablet
        isSelected={route.name === 'live-report'}
        text="Live Report"
        onPress={navigateLiveReportPage}
      />
    </View>
  );
};

const RenderPage = () => {
  const route = useCurrentRoute();
  return <route.page />;
};

export const AboutCampaignRoutes = ({ campaignId }: Props) => {
  const map = useMemo(
    () => ({
      'live-report': () => ({
        page: () => LiveReportRoutes({ campaignId }),
        name: 'live-report',
      }),
      about: () => ({
        page: () => CampaignDetailsBrand({ campaignId }),
        name: 'about',
      }),
    }),
    [campaignId],
  );

  return (
    <Route map={map} defaultPath="about">
      <TabletNavigation />
      <RenderPage />
    </Route>
  );
};

```

To pop from stack without replacing (implementing back functionality), you can do: `navigate(-1, { replace: "always" })`.
If sometimes, you need to pop multiple routes from stack, you can give parameters like `-1` or `-2`.

## Examples:

If you need to implement something like stack navigation, you can use it with react-native Modal, or more awesome alternative (which uses createPortal) `@bhoos/react-kit-modal`.

- Stack Navigation (with @bhoos/react-kit-modal)
- [Bottom Tab Navigation](/Demo/src/TabRouter.tsx)