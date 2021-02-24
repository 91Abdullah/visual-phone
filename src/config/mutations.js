import apiClient from "./apiClient";
import {cookie, notReadyAgent, submitWorkcode} from "./routes";

export const postWorkcode = (workcode, channel) => apiClient.get(cookie).then(() => apiClient.post(submitWorkcode, { workcode, channel }))
export const postNotReady = reason => apiClient.get(cookie).then(() => apiClient.post(notReadyAgent, reason))