import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
// import "../styles/ViewJobPage.css";
import api from "../api";
import { FaPlus } from 'react-icons/fa';
import StartInterview from "../components/StartInterview";
import TakeInterview from "../components/TakeInterview";
import ReviewInterview from "../components/ReviewInterview";


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
          {/* if interview is incomplete they havent even started */}
          {/* if interview is in_progress display take-interview */}
          {/* if interview is in_progress display review-interview */}
          {interview.status === "incomplete" && <StartInterview  interview={interview} />}
          {interview.status === "in_progress" && <TakeInterview interview={interview} />}
          {interview.status === "complete" && <ReviewInterview  interview={interview} />}
      </div>
  );
}

export default ViewInterviewPage;