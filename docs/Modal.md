## Modal

### Usage
```typescript
import { ModalProvider, useModal } from '@bhoos/react-kit';

const PaymentModal = ({ hide }) => (
  <View>
    <Button title="Pay" onPress={handlePayment} />
    <Button title="Close" onPress={hide} />
  </View>
);

const PaymentScreen = () => {
  const {show, hide} = useModal(PaymentModal);

  return (
    <View>
      <Text>Pay $100</Text>
      <Button title="Pay" onPress={() => show({ hide })} />
    </View>
  )
};

const App = () => (
  <ModalProvider>
    <View>
      <Text>App</Text>
      <PaymentScreen/>
    </View>
  </ModalProvider>
);

```