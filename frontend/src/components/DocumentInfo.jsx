import React from 'react';

function DocumentInfo({ onBack }) {
    return (
        <div>
            <h2>Documents</h2>
            {/* Add your form fields here */}

            <button onClick={onBack}>Back</button>
            <button>Submit</button>
        </div>
    );
}

export default DocumentInfo;
