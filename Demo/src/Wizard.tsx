import { Outlet, Route, useNavigate } from '@bhoos/react-kit-router';
import React from 'react';
import { Text, TouchableOpacity, View } from "react-native";
import { H1, H2 } from './TextStyles';

export const wizardIcon = require('./wizard.png');

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

const mapRoute = {
  'page1': () => Page1,
  'page2': () => Page2
};

export function Wizard() {

  return (
    <View>
      <H1>Wizard</H1>
      <Route map={mapRoute} defaultPath='page1'>
        <Outlet />
      </Route>
    </View>
  )
}