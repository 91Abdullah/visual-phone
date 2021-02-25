import apiClient from "./apiClient";
import {
    aCDRs,
    aStats,
    cookie,
    domain, getAgentStatusInQueue, getChannelId, getPauseReasons,
    getQueue,
    getUser, getWorkcodes,
    isReady,
    loginQueue,
    logoutQueue,
    notReadyAgent,
    qStats,
    readyAgent
} from "./routes";
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

export const fetchQStats = () => {
    return apiClient.get(cookie).then(() => apiClient.post(qStats)).then(res => res.data)
}

export const fetchAStats = () => {
    return apiClient.get(cookie).then(() => apiClient.post(aStats)).then(res => res.data)
}

export const fetchACDRs = () => {
    return apiClient.get(cookie).then(() => apiClient.post(aCDRs)).then(res => res.data)
}

export const fetchWorkcodes = () => {
    return apiClient.get(cookie).then(() => apiClient.get(getWorkcodes)).then(res => res.data)
}

export const fetchChannelId = () => {
    return apiClient.get(cookie).then(() => apiClient.post(getChannelId).then(res => res.data))
}

export const fetchPauseReasons = () => {
    return apiClient.get(cookie).then(() => apiClient.get(getPauseReasons).then(res => res.data))
}

export const fetchAgentStatusInQueue = () => {
    return apiClient.get(cookie).then(() => apiClient.post(getAgentStatusInQueue)).then(res => res.data)
}