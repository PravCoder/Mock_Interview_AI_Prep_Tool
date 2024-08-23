import React, { useState } from 'react';

function DocumentInfo({ onNext, onBack }) {
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Documents form data:', formData);
        onNext(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Documents</h2>
            <input
                type="text"
                name="documentName"
                onChange={handleChange}
                placeholder="Document Name"
            />
            {/* Add more fields as needed */}
            <button type="submit">Submit</button>
        </form>
    );
}

export default DocumentInfo;
