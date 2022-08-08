import { useNavigate } from '@bhoos/react-kit-router';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { H1 } from './TextStyles';

export const homeIcon = require('./home.png');

export function Home() {
  const navigate = useNavigate();

  return (
    <View>
      <H1>Home</H1>
      <TouchableOpacity onPress={() => navigate('wizard/page2', { replace: true })}>
        <Text>Direct to Wizard Page 2</Text>
      </TouchableOpacity>
    </View>
  )
}
