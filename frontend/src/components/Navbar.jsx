import {useState} from "react";
import api from "../api";
import { Link } from 'react-router-dom';
import "../styles/Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-link">Home</Link>
            </div>
            <div className="navbar-right">
                <Link to="/login" className="navbar-link">Login</Link>
            </div>
        </nav>
    );
}

export default Navbar;