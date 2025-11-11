import axios from "axios";
import { SERVER_URL } from "@/lib/env";

export const api = axios.create({
    baseURL: SERVER_URL,
    headers: {
        "Content-Type": "application/json"
    },
})

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
})