import {useState, useEffect} from "react";
import api from "../api"
import CreateJob from "../components/CreateJob";
import ViewJobs from "../components/ViewJobs";

import "../styles/Home.css";

function Home() {

    return (
        <div>
             <CreateJob />
             <ViewJobs />
        </div>
    )
        
}

export default Home;