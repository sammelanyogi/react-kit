### Use Case

```typescript

export const App = Modal.bind(() => {

});

export function AddFund({ amount, hide }: { amount: number}) {
  return (
    <Overlay>
      <Button onPress={hide} title="Close" />
      <View>
        
      </View>
    </Overlay>
  );
}

// cpl://ranks

const useLinkedModals() {
  const [ranksModal, tanksModal] = useModal([Ranks, Tanks]);
  const tanksModal = useModal(Tanks);

  useEffect(() => [
    
  ])

}

export function CPLApp() {
  useLinkedModals();

  const ranksModal = useModal(Ranks);

  Linking.addEventListener('url', ({ url }) => {
    if (url === 'cpl://ranks') {
      ranksModal.show();
    }
  });

}



// Use case 1 (Uncontrolled Modal)
export function WalletScreen() {
  const addFundModal = useModal(AddFund);
  const withdrawFundModal = useModal();

  function onAddFund() {
    addFundModal.show({ amount });
  }

  function onBlah() {
    addFundModal.hide();
  }

  return (
    <WalletScreenView />
  )
}

// Use case 2 (Controlled Modal)
export function WalletScreen() {
  const [visible, show, hide] = useModalState(false);

  return (
    <WalletScreenView />
    <Button onPress={show} title="Add Fund" />
    <Modal visible={visible}><AddFund amount={} hide={hide} /></Modal>
  )
}


```

```typescript

bind: (ModalContainer => ModalContext.Provider)

const [modals, setModals] = useState([]);


<ModalContext.Provider value={controller}>
  {children}
  {modals}
</ModalContext.Provider>


<Modal />

useModal(Component) => 
  // generate a unique id (ref)
  // show (Component)


```