import React, { Profiler } from 'react';
import { withRouter } from '@bhoos/react-kit-router';
import { TabRouter } from "./TabRouter.js";
import { Home, homeIcon } from './Home.js';
import { SafeAreaView } from 'react-native';
import { Wizard, wizardIcon } from './Wizard.js';
import { Profile, profileIcon } from './Profile.js';

export const App = withRouter('profile')(() => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <TabRouter
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
      />
    </SafeAreaView>
  )
})
