# Bhoos React Library

## Locale

### Usage
```typescript
import { getItem, setItem } from '@react-native-community/async-storage';
import { createLocale } from '@bhoos/react';

const defaultDictionary = {
  appName: 'Your App Name';
}

const dictionaries = {
  eng: defaultDictionary,
};

const language = {
  get: async () => {
    return await getItem('language');
  },
  set: async (lang: string) => {
    const dictionary = dictionaries[lang];
    await setItem('language', lang);
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