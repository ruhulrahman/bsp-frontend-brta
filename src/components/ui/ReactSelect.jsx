import React from 'react';
import Select from 'react-select';
import i18n from '@/i18n';

const ReactSelect = ({
  options,
  value,
  onChange,
  onBlur,
  placeholder,
  isClearable = true,
  isSearchable = true,
  styles,
}) => {

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
    <Select
      options={customOptions}
      value={(value !== null && value !== '') && customOptions ? customOptions.find(option => option.value === value) : value} // Set selected value
      onChange={onChange} // Handle value change
      onBlur={onBlur} // Handle blur event
      placeholder={placeholder} // Placeholder text
      isClearable={isClearable} // Allow clearing the selection
      isSearchable={isSearchable} // Allow searching in dropdown
      styles={styles ? styles : customStyles} // Custom styles if any
    />
  );
};

export default ReactSelect;
