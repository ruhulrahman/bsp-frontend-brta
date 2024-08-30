import { Field } from "formik";
import { FormCheck } from 'react-bootstrap';

export default function Checkbox({ id, name, className, label }) {
  return (
    <>
      <Field
        name={name}
        render={({ field, form }) => {
          return (
            // <input
            //   type="checkbox"
            //   id={id}
            //   className={className}
            //   checked={field.value}
            //   {...field}
            // />
            <FormCheck 
              type="switch" 
              id={id}
              className={className}
              checked={field.value}
              label={label ? label : ''}
              {...field}
              />
          );
        }}
      />
    </>
  );
}