import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import api from "../api";
import '../styles/TakeInterview.css'; // Import the CSS file


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

function TakeInterview({ interview }) {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");  // Current answer in the textarea
    const [answers, setAnswers] = useState({}); // to store answers for each question, for immedate update of saved answers. 

    const [isRecording, setIsRecording] = useState(false);


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
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [interview.id, currentQuestionIndex]);

    useEffect(() => {
        window.speechSynthesis.cancel();
        // Convert the current question text to speech whenever the current question changes
        if (questions.length > 0) {
            speakQuestion(questions[currentQuestionIndex].prompt);
        }
    }, [currentQuestionIndex, questions]);

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

    const handleQuestionSubmit = async (questionId) => {
        try {
            // make a post request to submit the answer to that question passing in question-id and user-answer to question
            const res =  await api.post("/api/save-question-answer/", {
                question_id: questionId,
                answer: userAnswer
            });

            // Update the answers state
            setAnswers(prevAnswers => ({
                ...prevAnswers,
                [questionId]: userAnswer
            }));
            console.log("Answer submitted for question ID:", questionId);
        } catch (error) {
            alert("Error submitting answer: " + error);
        }
    };


    const handleEndInterview = async () => {
        try {
            // Making a POST request to end the interview
            const response = await api.post(`/api/end-interview/${interview.id}/`, {
                // Pass any data if needed
            });

            // Handle success (e.g., redirect to a summary page or show a message)
            console.log("Interview ended successfully:", response.data);

            // Optional: redirect or show success message
        } catch (error) {
            console.error("Error ending the interview:", error);
            alert("There was an error ending the interview. Please try again.");
        }
    };


    const voices = window.speechSynthesis.getVoices();
        voices.forEach((voice, index) => {
            // console.log(`${index}: ${voice.name} (${voice.lang})`);
    });

    const speakQuestion = (text) => {
        
        window.speechSynthesis.cancel();  // Cancel ongoing speech

        const utterance = new SpeechSynthesisUtterance(text);

        // Get the available voices
        const voices = window.speechSynthesis.getVoices();

        // Select a voice by name or index (you can choose based on the list of available voices)
        const selectedVoice = voices.find(voice => voice.name === 'Grandpa (English (United States))'); // Example voice
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        // Speak the question with the selected voice
        window.speechSynthesis.speak(utterance);
    };


    const toggleRecording = () => {
        if (isRecording) {
            recognition.stop(); // Stop listening
        } else {
            recognition.start(); // Start listening
        }
        setIsRecording(!isRecording); // Toggle recording state
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserAnswer(transcript); // Set the recorded text as the answer
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
        setIsRecording(false); // Automatically stop recording when SpeechRecognition ends
    };

    const startListening = () => {
        recognition.start();
        setIsListening(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log("Transcript: ", transcript);
            setUserAnswer(transcript);  // Set the transcribed speech as the user's answer
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Error occurred in recognition: ", event.error);
            setIsListening(false);
        };
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
                    </>
                ) : (
                    <p>Loading answer box...</p>
                )}
                

                {/* Record Answer Button */}
                <button
                    className={`record-button ${isRecording ? 'recording' : ''}`}
                    onClick={toggleRecording}
                    style={{
                        backgroundColor: isRecording ? 'red' : 'gray',
                        color: 'white'
                    }}
                >
                    {isRecording ? 'Stop Recording' : 'Record Answer'}
                </button>

                <button className="end-interview-button" onClick={handleEndInterview}>
                    End Interview
                </button>
            </div>

            
            
        </div>
        
    );
}

export default TakeInterview;