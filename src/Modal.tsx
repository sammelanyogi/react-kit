import React, { createContext, createElement, useCallback, useContext, useEffect, useRef, useState } from 'react';

type Component<P extends {}> = React.FunctionComponent<P>;

type Modal<P extends {}> = {
  show: (props: P) => void;
  hide: () => void;
};

type Modals = Array<{
  component: Component<any>;
  props: { key: string };
}>;

type ModalContextType = {
  createModal: <P extends {}>(Modal: Component<P>) => Modal<P>,
};

type ModalProviderPropsType = {
  children: React.ReactNode;
};


const getUniqueId = () => Math.floor(Math.random() * 1000).toString();

const ModalContext = createContext<ModalContextType>(null);

export const ModalProvider: React.FC<ModalProviderPropsType> = ({ children = React.Fragment }) => {
  const [modals, setModals] = useState<Modals>([]);

  const createModal = useCallback(<P extends {}>(component: Component<P>) => {
    const key = getUniqueId();
    return {
      show: (props: P = {} as P) => setModals(modals => {
        if (modals.length !== 0 && modals[modals.length-1].props.key === key) return modals;
        return modals.filter(m => m.props.key === key).concat({ component, props: Object.assign({ key }, props)});
      }),
      hide: () => setModals(modals => {
        console.log(modals[0].props.key === key, key);
        return modals.filter(m => m.props.key !== key);
      }),
    };
  }, []);
  
  const contextValue = { createModal }

  return <ModalContext.Provider value={contextValue}>
    {children}
    {modals.map(({ component, props}) => {
      return createElement(component, props);
    })}
  </ModalContext.Provider>
};

export function useModal<P extends {}>(component: Component<P>): Modal<P> {
  const modal = useRef<Modal<P>>();
  const controller = useContext(ModalContext);

  if (!modal.current) {
    modal.current = controller.createModal(component);
  }

  useEffect(() => modal.current.hide, []);

  return modal.current;
};
