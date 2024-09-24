import { Field } from "formik";
import { FormCheck } from 'react-bootstrap';

export default function TextArea(props) {
  return (
    <>
      <Field name={name}>
        {({ field, form, meta }) =>
          <FormCheck
            type="switch"
            id={id}
            className={className}
            checked={field.value}
            label={label ? label : ''}
            {...field}
          />
        }
      </Field>
    </>
  );
}