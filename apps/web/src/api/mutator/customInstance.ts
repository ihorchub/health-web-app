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

/** Orval Axios mutator (`httpClient: 'axios'`). */
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();
  const signal = options?.signal ?? config.signal;

  if (signal) {
    if (signal.aborted) {
      source.cancel('Query was cancelled');
    } else if (typeof signal.addEventListener === 'function') {
      signal.addEventListener(
        'abort',
        () => {
          source.cancel('Query was cancelled');
        },
        { once: true },
      );
    }
  }

  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
    signal,
  }).then(({ data }) => data as T) as CancellablePromise<T>;

  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
