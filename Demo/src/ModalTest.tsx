import React, { useEffect, useRef, useState, useContext } from 'react';
import { View } from 'react-native';
import { SafeAreaView, Button, Text } from 'react-native';
import { withModal, Modal } from '@bhoos/react-kit-modal';

const Context = React.createContext({ state: '' });

export const ModalTest = withModal(() => {
  const [show, setShow] = React.useState(false);
  const [text, setText] = React.useState('origianl');
  const [show2, setshow2] = React.useState(false);

  React.useEffect(() => {
    setInterval(() => {
      setText('testing update phase ' + Math.random());
    }, 1000);
  }, []);

  return (
    <SafeAreaView>
      <Context.Provider value={{state: 'testing context state'}}>
        <Button title="open" onPress={() => setShow(!show)} />
        <Button title="open one more" onPress={() => setshow2(!show2)} />
        <Modal visible={show}>
          <SafeAreaView style={{borderWidth: 1}} pointerEvents="none">
            <MyComponent />
          </SafeAreaView>
        </Modal>
        <Modal visible={show2}>
          <SafeAreaView style={{borderWidth: 1}} pointerEvents="none">
            <Text>{text}</Text>
            <MyComponent />
            <Text>{"End of component"}</Text>
          </SafeAreaView>
        </Modal>
      </Context.Provider>
    </SafeAreaView>
  );
})

const MyComponent = () => {
  const  { state } = useContext(Context);
  return <View style={{backgroundColor: 'red'}}><Text>Hello from Modal { state }</Text></View>;
};
