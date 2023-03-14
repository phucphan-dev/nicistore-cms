import LOCAL_STORAGE from 'common/utils/constant';

let accessToken = window.localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
let refreshToken = window.localStorage.getItem(LOCAL_STORAGE.REFRESH_TOKEN);

/**
 * Listen for changes from other tabs
 */
window.addEventListener('storage', (event) => {
  if (event.key === 'token') {
    accessToken = event.newValue;
  }
});

export const getAccessToken = (): string | null => accessToken;

export const setAccessToken = (token: string): void => {
  accessToken = token;
  window.localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, token);
};
export const getRefreshToken = (): string | null => refreshToken;

export const setRefreshToken = (token: string): void => {
  refreshToken = token;
  window.localStorage.setItem(LOCAL_STORAGE.REFRESH_TOKEN, token);
};

export const removeAccessToken = (): void => {
  accessToken = null;
  window.localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
};

export const removeRefreshAccessToken = (): void => {
  accessToken = null;
  window.localStorage.removeItem(LOCAL_STORAGE.REFRESH_TOKEN);
};

export const setLocalStorage = (name: string, value: string) => {
  window.localStorage.setItem(name, value);
};

export const getLocalStorage = (name: string): string | null => window.localStorage.getItem(name);

export const clearLocalStorage = () => {
  window.localStorage.clear();
};

export const setSessionStorage = (name: string, value: string) => {
  window.sessionStorage.setItem(name, value);
};

export const getSessionStorage = (name: string) => window.sessionStorage.getItem(name);

export const removeSessionStorage = (name: string) => {
  window.sessionStorage.removeItem(name);
};
