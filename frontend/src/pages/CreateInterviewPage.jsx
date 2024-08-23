import React, { useState } from 'react';
import ProgressBar from '../components/ProgressBar';
import JobInfo from '../components/JobInfo';
import CompanyInfo from '../components/CompanyInfo';
import DocumentInfo from '../components/DocumentInfo';

function CreateInterview() {
    const [step, setStep] = useState(0);

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    return (
        <div>
            <ProgressBar step={step} />
            <div className="form-section">
                {step === 0 && <JobInfo onNext={handleNext} />}
                {step === 1 && <CompanyInfo onNext={handleNext} onBack={handleBack} />}
                {step === 2 && <DocumentInfo onBack={handleBack}  />}
            </div>
        </div>
    );
}

export default CreateInterview;