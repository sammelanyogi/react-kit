import React, { useMemo } from 'react';
import { Text, View, Image, ColorValue, ImageSourcePropType, StyleSheet, TouchableOpacity } from 'react-native';

import { Route, useCurrentRoute, useNavigate } from '@bhoos/react-kit-router';

export type TabInfo = {
  name: string;
  title: string;
  selectedIcon: ImageSourcePropType;
  unselectedIcon: ImageSourcePropType;
  page: React.FC;
};

type Props = {
  tabs: Array<TabInfo>,
  defaultPath: string,
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

function TabOutlet() {
  const route = useCurrentRoute();
  return <route.page />;
}

export function TabRouter({ tabs, defaultPath }: Props) {
  const mapRoute = useMemo(() => {
    return tabs.reduce((res, tab) => {
      res[tab.name] = () => tab;
      return res;
    }, {} as { [key: string]: () => TabInfo });
  }, [tabs]);

  return (
    <Route map={mapRoute} defaultPath={defaultPath}>
      <TabOutlet/>
      <TabNavigation tabs={tabs} />
    </Route>
  );
}

function TabNavigation({ tabs }: { tabs: Array<TabInfo>}) {
  const route = useCurrentRoute();
  const navigate = useNavigate();

  return (
    <View style={styles.footer}>
      {tabs.map(tab => {
        const isSelected = tab.name === route.name;

        return (
          <TouchableOpacity onPress={() => navigate(tab.name, { replace: "always" })} style={styles.tabItem} key={tab.name}>
            <Image style={[styles.tabImage, { tintColor: isSelected ? 'red' : 'black'}]} source={isSelected ? tab.selectedIcon: tab.unselectedIcon} />
            <Text style={[styles.tabText, { color: isSelected ? 'red' : 'black'}]} allowFontScaling={false}>{tab.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
