import React, { Profiler } from 'react';
import { Route, RouterDriver, useCurrentRoute, useNavigate, withRouter } from '@bhoos/react-kit-router';
import { TabRouter } from "./TabRouter.js";
import { Home, homeIcon } from './Home.js';
import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, StatusBar, Button } from 'react-native';
import { Wizard, wizardIcon } from './Wizard.js';
import { Profile, profileIcon } from './Profile.js';
import { ModalTest } from './ModalTest.js'

const driver: RouterDriver = {
  getInitialUrl() {
    return '/';
  },
  subscribe(set: (url: string) => void) {
    return () => {

    }
  }
}

function One() {
  return <Text>One</Text>
}

function TwoOne() {
  return <Text>Two ko One</Text>
}

function TwoTwo() {
  return <Text>Two ko Two</Text>
}

function TwoHome() {
  return <Text>Two ko Home</Text>
}

function Navigator() {
  const navigate = useNavigate();

  return (
    <View>
      <Button onPress={() => navigate('twoOne')} title="Two One" />
      <Button onPress={() => navigate('twoTwo')} title="Two Two" />
    </View>
  );
}

function Two() {
  return (
    <View>
      <Text>Two</Text>
      <View>
        <Route map={{
            'twoHome': () => TwoHome,
            'twoOne': () => TwoOne,
            'twoTwo': () => TwoTwo,
          }} defaultPath="twoHome"
        >
          <Outlet />
          <Navigator />
        </Route>
      </View>
    </View>
  );
}


function Outlet() {
  const Route = useCurrentRoute();
  console.log('Route', Route);
  return <Route />;
}

function OneHome() {
  return (
    <Text>One Home</Text>
  )
}

export const App = withRouter(driver, {
  'one': () => One,
  'two': () => ModalTest,
  // 'modal': () => ModalTest,
}, 'one')(() => {
  const navigate = useNavigate();

  return (
    <>
      <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'center', 'alignItems': 'center'}}>
        <StatusBar hidden />
        <Outlet  />
        <Button onPress={() => navigate("one")} title="One" />
        <Button onPress={() => navigate("two")} title="Two" />

        <Button onPress={() => navigate("/two/twoTwo")} title="Two Two" />
        <Button onPress={() => navigate("/two/twoEmpty")} title="Two Nowhere" />

        <Button onPress={() => navigate(-1)} title="Back" />
        <Button onPress={() => navigate("one", { replace: 'always' })} title="Back to One with replace" />
        {/* <TouchableOpacity onPress={() => navigate(-1)} style={{height: 40, justifyContent: 'center', paddingLeft: 50 }}>
          <Text style={{color: 'white'}}>Back</Text>
        </TouchableOpacity> */}
        {/* <TabRouter 
          tabs={[{
            name: 'home',
            page: Home,
            title: 'Home',
            icon: homeIcon,
          },{
            name: "wizard",
            page: Wizard,
            title: 'Wizard',
            icon: wizardIcon,
          }, {
            name: "profile",
            page: Profile,
            title: 'Profile',
            icon: profileIcon,
          }]}
          defaultTab="home"
          tintColor="red"
        /> */}
      </View>
    </>
  )
});
