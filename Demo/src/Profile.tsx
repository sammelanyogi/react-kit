import { useModal, useModalClose } from '@bhoos/react-kit-modal';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { H1 } from './TextStyles';

export const profileIcon = require('./profile.png');

type UserProfile = {
  name: string,
}

function UserInfo({ profile }: { profile: UserProfile }) {
  const close = useModalClose()
  return (
    <View>
      <Text>{profile.name}</Text>
      <Text>{profile.name}</Text>
      <Button onPress={() => close(profile)} title="OK" />
      <Button onPress={() => close(null)} title="Cancel" />
    </View>
  );
}

export function Profile() {
  const modal = useModal();

  function showProfile() {
    modal.show(() => <UserInfo profile={{ name: 'Hello' }} />, (res) => {
      console.log('Modal hide', res);
    });
  }

  return (
    <>
      <H1>Profile</H1>
      <Button onPress={showProfile} title="Show Profile" />
    </>
  )
}