import React from 'react';

function CompanyInfo({ onNext, onBack }) {
    return (
        <div>
            <h2>Company Information</h2>
            {/* Add your form fields here */}
            <button onClick={onBack}>Back</button>
            <button onClick={onNext}>Next</button>
        </div>
    );
}

export default CompanyInfo;
