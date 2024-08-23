import React, {useState} from 'react';

function CompanyInfo({ onNext, onBack }) {

    // this group-dict represents all the job-data
    const [companyData, setCompanyData] = useState({
        company_name: "",
        company_description: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext({ companyName: companyData.company_name, companyDescription: companyData.company_description });  // pass the entered data in this form to back to CreateInterviewPage component, in a group ()
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Company Information</h2>

            <input type="text" value={companyData.company_name} onChange={(e) => setCompanyData({ ...companyData, company_name: e.target.value })} placeholder="Enter the name of the company" />

            <textarea 
                type="text" 
                value={companyData.company_description} 
                onChange={(e) => setCompanyData({ 
                    ...companyData, 
                    company_description: e.target.value 
                })} 
                placeholder="Enter the description of company or what it's about" 
            />

            {/* Add more fields */}
            <button type="submit">Next</button>
        </form>
    );
}

export default CompanyInfo;
