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

type ModalContextType = <P extends {}>(Modal: Component<P>) => Modal<P>;

type ModalProviderPropsType = {
  children: React.ReactNode;
};

const ModalContext = createContext<ModalContextType>(null);

export const ModalProvider: React.FC<ModalProviderPropsType> = ({ children = React.Fragment }) => {
  const [modals, setModals] = useState<Modals>([]);
  const serialNumber = useRef(0);

  const createModal = useCallback(<P extends {}>(component: Component<P>) => {
    const key = `modal-${++serialNumber.current}`;

    return {
      show: (props: P = {} as P) => setModals(modals => {
        // Don't need to to anything if the modal being shown is already the latest one
        if (modals.length !== 0 && modals[modals.length-1].props.key === key) return modals;

        // Either add the modal to the end of the queue or make sure it's at the end of the queue
        return modals.filter(m => m.props.key !== key).concat({ component, props: Object.assign({ key }, props)});
      }),
      hide: () => setModals(modals => {
        const idx = modals.findIndex(m => m.props.key === key);
        if (idx === -1) return modals;
        return modals.filter(m => m.props.key !== key);
      }),
    };
  }, []);

  return <ModalContext.Provider value={createModal}>
    {children}
    {modals.map(({ component, props}) => {
      return createElement(component, props);
    })}
  </ModalContext.Provider>
};

export function useModal<P extends {}>(component: Component<P>): Modal<P> {
  const modal = useRef<Modal<P>>();
  const createModal = useContext(ModalContext);

  if (!modal.current) {
    modal.current = createModal(component);
  }

  // Make sure the modal is removed when the parent component unmounts
  useEffect(() => modal.current.hide, []);

  return modal.current;
};
