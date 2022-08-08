import React, { useContext, useState } from 'react';
import { ModalController } from './ModalController.js';
import { ModalRoot } from './ModalRoot.js';

const ModalControllerContext = React.createContext<ModalController>(null as any);

export function withModal<T extends {} = {}>(Wrapper: React.FC) {
  const controller = new ModalController(Wrapper);

  return (App: React.FC<T>) => { 
    return (props: T) => {
      return (
        <ModalControllerContext.Provider value={controller}>
          <App {...props} />
          <ModalRoot controller={controller} />
        </ModalControllerContext.Provider>
      );
    }
  }
}

export function useModal() {
  const controller = useContext(ModalControllerContext);
  const [modal] = useState(() => controller.createModal());
  return modal;
}
