/* eslint-disable import/no-cycle */
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

import { refreshTokenService } from '../authenticate';

import { getAccessToken, setAccessToken, setRefreshToken } from './storage';

import { store } from 'app/store';
import { setGlobalError } from 'app/systemSlice';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  ($config: AxiosRequestConfig): AxiosRequestConfig => {
    if ($config.headers) {
      const token = getAccessToken();
      if (token) {
        $config.headers.Authorization = `Bearer ${token}`;
      }
      $config.headers['Content-Type'] = 'application/json';
      $config.headers.Accept = 'application/json';
    }
    return $config;
  },
  async (error: AxiosError): Promise<AxiosError> => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError) => {
    const status = error.response ? error.response.status : null;
    const originalRequest = error.config;
    if (status === 401) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          }
          return Promise.reject(error);
        }).catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      return new Promise((resolve, reject) => {
        refreshTokenService()
          .then((data) => {
            if (originalRequest && originalRequest.headers) {
              setAccessToken(data.accessToken);
              setRefreshToken(data.refreshToken);
              axiosInstance.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
              originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
              processQueue(null, data.accessToken);
              resolve(axiosInstance.request(error.config));
            }
          })
          .catch((err) => {
            processQueue(err, null);
            reject(err);
          })
          .finally(() => { isRefreshing = false; });
      });
    }

    if (error.response) {
      if (status === 422) {
        return Promise.reject((error.response.data as { errors: ErrorResponse[] }).errors);
      }
      if (store.getState().auth.profileData) {
        store.dispatch(setGlobalError(status as ErrorStatusCode));
      }
    }
    return Promise.reject(error);
  },
);
export default axiosInstance;
