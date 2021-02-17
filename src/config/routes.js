export const login = `/login`
export const logout = `/logout`
export const cookie = `/sanctum/csrf-cookie`
export const domain = '/api/system-setting'
export const getUser = '/api/get-user'

// Agent routes
export const getQueue = '/api/agent/get-queue'
export const loginQueue = '/api/agent/login'
export const logoutQueue = '/api/agent/logout'
export const readyAgent  = '/api/agent/unpause'
export const notReadyAgent  = '/api/agent/pause'
export const isReady = '/api/agent/is-ready'