import { Field } from "formik";
import { FormCheck } from 'react-bootstrap';

export default function Checkbox({ id, name, className, label, disabled = false }) {
  return (
    <>
      <Field name={name}>
        {({ field, form, meta }) =>
          <FormCheck
            disabled={disabled}
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