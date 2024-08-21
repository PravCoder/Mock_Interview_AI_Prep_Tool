import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import "../styles/ViewJobPage.css";
import api from "../api";
import { FaPlus } from 'react-icons/fa';

function ViewJobPage() {
    const { id } = useParams();
    const [job, setJob] = useState([]);
    const navigate = useNavigate();

    // list all interview within this job'

    useEffect(() => {
      api.get(`/api/get-job-one/${id}/`)
          .then(response => {
              setJob(response.data.job);
              console.log(response.data)
          })
          .catch(error => {
              console.log(error);
          });
    }, []);

    const handleCreateInterview = () => {
        navigate(`/create-interview/${id}`);
    };

    return (
      <div className="view-job-page-container">
          <h1 className="view-job-title">{job.title} Interviews</h1>
          
          <button className="create-interview-button" onClick={handleCreateInterview}>
              <FaPlus className="plus-icon" /> Create Interview
          </button>

          {/* List of interviews for this job can be added here */}
      </div>
    );
}

export default ViewJobPage;