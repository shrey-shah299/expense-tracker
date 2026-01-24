import axios from "axios"

const API_BASE=import.meta.env.VITE_API_URL ||"https://expense-tracker-i45m.onrender.com/api";
const api=axios.create({
    baseURL:API_BASE,
    timeout: 60000,
});

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error("API Error:", error);
        return Promise.reject(error.response ? error.response.data : error);
    }
)

export default api
