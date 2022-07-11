How to use Modal?

1. Wrap the App with `ModalProvider`

```typescript
import { Button, View, Text } from 'react-native';
import { ModalProvider } from '@bhoos/react-kit';

export default function App() {
  return (
    <ModalProvider>
      <ComponentHavingModal />
    </ModalProvider>
  );
}
```

2. Use `useModal` hook to call any React component, with the given props.

```typescript
import { Button, View, Text } from 'react-native';
import { useModal } from '@bhoos/react-kit';

function ComponentHavingModal() {
  const confirmModal = useModal(Confirmation);

  function handlePayment() {
    confirmModal.show({
      onSubmit: () => {}, // confirm payment function
      content: 'Do you want to confirm the payment?',
    });
  }

  return <Button onPress={handlePayment} title="Pay" />;
}

function Confirmation(props) {
  /**
   * hide is passed implicity by the Modal to close the view.
   * Other props are forwarded.
   */
  const { hide, onSubmit, content } = props;

  return (
    <View>
      <Button onPress={() => hide()} title="Close" />
      <Text>{content}</Text>
      <Button onPress={onSubmit} title="Yes" />
      <Button onPress={() => hide()} title="Close" />
    </View>
  );
}
```
