import React, { useState } from 'react';

function DocumentInfo({ onNext, onBack }) {
    const [formData, setFormData] = useState({
        resume: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData(prevData => ({ ...prevData, [name]: files[0] }));
        } else {
            setFormData(prevData => ({ ...prevData, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass the formData back to the parent component
        onNext({resume: formData.resume});
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Documents</h2>

            <input
                type="file"
                name="resume"
                onChange={handleChange}
            />

            <button type="submit">Submit</button>
            <button type="button" onClick={onBack}>Back</button>
        </form>
    );
}

export default DocumentInfo;
