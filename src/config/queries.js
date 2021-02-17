import apiClient from "./apiClient";
import {cookie, domain, getQueue, getUser, isReady, loginQueue, logoutQueue, notReadyAgent, readyAgent} from "./routes";
import axios from "axios";

export const fetchDomain = () => {
    return apiClient.get(cookie).then(() => apiClient.get(domain).then(response => response.data[0]))
}

export const fetchUser = () => {
    return apiClient.get(cookie).then(() => apiClient.get(getUser).then(response => response.data))
}

export const fetchQueue = () => {
    return apiClient.get(cookie).then(() => apiClient.get(getQueue)).then(res => res.data)
}

export const fetchLoginQueue = () => {
    return apiClient.get(cookie).then(() => apiClient.post(loginQueue)).then(res => res.data)
}

export const fetchLogoutQueue = () => {
    return apiClient.get(cookie).then(() => apiClient.post(logoutQueue)).then(res => res.data)
}

export const fetchReadyQueue = () => {
    return apiClient.get(cookie).then(() => apiClient.post(readyAgent)).then(res => res.data)
}

export const fetchNotReadyQueue = () => {
    return apiClient.get(cookie).then(() => apiClient.post(notReadyAgent)).then(res => res.data)
}

export const fetchIsReady = () => {
    return apiClient.get(cookie).then(() => apiClient.post(isReady)).then(res => res.data)
}