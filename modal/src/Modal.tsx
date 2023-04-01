import { useState, useContext, useEffect } from 'react';
import { ModalContext } from './ModalContext.js';

// @ts-ignore
import { createPortal } from 'react-native/Libraries/Renderer/shims/ReactNative';

export function Modal(props: { visible: boolean, children: React.ReactElement | Array<React.ReactElement>}) {
  const [node, setNode] = useState(0);
  const modalManager = useContext(ModalContext);

  useEffect(() => {
    if (props.visible) return modalManager.register(setNode);
  }, [props.visible]);

  if (!node) return null;
  if (!props.visible) return null;

  return createPortal(props.children, node);
}
