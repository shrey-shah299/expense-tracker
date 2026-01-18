import axios from "axios"

const API_BASE="http://localhost:3000/api";
const api=axios.create({
    baseURL:API_BASE,
    timeout: 10000,
});

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error("API Error:", error);
        return Promise.reject(error.response ? error.response.data : error);
    }
)

export default api
