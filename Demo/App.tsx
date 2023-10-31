/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {
  Form,
  Scope,
  useFormController,
  useFormInput,
  useInputError,
  useScopeValidator,
} from './components/form';
import {
  isInteger,
  isRequired,
  minLength,
  minValue,
} from './components/form/validators';

const firstNameValidators = [
  minLength(5, {
    message: 'You name must be of at least 5 characters',
  }),
];

const budgetValidators = [
  isRequired({message: 'Pelese enter a number'}),
  isInteger({message: 'Budget must be a number'}),
  minValue(1500, {
    message: 'Budget must be greater than Rs. 1500',
  }),
];

const wantedCreatorsCountValidators = [
  isRequired({message: 'Please enter a number'}),
  minValue(1, {message: 'You must select at least 1 creator'}),
];

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: '#eee',
  };
  const controller = useFormController({}, state => state);

  const scopeValidator = (state: any) => {
    console.log('Started Scope Validation');
    const budget = parseInt(state.budget, 10);
    const wantedCreatorsCount = parseInt(state.wantedCreatorsCount, 10);
    const rate = budget / wantedCreatorsCount;
    if (isNaN(rate) || rate < 1500) {
      throw new Error(
        'Please enter budget such that we can split Rs. 1500 to each creators.',
      );
    }
    return true;
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView style={[styles.sectionContainer, {height: 700}]}>
        <Form controller={controller}>
          <Scope validator={scopeValidator}>
            <FormTextInput
              name={'firstName'}
              validators={firstNameValidators}
            />
            <FormTextInput name="budget" validators={budgetValidators} />
            <FormTextInput
              name="wantedCreatorsCount"
              validators={wantedCreatorsCountValidators}
            />
            <ErrorMsg name="scope" />
            <CheckButton />
          </Scope>
        </Form>
      </ScrollView>
    </SafeAreaView>
  );
}

const CheckButton = () => {
  const scopeValidator = useScopeValidator([
    'firstName',
    'budget',
    'wantedCreatorsCount',
  ]);
  const [validated, setValidated] = useState(false);
  const onPress = () => {
    try {
      if (scopeValidator()) {
        setValidated(true);
      } else {
        setValidated(false);
      }
    } catch (e) {
      console.log('Errors:: ', e);
    }
  };
  return (
    <View style={{alignItems: 'center'}}>
      <Button title="Next" onPress={onPress} />
      {validated && <Text style={{color: 'green'}}>Validation Successful</Text>}
    </View>
  );
};
type InputProps = {
  name: string;
  errorsAssociated?: string[];
  validators?: ((value: any, name: string, state?: any) => any)[];
};

const FormTextInput = ({name, validators, errorsAssociated}: InputProps) => {
  const [value, setValue, onBlur, onFocus] = useFormInput<string>(
    name,
    validators || [() => true],
    '',
    errorsAssociated,
  );
  return (
    <View style={{marginBottom: 10}}>
      <TextInput
        style={[styles.input]}
        placeholder={`Input ${name}`}
        placeholderTextColor={'#888'}
        onBlur={onBlur}
        onFocus={onFocus}
        value={value}
        onChangeText={setValue}
      />
      <ErrorMsg name={name} />
    </View>
  );
};

const ErrorMsg = ({name}: InputProps) => {
  const error = useInputError(name);
  if (!error) {
    return null;
  }
  return <Text style={{color: 'red'}}>{'error: ' + error?.message}</Text>;
};

const styles = StyleSheet.create({
  input: {
    height: 48,
    padding: 12,
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: 24,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
