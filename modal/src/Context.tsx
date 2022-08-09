import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { ModalController } from './ModalController.js';


const modalController = new ModalController();
const ModalControllerContext = React.createContext<ModalController>(modalController);

export function ModalPortal({ Wrapper }: { Wrapper: React.FC<{ children: React.ReactElement }> }) {
  const controller = useContext(ModalControllerContext);
  const [allModals, updateAllModals] = useState<Array<{
    id: string,
    element: React.ReactElement,
  }>>([]);

  useEffect(() => {
    return controller.listen(updateAllModals);
  }, []);
  
  return (
    <>{allModals.map(modal => <Wrapper key={modal.id}>{modal.element}</Wrapper>)}</>
  )
}

type Props<T> = {
  visible: boolean;
  onRequestClose?: (res?: T) => void;
  children: React.ReactElement;
}

export const Modal = forwardRef(({ visible, children }: Props<any>, ref): React.ReactElement => {
  const controller = useContext(ModalControllerContext);
  const [modalId] = useState(() => controller.createId());

  useImperativeHandle(ref, () => {
    let callback: (res?: any) => void = undefined;
    return {
      show: (onHide?: (res?: any) => void) => {
        callback = onHide;
        modalController.show(modalId, children);
      },
      hide: (res?: any) => {
        modalController.hide(modalId);
        if (callback) callback(res);
      },
    }
  }, [children]);

  useEffect(() => {
    if (visible) {
      controller.show(modalId, children);
    } else {
      controller.hide(modalId);
    }
  }, [visible]);

  useEffect(() => {
    controller.update(modalId, children);
  }, [children]);

  // Modal doesn't render the component directly
  return null;
});
