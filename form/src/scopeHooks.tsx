import {useFormContext} from './Form';
import {useScopeContext} from './Scope';
import {ValidationError} from './types';

export const useScopeValidator = (inputs?: string[]) => {
  const form = useFormContext();
  const {validator: scopeValidator} = useScopeContext();
  const validator = () => {
    try {
      let noInputError = true;
      Object.entries(form.getValidators(inputs)).forEach(
        ([key, validators]) => {
          try {
            validators.forEach(fn =>
              fn(form.tempState[key], key, form.tempState),
            );
          } catch (e: any) {
            noInputError = false;
            let vE: ValidationError = e;
            if (!(e instanceof ValidationError)) {
              vE = new ValidationError('scope', {message: e.message});
            }
            form.setError(vE.name, vE);
          }
        },
      );
      return noInputError && scopeValidator(form.tempState);
    } catch (e: any) {
      let vE: ValidationError = e;
      if (!(e instanceof ValidationError)) {
        vE = new ValidationError('scope', {message: e.message});
      }
      form.setError(vE.name, vE);
    }
  };
  return validator;
};
