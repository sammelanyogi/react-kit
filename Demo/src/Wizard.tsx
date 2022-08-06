import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from "react-native";
import { MapRouter, Outlet, Route, RouteState, useNavigate } from '@bhoos/react-kit-router';

export const wizardIcon = require('./wizard.png');

type WizInfo = RouteState & {

}

export function Page1() {
  const navigate = useNavigate();

  return (
    <View>
      <Text>Page 1</Text>
      <TouchableOpacity onPress={() => navigate('page2')}><Text>Next</Text></TouchableOpacity>
    </View>
  )
}

export function Page2() {
  const navigate = useNavigate();

  return (
    <View>
      <Text>Page 2</Text>
      <TouchableOpacity onPress={() => navigate('page1')}><Text>Back</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => navigate('page1')}><Text>Submit</Text></TouchableOpacity>
    </View>
  )
}

const page1 = {
  Component: Page1,
};
const page2 = {
  Component: Page2,
}

export function Wizard() {
  const mapRoute = useCallback((router: MapRouter<WizInfo>) => {
    router.use('page1', page1);
    router.use('page2', page2);
    return page1;
  }, []);

  return (
    <View>
      <Text>Wizard</Text>
      <Route mapRoute={mapRoute}>
        <Outlet />
      </Route>
    </View>
  )
}