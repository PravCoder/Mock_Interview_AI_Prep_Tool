import React from 'react';
import "../styles/ProgressBar.css";

function ProgressBar({ step }) {
    const steps = ["Job Info", "Company Info", "Documents"];

    return (
        <div className="progress-bar">
            {steps.map((label, index) => (
                <div
                    key={index}
                    className={`progress-step ${index <= step ? 'active' : ''}`}
                >
                    {label}
                </div>
            ))}
        </div>
    );
}

export default ProgressBar;
