import apiClient from "./apiClient";
import {cookie, notReadyAgent, submitWorkcode} from "./routes";

export const postWorkcode = data => apiClient.get(cookie).then(() => apiClient.post(submitWorkcode, data))
export const postNotReady = reason => apiClient.get(cookie).then(() => apiClient.post(notReadyAgent, reason))