import { useEffect, useContext } from 'react';
import { FormContext, FormController } from './FormController';
import { GenericState } from './types';

export function useFormSubmit<T extends GenericState, R>(controller: FormController<T>, onResult: (result: R) => void) {
  useEffect(() => {
    return controller.setResponseHandler(onResult);
  }, [controller, onResult]);

  return controller.submit;
}

export function useFormError(onError: (err: Error) => void) {
  const controller = useContext(FormContext);
  useFormErrorOf(controller, onError);
}

export function useFormErrorOf<T extends GenericState>(controller: FormController<T>, onError: (err: Error) => void) {
  useEffect(() => {
    return controller.setErrorHandler(onError);
  }, [controller, onError]);
}
