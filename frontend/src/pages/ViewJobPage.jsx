import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import "../styles/ViewJobPage.css";
import InterviewsList from '../components/InterviewsList';
import api from "../api";
import { FaPlus } from 'react-icons/fa';

function ViewJobPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState([]);
    const [interviews, setInterviews] = useState([]);

    // list all interview within this job'

    useEffect(() => {
      api.get(`/api/get-interviews-in-job/${id}/`)
          .then(response => {
              setJob(response.data.job);
              setInterviews(response.data.interviews);
              console.log("RESPONSE DATA: ", response.data);
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

          <InterviewsList interviews={interviews} />

      </div>
    );
}

export default ViewJobPage;