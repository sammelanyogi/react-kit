
```jsx
function isRequired(value) {
  return value !== '';
}

function budgetValidator(scopeData, state, node) {
  if (isRequired(scopeData.budget)) {

  }
  validationValue = 'abc';
  state.budget = 1500;



}

function MyForm {
  const nameLength = useCallback(() => length(21), []);

  return (
    <Form transform={} initialState={}>
      <Scope validator={state => {
        if (state.budget / state.creatorsCount < 1000) {
          throw new ValidationError('any-name', 'Each creator should have at least 1000');
        }
      }}>
        <TextInput name="budget" validator={} isRequired={() => } />
        <TextInput name="creatorsCount" validator={creatorsCountValidator} />
        <ErrorNotice name="any-name" />
        <Continue tilte="Continue" />
      </Scope>

      <Scope>
        <TextInput name="creatorsCount" validator={creatorsCountValidor} />
        <Continue title="Continue" />
      </Scope>

      <Group name="personal">
        <TextInput name="name" required validator={nameValidator} />
        <ErrorDescription name="name" message={"Name is required"}  />
        <TextInput name="address" />
        <Array name="education" header={EduHeader} footer={EduFooter} transform={(list, idx) => {
          return list.filter((item) => item.selected).map(item => item.college);
        }}>
          {(index, size, array) => (
            <Group name={index} transform={}>
              <Checkbox name="selected" onChange={() => {

              }}/>
              <TextInput name="college" label="College" />
              <TextInput name="univesity" label="University" />
              <Button onPress={() => array.remove(index)} title="Delete" />
              <Button onPress={insert} title="Insert" />
            </Group>
          )}
        </Array>

        <TagSelector />
        <Continue enableCheck={(state, error) => error  && state.name !== '' && state.address !== ''} />
      </Group>
      <Group name="budget">

      </Group>

    </Form>
  );
}

function Continue() {
  const commit = useScopeCommit();
  return <button onClick={() => {
    if (commit()) {
      showNextPage();
    }}
  } />
}

function SubmitButton() {
  const submit = useFormSubmit();

  return (
    <Button
      title="Save"
      onPress={() => {
        data = submit();
        fetch('path', data);
      }}
    />
  )
}

function ErrorDisplayComponent(name) {
  const error = useFormError(scope => scope.name);

}

function TopErrorDisplay(name) {
  const error = useFormError(scope => scope);

  if (!error) return null;

  return ()
}

function TagSelector({ name }) {
  const [value, onChange, focus, blur] = useFormInput(name, []);
  const availabledTags = useFetch();

  return (
    <Table>
      {availableTags.map((tag) => {
        return (<CheckBox
          onChange={((prev) => {
              const next = prev.filter(k => k !== tag);
              if (flag) {
                next.push(tag);
              }
              if (next.length > maxLength) {
                next.splice(0, 1);
              }
              return next;
            });
            }
          label={tag}
          />)
        })
      }
      <Array.Items>
       { (index, size, array) => {
          return <TR>
            <TH>
            <input type="checkbox" name="selected" onChange={(checked) => {
              if (checked) {

              }
            }} />
            </TH>
            </TR>
        }}
      </Array.Items>
    </Table>
  );
}


function Continue({ enableCheck }) {
  const enabled = useFormState(enableCheck);


}

function EduHeader({ array }) {
  return (
    <Level onChange={} />
  )
}

```
