import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import "../styles/InterviewsList.css";


function InterviewsList({ interviews }) {
    return (
        <div className="interviews-list-container">
            {interviews.map((interview, index) => (
                <Link to={`/view-interview/${interview.id}`} key={interview.id} className="interview-card-link">
                    <div key={index} className="interview-card">

                        <div className="interview-card-title">
                            {interview.job_title} @ {interview.company_name}
                        </div>

                        <div className="interview-card-company">
                            {interview.company_name}
                        </div>

                    </div>
                </Link>
                
            ))}
        </div>
    );
}

export default InterviewsList;