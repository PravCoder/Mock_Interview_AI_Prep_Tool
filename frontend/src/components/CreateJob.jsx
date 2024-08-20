import { useState } from "react";
import "../styles/CreateJob.css";
import api from "../api";

function CreateJob() {
    const [selectedJob, setSelectedJob] = useState("");
    const [jobList, setJobList] = useState([
        "Software Engineer",
        "Machine Learning Engineer",
        "ML Intern",
        "Data Scientist",
        // Add more job titles as needed
    ]);

    const handleJobChange = (event) => {
        setSelectedJob(event.target.value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/api/create-job/", {selectedJob});
            console.log(res);

        } catch (error) {
            alert(error);
        } finally {
        }
    }

    return (
        <div className="create-job-container">
            <h1>Create New Job</h1>
            <div className="form-group">
                <label htmlFor="job-select">Select Job Title or Create Custom Job:</label>
                <input
                    list="job-titles"
                    id="job-select"
                    value={selectedJob}
                    onChange={handleJobChange}
                    placeholder="Search and select a job title..."
                    className="job-input"
                />
                <datalist id="job-titles">
                    {jobList.map((job, index) => (
                        <option key={index} value={job} />
                    ))}
                </datalist>
            </div>
            <button className="submit-button" onClick={handleSubmit}>
                Create Job
            </button>
        </div>
    );
}

export default CreateJob;
