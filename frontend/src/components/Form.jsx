import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

// props: route is the path we want to go to upon submission, method is login or register
function Form({ route, method }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();  // navigate func to redirect
    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const data = { email, password };
            if (method === "register") {
                data.first_name = firstName;
                data.last_name = lastName;
            }

            console.log(data);
            const res = await api.post(route, data);
            if (method === "login") {  // if the form-method was login set the access token in localstorage to the response.tokens
                localStorage.setItem(ACCESS_TOKEN, res.data.access); // Assuming the response contains a token
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");  // after logging in navigate to home page
            } else {   // form-method was register, so redirect to login
                navigate("/login");
            }

        } catch (error) {
            console.log(error);
            alert(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>

            {method === "register" && (
                <>
                    <input
                        className="form-input"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                    />
                    <input
                        className="form-input"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                    />
                </>
            )}

            <input
                className="form-input"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />

            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />

            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">{name}</button>
        </form>
    );
}

export default Form;
