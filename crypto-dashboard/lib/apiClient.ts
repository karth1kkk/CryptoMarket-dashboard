import axios from "axios";

const getBase = () => {
    const u = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!u) throw new Error("base url is not set");
    return u.replace(/\/$/, "");
};

//one axios instance through baseUrl + json
export const apiClient = axios.create({
    baseURL: getBase(),
    headers: { Accept: "application/json" },
    timeout: 15_000,
});

apiClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("krypt:token");
        if(token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
})