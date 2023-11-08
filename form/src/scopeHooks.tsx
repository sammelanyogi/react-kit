import { useFormContext } from './Form';
import { useScopeContext } from './Scope';
import { ValidationError } from './types';

export const useScopeValidator = (inputs?: string[]) => {
  const form = useFormContext();
  const scope = useScopeContext();
  const scopeValidator = scope?.validator || form?.validator;
  const validator = () => {
    try {
      let noInputError = true;
      Object.entries(form.getValidators(inputs)).forEach(([key, validators]) => {
        try {
          validators?.forEach(fn => fn(form.tempState[key], key, form.tempState));
        } catch (e: any) {
          noInputError = false;
          let vE: ValidationError = e;
          if (!(e instanceof ValidationError)) {
            vE = new ValidationError('scope', { message: e.message });
          }
          form.setError(vE.name, vE);
        }
      });
      if (!scopeValidator) {
        return noInputError;
      }
      const isValid = noInputError && scopeValidator(form.tempState);
      if (isValid) {
        form.commit();
      }
      return isValid;
    } catch (e: any) {
      let vE: ValidationError = e;
      if (!(e instanceof ValidationError)) {
        vE = new ValidationError('scope', { message: e.message });
      }
      form.setError(vE.name, vE);
    }
  };
  return validator;
};
