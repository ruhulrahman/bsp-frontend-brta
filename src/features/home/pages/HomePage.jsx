import React from 'react';
import { Button } from 'react-bootstrap';
import { toaster } from '../../../utils/helpers.js';
// import SweetAlert from 'react-bootstrap-sweetalert';
import Select from 'react-select';
import HeroContent from './HeroContent.jsx';

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


const HomePage = () => {

    const notify = () => toaster('Ok')

    // function handleClick(){
    //     this.swal.fire({
    //         title: 'Example',
    //         text: 'Swal injected',
    //         icon: 'success',
    //     });
    // }

    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
      ]

    return (
        <div className="container mx-auto">
            {/* <h1 className="text-3xl font-bold text-center mb-4 text-green-500 mt-3">Welcome to BRTA Service Portal</h1> */}
            <HeroContent />
        </div>
    )
}

export default HomePage
