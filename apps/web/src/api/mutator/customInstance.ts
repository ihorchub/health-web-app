import Axios, { type AxiosError, type AxiosRequestConfig } from 'axios';

import i18n from '@/i18n';

export const AXIOS_INSTANCE = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  withCredentials: true,
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
  config.headers.set('Accept-Language', i18n.language === 'en' ? 'en' : 'uk');
  return config;
});

type CancellablePromise<T> = Promise<T> & {
  cancel: () => void;
};

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();

  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data as T) as CancellablePromise<T>;

  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export type ErrorType<Error> = AxiosError<Error>;
