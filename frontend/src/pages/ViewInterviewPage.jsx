import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
// import "../styles/ViewJobPage.css";
import api from "../api";
import { FaPlus } from 'react-icons/fa';

function ViewInterviewPage() {
    const { id } = useParams();
    const [interview, setInterview] = useState({});

    useEffect(() => {
      api.get(`/api/get-interview/${id}/`)
          .then(response => {
              setInterview(response.data.interview);
          })
          .catch(error => {
              console.log(error);
          });
    }, []);


    return (
      <h1>Viewing interview {id}</h1>
    );
}

export default ViewInterviewPage;