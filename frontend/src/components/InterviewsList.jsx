import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import "../styles/InterviewsList.css";


function InterviewList({ interviews }) {
    return (
        <div className="interview-list">
            {interviews.map((interview) => (
                <Link to={`/view-interview/${interview.id}`} key={interview.id} className="interview-card-link">
                    <div className="interview-card">
                        <h3 className="interview-title">{interview.job_title}</h3>
                        <p className="company-name">{interview.company_name}</p>
                        <p className={`interview-status ${interview.status.toLowerCase()}`}>
                            {interview.status === 'incomplete' ? 'Incomplete' :
                             interview.status === 'in progress' ? 'In Progress' :
                             'Complete'}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default InterviewList;