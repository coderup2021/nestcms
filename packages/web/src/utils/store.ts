const PRE_KEY = "__NESTCMS__"
export const AUTH_TOKEN_NAME = 'AUTH_TOKEN'

export const setSessionStorage = (key: string, value: string) => {
  sessionStorage.setItem(`${PRE_KEY}${key}`, value)
}

export const getSessionStorage = (key: string) => {
  return sessionStorage.getItem(`${PRE_KEY}${key}`)
}

export const setLocalStorage = (key: string, value: string) => {
  localStorage.setItem(`${PRE_KEY}${key}`, value)
}

export const getLocalStorage = (key: string) => {
  return localStorage.getItem(`${PRE_KEY}${key}`)
}

export const setAuthToken = (token: string, memory: boolean) => {
  if (memory) {
    setLocalStorage(AUTH_TOKEN_NAME, token)
  } else {
    setSessionStorage(AUTH_TOKEN_NAME, token)
  }
}

export const getAuthToken = () => {
  let token = ""
  let sToken = getSessionStorage(AUTH_TOKEN_NAME) || ""
  let lToken = getLocalStorage(AUTH_TOKEN_NAME) || ""
  if (sToken) {
    token = sToken
  }
  if (lToken) {
    token = lToken
  }
  return token
}

export const clearAuthToken = () => {
  setLocalStorage(AUTH_TOKEN_NAME, '')
  setSessionStorage(AUTH_TOKEN_NAME, '')
}
