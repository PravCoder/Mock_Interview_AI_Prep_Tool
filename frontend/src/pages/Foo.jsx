import React, { useState, useEffect } from "react";
import api from "../api"; // Ensure this is the correct path to your api module
import { useNavigate } from "react-router-dom";
import FooForm from "../components/FooForm";


function Foo() {
    const [fooList, setFooList] = useState([]);


    useEffect(() => {
        getFoos();
    }, []); // Add dependency array to ensure this runs only once

    const getFoos = () => {
        api.get("/api/get-foo/")
            .then(res => {
                console.log(res);
                
            })
            .catch(err => {
                console.error(err);
            });
    };

    return (
        <div>
            <h1>Langchain testing...</h1>
        </div>
    );
}

export default Foo;
