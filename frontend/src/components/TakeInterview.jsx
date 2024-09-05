import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import api from "../api";
import '../styles/TakeInterview.css'; // Import the CSS file

function TakeInterview({ interview }) {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");  // users answer to cur-question

    useEffect(() => {
        api.get(`/api/get-interview-questions/${interview.id}/`)
            .then(response => {
                setQuestions(response.data.questions);
                console.log("questions: ", response.data.questions);
            })
            .catch(error => {
                console.log(error);
            });
    }, [interview.id]);

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleAnswerChange = (e) => {  // sets the answer to cur question
        setUserAnswer(e.target.value);
    };

    const handleQuestionSubmit = async (questionId) => {
        try {
            // make a post request to submit the answer to that question passing in question-id and user-answer to question
            const res = await api.post("/api/save-question-answer/", {
                question_id: questionId,
                answer: userAnswer
            });

            console.log("Answer submitted for question ID:", questionId);
        } catch (error) {
            alert("Error submitting answer: " + error);
        }
    };

    return (
        <div className="interview-container">
            <div className="question-box">
                {questions.length > 0 ? (
                    <>
                        <h2>Question #{currentQuestionIndex + 1}</h2>
                        <p>{questions[currentQuestionIndex].prompt}</p>
                    </>
                ) : (
                    <p>Loading questions...</p>
                )}
                <div className="navigation-buttons">
                    <button onClick={handleBack} disabled={currentQuestionIndex === 0}>
                        ← Back
                    </button>
                    <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>
                        Next →
                    </button>
                </div>
            </div>
            <div className="answer-box">
                <textarea placeholder="Type your answer here..." value={userAnswer} onChange={handleAnswerChange} />  
                <button className="submit-typed-button" onClick={() => handleQuestionSubmit(questions[currentQuestionIndex].id)} > Submit Typed Answer</button>
                <button className="record-button">Record Answer</button>
            </div>
        </div>
    );
}

export default TakeInterview;