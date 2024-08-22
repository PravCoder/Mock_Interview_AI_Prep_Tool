import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
// import "../styles/ViewJobPage.css";
import api from "../api";
import { FaPlus } from 'react-icons/fa';

function ViewInterviewPage() {
    const { id } = useParams();


    return (
      <h1>Viewing interview {id}</h1>
    );
}

export default ViewInterviewPage;