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