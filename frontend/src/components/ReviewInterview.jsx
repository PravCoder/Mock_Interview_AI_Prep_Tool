import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import api from "../api";
import '../styles/TakeInterview.css'; // Import the CSS file

function ReviewInterview({ interview }) {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");  // Current answer in the textarea
    const [answers, setAnswers] = useState({}); // to store answers for each question, for immedate update of saved answers. 
    const [feedbacks, setFeedbacks] = useState({});

    useEffect(() => {
        api.get(`/api/get-interview-questions/${interview.id}/`)
            .then(response => {
                setQuestions(response.data.questions);
                console.log("questions: ", response.data.questions);
                // Set initial userAnswer from the current question's user_answer
                if (response.data.questions.length > 0) {
                    const initialQuestion = response.data.questions[currentQuestionIndex];
                    // setUserAnswer(initialQuestion.user_answer || "");
                    // when we get the questions set the answers to the questions.answers if any of them have answers to display saved answers: ..
                    setAnswers(
                        response.data.questions.reduce((acc, question) => {
                            acc[question.id] = question.user_answer || "";
                            return acc;
                        }, {})
                    );
                    setFeedbacks(
                        response.data.questions.reduce((acc, question) => {
                            acc[question.id] = question.feedback || "";
                            return acc;
                        }, {})
                    );
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [interview.id, currentQuestionIndex]);


    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setUserAnswer("");
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setUserAnswer("");
        }
    };

    const handleAnswerChange = (e) => {
        setUserAnswer(e.target.value);
    };




    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="interview-container">
            <div className="question-box">
                {currentQuestion ? (
                    <>
                        <h2>Question #{currentQuestionIndex + 1}</h2>
                        <p>{currentQuestion.prompt}</p>
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
                {currentQuestion ? (
                    <>
                        <textarea
                            placeholder="Type your answer here..."
                            value={userAnswer}
                            onChange={handleAnswerChange}
                        />
                        <button
                            className="submit-typed-button"
                            onClick={() => handleQuestionSubmit(currentQuestion.id)}
                        >
                            Submit Typed Answer
                        </button>
                        <p>Saved Answer: {answers[currentQuestion.id] || "No answer submitted yet"}</p>

                        <p>How to Improve: {feedbacks[currentQuestion.id] || "No answer submitted yet"}</p>
                    </>
                ) : (
                    <p>Loading answer box...</p>
                )}
                <button className="record-button">Record Answer</button>

            </div>

            
            
        </div>
        
    );
}

export default ReviewInterview;