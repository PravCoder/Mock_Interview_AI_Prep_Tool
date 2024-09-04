import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
// import "../styles/ViewJobPage.css";
import api from "../api";
import { FaPlus } from 'react-icons/fa';
import StartInterview from "../components/StartInterview";
import TakeInterview from "../components/TakeInterview";


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
          {/* if interview is incomplete display start-interview-comp else start the interview */}
          {interview.status === 'incomplete' ? (
              <StartInterview interview={interview} />
          ) : (
              <TakeInterview interview={interview}/>
          )}
      </div>
  );
}

export default ViewInterviewPage;