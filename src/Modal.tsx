import React, { createContext, useContext, useEffect, useState } from 'react';

type ModalType = React.FunctionComponent<any>;

type ModalsType = {
  [key: string]: ModalType;
};

type ModalContentType = {
  showModal: (key: string, Modal: ModalType) => void;
  hideModal: (key: string) => void;
};

type ModalProviderPropsType = {
  children: React.ReactNode;
  ModalsContainerComponent: React.FC;
};


const getUniqueId = () => Math.floor(Math.random() * 1000).toString();

const ModalContext = createContext<ModalContentType>({
  showModal: () => {},
  hideModal: () => {},
});

export const ModalProvider: React.FC<ModalProviderPropsType> = ({ children, ModalsContainerComponent }) => {
  const [modals, setModals] = useState<ModalsType>({});
  const showModal = (key: string, Modal: ModalType) => {
    setModals(modals => ({ ...modals, [key]: Modal }));
  };
  const hideModal = (key: string) => {
    setModals(modals => {
      delete modals[key];
      return modals;
    });
  };

  const contextValue = { showModal, hideModal };

  return <ModalContext.Provider value={contextValue}>
    {children}
    <ModalsContainerComponent>
      {Object.keys(modals).map(key => {
        const Modal = modals[key];
        return <Modal key={key} />
      })}
    </ModalsContainerComponent>
  </ModalContext.Provider>
};

export const useModal = (Modal: ModalType) => {
  const [visible, setVisible] = useState<boolean>(false);
  const key = getUniqueId();
  const context = useContext(ModalContext);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  useEffect(() => {
    if(visible) {
      context.showModal(key, Modal);
    } else {
      context.hideModal(key);
    }
    return () => context.hideModal(key);
  }, [visible]);

  return {
    show,
    hide,
  };
};
