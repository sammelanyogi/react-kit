import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from "react-native";
import { MapRouter, Outlet, Route, RouteState, useNavigate } from '@bhoos/react-kit-router';
import { H1, H2 } from './TextStyles';

export const wizardIcon = require('./wizard.png');

type WizInfo = RouteState & {

}

export function Page1() {
  const navigate = useNavigate();

  return (
    <View>
      <H2>Page 1</H2>
      <TouchableOpacity onPress={() => navigate('page2')}><Text>Next</Text></TouchableOpacity>
    </View>
  )
}

export function Page2() {
  const navigate = useNavigate();

  return (
    <View>
      <H2>Page 2</H2>
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
      <H1>Wizard</H1>
      <Route mapRoute={mapRoute}>
        <Outlet />
      </Route>
    </View>
  )
}