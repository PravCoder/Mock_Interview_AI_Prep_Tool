import {useState} from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function FooForm() {
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/api/create-foo/", {content});
            

        } catch (error) {
            alert(error);
        } finally {
        }
    }

    return <form onSubmit={handleSubmit} className="form-container">
        <h1>Create Foo</h1>
         
        <input className="form-input" type="text" value={content} onChange={(e) => setContent(e.target.value)} placeholder="content.."/>

        <button className="form-button" type="submit">create foo</button>
    
    </form>
}

export default FooForm;
