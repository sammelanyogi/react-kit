Usage Example

```tsx
export type YourFormState = {
  name: string,
  dob: Date,
  age: number,
}

const def = {
  name: new TextParser().required().minLength(2),
  dob: new DateParser().required(),
  age: new IntegerParser().required(),
});


export function getElemText(evt: React.ChangeEvent<Element>): string {
  return evt.target.value;
}

// Declare your Input components on a per application basis and style
// it accordingly
const TextInput = ({ name, label }) => {
  const [value, onChange] = useFormInput(name, getElemText);

  return (
    <label>
      <span>{label}</span>
      <input type="text" id={name} value={value} onChange={onChange} />
    </label>
  );
}

export function YourForm({ action }) {
  const controller = useFormController(def, {}, action);

  return (
    <Form controller={controller}>
      <TextInput name="name" label="Name" />
      <TextInput name="dob" label="DOB" />
      <TextInput name="age" label="Age" />
      <button onClick={form.submit}>Submit</button>
    </Form>
  );
}

```