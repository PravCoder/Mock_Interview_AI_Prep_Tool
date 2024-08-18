import axios from "axios";
import { ACCESS_TOKEN } from "./constants";
// Interceptor: intercepts any requests that we are going to send, and automatically add the correct headers so that we dont need to manually write it a bunch of times in our code.
// we import this api-var in other files to send requests
// allows us to import anything that is specified inside an environment variable file. Create axios-object

// from choreo connection backend or frontend, uses this url in deployment, new base url in deployment
const apiUrl = "/choreo-apis/djangoreacttutorial/backend/v1"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,  // import vite-api-url var
})


api.interceptors.request.use(
    // func takes in config, look in local-storage and see if we have a access-token
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {  // if we have a token add it as a authorizationheader to our request
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default api;