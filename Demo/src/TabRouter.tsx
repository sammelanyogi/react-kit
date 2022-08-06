import React, { useCallback, useRef } from 'react';
import { Text, View, Image, ColorValue, ImageSourcePropType, StyleSheet, TouchableOpacity } from 'react-native';
import { Route, Outlet, MapRouter, RouteState, useCurrentRoute, useNavigate } from '@bhoos/react-kit-router';

type Tab = { 
  name: string,
  title: string,
  icon: ImageSourcePropType,
  page: React.FC,
};

type Props = {
  tabs: Array<Tab>,
  defaultTab: string,
  tintColor: ColorValue,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabImage: {
    height: 24,
    width: 24,
  },
  tabText: {
    fontSize: 12,
  }
});

type TabInfo = RouteState & {
  name: string,
}

export function TabRouter({ tabs, defaultTab }: Props) {
  const mapRoute = useCallback((router: MapRouter<TabInfo>) => {
    tabs.forEach((tab) => {
      router.use(tab.name, {
        name: tab.name,
        Component: tab.page,
      });
    });
    
    const defaultRoute = tabs.find(tab => tab.name === defaultTab);

    return {
      name: defaultRoute.name,
      Component: defaultRoute.page,
    }
  }, [tabs, defaultTab]);

  return (
    <Route mapRoute={mapRoute}>
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <Outlet />
        </View>
        <TabNavigation tabs={tabs} />
      </View >
    </Route>
  );
}

function TabNavigation({ tabs }: { tabs: Array<Tab>}) {
  const route = useCurrentRoute<TabInfo>();
  const navigate = useNavigate();

  console.log('Tab Navigation select', route.name);

  return (
    <View style={styles.footer}>
      {tabs.map(tab => {
        const isSelected = tab.name === route.name;

        return (
          <TouchableOpacity onPress={() => navigate(tab.name, { replace: true })} style={styles.tabItem} key={tab.name}>
            <Image style={[styles.tabImage, { tintColor: isSelected ? 'red' : 'black'}]} source={tab.icon} />
            <Text style={[styles.tabText, { color: isSelected ? 'red' : 'black'}]} allowFontScaling={false}>{tab.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
