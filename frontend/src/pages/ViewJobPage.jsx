import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import api from "../api";


function ViewJobPage() {
    const { id } = useParams();  


    // create interview button
    // list all interviews for this job


    return (
      <h1>View job: {id}</h1>
    );
  }
  
  export default ViewJobPage;