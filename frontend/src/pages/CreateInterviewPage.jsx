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

    const [companyName, setCompanyName] = useState("none");
    const [companyDescription, setCompanyDescription] = useState("none");

    const [resume, setResume] = useState("none");


    const handleNext = (newData) => {
        console.log("NewData:", newData);
        if (step === 0) {  // if the job-form has been submitted
            setJobTitle(newData.jobTitle);  // from all the job-form data get the title
            setDescription(newData.jobDescription);
        } else if (step === 1) {
            setCompanyName(newData.companyName);  // from all the job-form data get the title
            setCompanyDescription(newData.companyDescription);
        } else if (step === 2) {
            setResume(newData.resume);
        }
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };


    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const formData = new FormData(); // stores all data from job, company, resume
        formData.append("job_title", jobTitle);
        formData.append("job_description", jobDescription);
        formData.append("company_name", companyName);
        formData.append("company_description", companyDescription);

        if (resume) {
            formData.append('resume', resume);  // add the file to FormData
        }

        try {
            const response = await api.post(`/api/create-interview/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
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