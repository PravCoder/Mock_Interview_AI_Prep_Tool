import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
// import "../styles/ViewJobPage.css";
import api from "../api";
import { FaPlus } from 'react-icons/fa';
import StartInterview from "../components/StartInterview";


function ViewInterviewPage() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchInterview = async () => {
          try {
              const response = await api.get(`/api/get-interview/${id}/`);
              setInterview(response.data.interview);
              setLoading(false);
          } catch (error) {
              console.error('Error fetching interview:', error);
              setLoading(false);
          }
      };

      fetchInterview();
  }, [id]);

  if (loading) {
      return <div>Loading...</div>;
  }

  if (!interview) {
      return <div>Interview not found.</div>;
  }

  return (
      <div>
          {interview.status === 'incomplete' ? (
              <StartInterview interview={interview} />
          ) : (
              <div>
                  <h2>Interview Details</h2>
                  {/* Render other interview details here */}
                  <p>Job Title: {interview.job_title}</p>
                  <p>Company Name: {interview.company_name}</p>
                  {/* Add more details as needed */}
              </div>
          )}
      </div>
  );
}

export default ViewInterviewPage;