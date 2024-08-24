import React, {useState} from 'react';
import "../styles/InterviewsList.css";


function InterviewsList({ interviews }) {
    return (
        <div className="interviews-list">
            {interviews.map((interview, index) => (
                <div key={index} className="interview-card">
                    <h3 className="interview-title">{interview.company_name}</h3>

                    {/* Add more details as needed */}
                </div>
            ))}
        </div>
    );
}

export default InterviewsList;