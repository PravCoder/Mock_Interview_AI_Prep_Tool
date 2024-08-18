import {Navigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";
// if we wrap something in protected-route then we need to have an authorization token before we can access that route

function ProtectedRoute({children}) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    // async func that refreshes the access token
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            // send request to backend with the refresh token to get a new access token
            // response = send post-request to this route passing in refresh-token as payload
            const res = await api.post("/api/token/refresh/", {refresh:refreshToken});
            if (res.status === 200) {  // if the response was successful
                localStorage.setItem(ACCESS_TOKEN, res.data.access)  // set the access-token key equal to the response.data.access new token
                setIsAuthorized(true);
            } else {
                setIsAuthorized(true);
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    }

    // async func that tells if we need to refresh the token
    const auth = async () => {
        // check if we have a access token, if we do check if its expired if it is refresh it
        const token = localStorage.getItem(ACCESS_TOKEN);  // get token from local-storage
        if (!token) {   // if token doesnt exist set isAuth to false return
            setIsAuthorized(false);
            return
        }
        const decoded = jwtDecode(token);  // decodes token and gives access to expiration date
        const tokenExpiration = decoded.exp;  // get the expiration date of decoded-token
        const now = Date.now() / 1000;  // get date in seconds current time

        // if token-expiration-date is less than now, then token has expired
        if (tokenExpiration < now) {
            await refreshToken()
        } else {  // if token is not expired, set isAuth to true, they are authorized
            setIsAuthorized(true)
        }
    }   
    
    // while isAuth-state is null that means we are either checking the token or refreshing it
    if (isAuthorized === null) {
        return <div>Loading...</div>
    }

    // if isAuthorized is true then we return the children-component, else navigate to the login-route
    return isAuthorized ? children : <Navigate to="login"/>
}

export default ProtectedRoute;