import React, { useContext, useEffect, useState } from 'react';
import { ModalController, ModalElement } from './ModalController.js';

type Props = {
  controller: ModalController;
}

const ModalContext = React.createContext<ModalElement>(null as any);

function ModalWrapper({ modal, Wrapper }: { modal: ModalElement, Wrapper: React.FC }) {
  useEffect(() => {
    return () => {
      modal.hide(undefined, true);
    }
  }, [modal]);

  return (
    <ModalContext.Provider value={modal}>
      <Wrapper>
        {modal.element}
      </Wrapper>
    </ModalContext.Provider>
  )
}

export function ModalRoot({ controller }: Props) {
  const [allModals, updateAllModals] = useState<ModalElement[]>(controller.elements);

  useEffect(() => {
    return controller.subscribe(updateAllModals);
  }, [controller]);

  return (
    <>{allModals.map(modal => <ModalWrapper key={modal.key} modal={modal} Wrapper={controller.Wrapper} />)}</>
  );
}

export function useModalClose() {
  const modalElement = useContext(ModalContext);
  return (res?: any) => {
    modalElement.hide(res, false);
  }
}
