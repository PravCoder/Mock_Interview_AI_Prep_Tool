import React from 'react';
// import { useHistory } from 'react-router-dom';
import "../styles/StartInterview.css";
import { useState } from 'react';
import api from '../api';

function StartInterview({ interview }) {
    // const history = useHistory();
    const [inter, setInter] = useState(interview);

    const startInterview = async () => {
        try {
            const response = await api.post(`/api/start-interview/${interview.id}/`);
            setInter(response.data.interview);
        } catch (error) {
            console.error('Error starting interview:', error);
        }
    };

    return (
        <div className="start-interview-container">
            <div className="start-interview-message">
                <h2>You are about to start the interview for {inter.job_title} @ {inter.company_name}</h2>
            </div>
            <button className="start-interview-button" onClick={startInterview}>
                Start Interview
            </button>
        </div>
    );
}

export default StartInterview;
