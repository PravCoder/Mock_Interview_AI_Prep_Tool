import React, {useState} from 'react';

function JobInfo({ onNext }) {
    // this group-dict represents all the job-data
    const [jobData, setJobData] = useState({
        job_title: "",
        job_description: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext({ jobTitle: jobData.job_title, jobDescription: jobData.job_description });  // pass the entered data in this form to back to CreateInterviewPage component, in a group ()
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Job Information</h2>
            {/* job title field set the job-title field and keep everything else */}
            <input type="text" value={jobData.job_title} onChange={(e) => setJobData({ ...jobData, job_title: e.target.value })} placeholder="Enter the offical title of the job" />

            {/* job description field set the job-description field and keep everything else entered */}
            <textarea type="text" value={jobData.job_description} onChange={(e) => setJobData({ ...jobData, job_description: e.target.value })} placeholder="Enter the description of job" />

            {/* Add more fields */}
            <button type="submit">Next</button>
        </form>
    );
}

export default JobInfo;
