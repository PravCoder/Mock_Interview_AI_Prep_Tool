import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/ViewJobs.css";
import api from "../api";

function ViewJobs() {
    const [jobs, setJobs] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        api.get("/api/get-jobs/")
            .then(response => {
                setJobs(response.data.jobs);
                console.log("jobs: " + response.data.jobs);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleDropdownToggle = (jobId) => {
        setActiveDropdown(activeDropdown === jobId ? null : jobId);
    };

    const handleDelete = async (jobId) => {
        console.log(jobId);
        setActiveDropdown(null); // Close the dropdown after deleting
        try {
            const res = await api.post(`/api/delete-job/${jobId}/`);
            console.log(res);
            // Optionally, remove the deleted job from the jobs array
            setJobs(jobs.filter(job => job.id !== jobId));
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div className="view-jobs-container">
            <h1>Current Jobs</h1>
            <div className="jobs-grid">
                {jobs.map((job, index) => (
                    <div className="job-card" key={index}>
                        <Link to={`/view-job/${job.id}`} className="job-link">
                            <h2 className="job-title">{job.title}</h2>
                            {/* Space for other details */}
                        </Link>
                        <div className="job-options">
                            <button
                                className="options-button"
                                onClick={() => handleDropdownToggle(job.id)}
                            >
                                &#x22EE;
                            </button>
                            {activeDropdown === job.id && (
                                <div className="options-dropdown">
                                    <button
                                        className="dropdown-option"
                                        onClick={() => handleDelete(job.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ViewJobs;
