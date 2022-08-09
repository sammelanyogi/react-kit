import { Modal } from '@bhoos/react-kit-modal';
import React, { useState, useRef } from 'react';
import { Button, Text, View } from 'react-native';
import { H1 } from './TextStyles';

export const profileIcon = require('./profile.png');

type UserProfile = {
  name: string,
  close: (res?: UserProfile) => void,
}

function UserInfo({ profile, close }: { profile: UserProfile }) {
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
  const [visible, setVisible] = useState(false);

  function showProfile() {
    setVisible(true);
    // modalRef.current.show((res) => {
    //   console.log('How', res);
    // });
  }

  const modalRef = useRef();

  return (
    <>
      <H1>Profile</H1>
      <Button onPress={showProfile} title="Show Profile" />
      <Modal visible={visible} ref={modalRef}>
        <UserInfo profile={{ name: 'Hello' }} close={() => {
          setVisible(false); 
          // modalRef.current.hide(false);
        }} />
      </Modal>
    </>
  )
}