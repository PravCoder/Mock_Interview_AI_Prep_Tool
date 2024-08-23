import React from 'react';

function JobInfo({ onNext }) {
    return (
        <div>
            <h2>Job Information</h2>
            {/* Add your form fields here */}
            <button onClick={onNext}>Next</button>
        </div>
    );
}

export default JobInfo;
