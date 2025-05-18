import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true, // to send cookies to the server every time we make a request
})