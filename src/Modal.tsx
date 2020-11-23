import React, { createContext, createElement, ReactPropTypes, useCallback, useContext, useEffect, useRef, useState } from 'react';

type ModalContent = React.FunctionComponent<any>;

type Modal = {
  show: (props: ReactPropTypes) => void;
  hide: () => void;
};

type Modals = Array<{
  Modal: ModalContent;
  props: ReactPropTypes;
}>;

type ModalContextType = {
  createModal: (Modal: ModalContent) => Modal,
};

type ModalProviderPropsType = {
  children: React.ReactNode;
  ModalsContainerComponent?: React.FC;
};


const getUniqueId = () => Math.floor(Math.random() * 1000).toString();

const ModalContext = createContext<ModalContextType>({
  createModal: (Modal: ModalContent) => ({ show: (props: ReactPropTypes) => {}, hide: () => {}}),
});

export const ModalProvider: React.FC<ModalProviderPropsType> = ({ children, ModalsContainerComponent = React.Fragment }) => {
  const [modals, setModals] = useState<Modals>([]);

  const createModal = useCallback((Modal: ModalContent) => {
    const key = getUniqueId();
    return {
      show: (props: ReactPropTypes) => setModals(modals => {
        if (modals.length !== 0 && modals[modals.length-1].props.key === key) return modals;
        return [...modals.filter(m => m.props.key === key), { Modal, props: { ...props, key }}];
      }),
      hide: () => setModals(modals => {
        return modals.filter(m => m.props.key === key);
      }),
    };
  }, []);
  
  const contextValue = { createModal }

  return <ModalContext.Provider value={contextValue}>
    {children}
    <ModalsContainerComponent>
      {modals.map(({Modal, props}) => {
        return createElement(Modal, props);
      })}
    </ModalsContainerComponent>
  </ModalContext.Provider>
};

export const useModal = (ModalContent: ModalContent): Modal => {
  const modal = useRef<Modal>();
  const controller = useContext(ModalContext);

  if (!modal.current) {
    modal.current = controller.createModal(ModalContent);
  }

  useEffect(() => modal.current.hide, []);

  return modal.current;
};
