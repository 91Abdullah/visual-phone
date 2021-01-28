import apiClient from "./apiClient";
import {cookie, domain, getUser} from "./routes";
import axios from "axios";

export const fetchDomain = () => {
    return apiClient.get(cookie).then(() => apiClient.get(domain).then(response => response.data[0]))
}

export const fetchUser = () => {
    return apiClient.get(cookie).then(() => apiClient.get(getUser).then(response => response.data))
}