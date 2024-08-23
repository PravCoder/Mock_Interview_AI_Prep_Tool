import React from 'react';

function CompanyInfo({ onNext }) {
    return (
        <div>
            <h2>Company Information</h2>
            {/* Add your form fields here */}
            <button onClick={onNext}>Next</button>
        </div>
    );
}

export default CompanyInfo;
