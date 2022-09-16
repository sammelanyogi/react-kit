import React, { Dispatch, useState, useContext, useEffect, useCallback } from 'react';
import { EffectHandler } from './EffectHandler.js';

type Dictionary = {
  [name: string]: string,
};

type S = [string, Dispatch<string>];

interface Language<T extends Dictionary> {
  get: () => Promise<string>,
  set: (language: string) => Promise<T>
}

export function createLocale<T extends Dictionary>(dictionary: T) {
  // Do not use the Boundary from the Locale, we are going to use
  // a singleton value for Locale
  const dictionaryHandler = new EffectHandler(dictionary);
  // const Locale = createEffectContext(() => dictionaryHandler);

  const LanguageContext = React.createContext<S>(null);

  return {
    get dictionary() {
      return dictionaryHandler.get();
    },

    get: (key: keyof T) => dictionaryHandler.get()[key],

    format: (key: keyof T, ...params: any[0]) => {
      const dictionary = dictionaryHandler.get();
      const str = dictionary[key];
      return str.replace(/{(\d+)}/g, function(match, number) {
        return params[number];
      });
    },

    localize: <P extends { }>(language: Language<T>, App: React.FC<P>) => {
      return (props: P) => {
        const [value, setLang] = useState<S>();

        const changeLanguage = useCallback(async (newLang: string) => {
          const newDictionary = await language.set(newLang);
          dictionaryHandler.fire(Object.assign({}, dictionary, newDictionary));
          setLang([newLang, changeLanguage]);
        }, []);

        useEffect(() => {
          language.get().then(changeLanguage);
        }, []);

        return React.createElement(
          LanguageContext.Provider,
          { value },
          React.createElement(App, props)
        );
      };
    },

    useLanguage: () => {
      return useContext(LanguageContext);
    },
  };
}
