import { Field } from "formik";
import { FormCheck } from 'react-bootstrap';
import Select from 'react-select';
import i18n from '@/i18n';

export default function SelectField({ options, field, form }) {

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '30px', // Set the minimum height of the input
      height: '30px',    // Set the overall height of the control
      padding: '0',      // Remove any extra padding
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      height: '30px',    // Adjust the container height
      padding: '0 6px',  // Adjust padding inside the value container
    }),
    input: (provided, state) => ({
      ...provided,
      margin: '0px',     // Adjust input margin
      padding: '0px',    // Adjust input padding
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: '30px',    // Adjust the height of the indicators (like the dropdown arrow)
    }),
    option: (provided, state) => ({
      ...provided,
      padding: '5px 10px',  // Adjust padding inside each dropdown option
    }),
    menu: (provided, state) => ({
      ...provided,
      marginTop: '0px',   // Adjust the margin between the input box and the dropdown
    }),
  };

  // if (meta.touched && meta.error) {
  //   return (
  //     <Form.Control.Feedback type="invalid" tooltip>
  //       {meta.error}
  //     </Form.Control.Feedback>
  //   );
  // }

  const currentLanguage = i18n.language;

  const customOptions = options.length && options.map((option) => ({
    value: option.id,
    label: currentLanguage === 'en' ? option?.nameEn : option?.nameBn,
  }));

  return (
    <>
      <Field name={name}>
        {({ field, form, meta }) =>
          // <FormCheck
          //   type="switch"
          //   id={id}
          //   className={className}
          //   checked={field.value}
          //   label={label ? label : ''}
          //   {...field}
          // />
          <Select options={customOptions} styles={customStyles} value={field.value} {...field} />
        }
      </Field>

      {/* <Select
        styles={customStyles}
        options={customOptions}
        value={customOptions ? customOptions.find(option => option.value === field.value) : ''}
        onChange={(option) => form.setFieldValue(field.name, option.value)}
        onBlur={field.onBlur}
      /> */}
    </>
  );
}