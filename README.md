# Bhoos React Library

## Locale

### Usage
```typescript
import AsyncStorage from '@react-native-community/async-storage';
import { createLocale } from '@bhoos/react-kit';

const defaultDictionary = {
  appName: 'Your App Name';
}

const dictionaries = {
  eng: defaultDictionary,
};

const language = {
  get: async () => {
    const lang = await AsyncStorage.getItem('language');
    if (lang === null) {
      return 'eng';
    }
    return lang;
  },
  set: async (lang: string) => {
    const dictionary = dictionaries[lang];
    await AsyncStorage.setItem('language', lang);
    return dictionary;
  }
}
export const locale = createLocale(defaultDictionary);

export function LanguageSelector() {
  const [language, changeLanguage] = locale.useLanguage();
  return (
    <View>
      <Button onPress={() => changeLanguage('eng')} title="English" />
      <Button onPress={() => changeLanguage('hin')} title="Hindi" />
    </View>
  );
}

export const App = locale.localize(language, () => {
  const { appName } = locale.dictionary;

  return (
    <Text>{appName}</Text>
  );
});

```

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
