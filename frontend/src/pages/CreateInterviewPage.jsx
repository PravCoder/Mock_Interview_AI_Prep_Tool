import React, { useState} from 'react';
import { useParams } from 'react-router-dom';
import api from "../api"

import ProgressBar from '../components/ProgressBar';
import JobInfo from '../components/JobInfo';
import CompanyInfo from '../components/CompanyInfo';
import DocumentInfo from '../components/DocumentInfo';

function CreateInterview() {
    const { id } = useParams();
    const [step, setStep] = useState(0);

    // All the data fields we collect from the 3-components forms
    const [jobTitle, setJobTitle] = useState("none");
    const [jobDescription, setDescription] = useState("none");

    const [comapnyName, setCompanyName] = useState("none");
    const [companyDescription, setComapnyDescription] = useState("none");


    const handleNext = (newData) => {
        console.log("NewData:", newData);
        if (step === 0) {  // if the job-form has been submitted
            setJobTitle(newData.jobTitle);  // from all the job-form data get the title
            setDescription(newData.jobDescription);
        } else if (step === 1) {
            setCompanyName(newData.companyName);  // from all the job-form data get the title
            setComapnyDescription(newData.companyDescription);
        } else if (step === 2) {
            // setFormData(prev => ({ ...prev, documentData: newData }));
        }
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };


    const handleSubmit = async () => {
        try {

            const response = await api.post(`/api/create-interview/${id}/`, {
                job_title:jobTitle, 
                job_description:jobDescription,

                company_name: comapnyName,
                comapny_description: companyDescription,
            
            });  // pass in form data
            console.log(response.data);
        } catch (error) {
            console.error('Error creating interview:', error);
        }
    };


    return (
        <div>
            <ProgressBar step={step} />
            <div className="form-section">
                {step === 0 && <JobInfo onNext={handleNext} />}
                {step === 1 && <CompanyInfo onNext={handleNext} onBack={handleBack} />}
                {step === 2 && <DocumentInfo onNext={handleNext} onBack={handleBack} />}
                {step === 3 && <button onClick={handleSubmit}>Submit Interview</button>}
            </div>
        </div>
    );
}

export default CreateInterview;