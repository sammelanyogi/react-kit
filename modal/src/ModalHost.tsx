import React, { useContext, useState, useEffect } from 'react';
import { ModalContext } from './ModalContext.js';
import { findNodeHandle, View, StyleSheet } from 'react-native';

export function ModalHost() {
  const manager = useContext(ModalContext);
  const [_, setSerial] = useState(manager.serial);

  useEffect(() => {
    return manager.listen(setSerial);
  }, []);

  return (
    <>
      {manager.modals.map(info => (
        <View 
          key={info.id} 
          ref={(node) => manager.mount(info.id, node && findNodeHandle(node))}  
          pointerEvents="box-none" 
          style={[StyleSheet.absoluteFill, {
            zIndex: info.zIndex,
          }]} 
        />
      ))}
    </>
  );
}
