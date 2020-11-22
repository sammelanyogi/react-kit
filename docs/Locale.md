## Locale
Language localization library for react

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