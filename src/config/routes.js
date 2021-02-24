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
export const qStats = '/api/agent/queue-stats'
export const aStats = '/api/agent/agent-stats'
export const aCDRs = '/api/agent/agent-cdr'
export const getChannelId = '/api/agent/channel'

// Workcode fetch
export const getWorkcodes = '/api/workCode'
export const getPauseReasons = '/api/pause-reason'

// Mutations
export const submitWorkcode = '/api/agent/workcode'