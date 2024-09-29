import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = ({ field, form, ...props }) => {
    const handleChange = (value) => {
        form.setFieldValue(field.name, value);
    };

    const modulesWithImage = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']                                         // remove formatting button
        ]
    };

    const modulesWithoutImage = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'align': [] }],
            ['link'],
            ['clean']                                         // remove formatting button
        ]
    };

    return (
        <div>
            <ReactQuill
                modules={props.toolbarImage ? modulesWithImage : modulesWithoutImage} // Pass toolbar configuration here
                theme="snow" // Default theme
                value={field.value}
                onChange={handleChange}
                {...props}
            />
        </div>
    );
};

export default QuillEditor