import ky, { Options, HTTPError } from 'ky';

import * as httpConstants from '../constants/http';

import { MediaTypes } from '../types';
import { StringUtil } from '../utils/StringUtil';

import { i18n } from './i18n';

import packageInfo from '../../package.json';

export const SUCCESS_OK = 200;
export const SUCCESS_CREATED = 201;
export const SUCCESS_ACCEPTED = 202;
export const SUCCESS_NON_AUTHORITATIVE_INFORMATION = 203;
export const SUCCESS_NO_CONTENT = 204;
export const SUCCESS_RESET_CONTENT = 205;
export const SUCCESS_PARTIAL_CONTENT = 206;
export const REDIRECT_MULTIPLE_CHOICES = 300;
export const REDIRECT_MOVED_PERMANENTLY = 301;
export const REDIRECT_FOUND = 302;
export const REDIRECT_SEE_OTHER = 303;
export const REDIRECT_NOT_MODIFIED = 304;
export const REDIRECT_TEMPORARY_REDIRECT = 307;
export const REDIRECT_PERMANENT_REDIRECT = 308;
export const CL_ERROR_BAD_REQUEST = 400;
export const CL_ERROR_UNAUTHORIZED = 401;
export const CL_ERROR_FORBIDDEN = 403;
export const CL_ERROR_NOT_FOUND = 404;
export const CL_ERROR_METHOD_NOT_ALLOWED = 405;
export const CL_ERROR_NOT_ACCEPTABLE = 406;
export const CL_ERROR_PROXY_AUTHENTICATION_REQUIRED = 407;
export const CL_ERROR_REQUEST_TIMEOUT = 408;
export const CL_ERROR_CONFLICT = 409;
export const CL_ERROR_GONE = 410;
export const CL_ERROR_PRECONDITION_FAILED = 412;
export const CL_ERROR_PAYLOAD_TOO_LARGE = 413;
export const CL_ERROR_TOO_MANY_REQUESTS = 429;
export const SV_ERROR_INTERNAL_ERROR = 500;
export const SV_ERROR_BAD_GATEWAY = 502;
export const SV_ERROR_SERVICE_UNAVAILABLE = 503;
export const SV_ERROR_GATEWAY_TIMEOUT = 504;

export const CONTEXT_PATH = process.env.REACT_APP_CONTEXT_PATH ?? '';
export const BASE_URL = process.env.REACT_APP_BASE_URL ?? `/${CONTEXT_PATH}`;

const initialOptions: Options = {
  prefixUrl: BASE_URL,
  timeout: 60000,
};

export interface RestRequest<T = { [key: string]: any }> {
  /**
   * リクエストパラメータ
   */
  parameters?: T;
}

export interface Result {}

export interface ErrorResult {
  timestamp: Date;
  status: number;
  error: string;
  errors?: Map<string, string>;
  path: string;
}

export interface RestResponse<T = unknown> {
  /**
   * メッセージ
   */
  message: string;

  /**
   * 結果
   */
  result: T;
}

const HttpMethods = StringUtil.toEnum([
  'get',
  'post',
  'put',
  'patch',
  'delete',
]);
export type HttpMethod = keyof typeof HttpMethods;

export class AuthenticationError extends HTTPError {}

export class ExpiredAccessTokenError extends HTTPError {}

export class PermissionError extends HTTPError {}

export class BusinessError extends HTTPError {}

export class OptimisticLockError extends HTTPError {}

export class PayloadTooLargeError extends HTTPError {}

export class SystemError extends HTTPError {}

export class BadGatewayError extends HTTPError {}

export class ServiceUnavailableError extends HTTPError {}

export class GatewayTimeoutError extends HTTPError {}

class HttpClient {
  /**
   * GET
   */
  get = async (
    url: string,
    searchParams?: Options['searchParams'],
  ): Promise<Response> => {
    const options: Options = {
      ...initialOptions,
      method: HttpMethods.get,
      searchParams,
    };
    return await this.send(url, options);
  };

  /**
   * POST
   */
  post = async (url: string, payload: RestRequest): Promise<Response> => {
    const options: Options = {
      ...initialOptions,
      method: HttpMethods.post,
      json: payload.parameters,
    };

    const headers = {
      'Content-Type': MediaTypes.JSON,
    };

    return await this.send(url, options, headers);
  };

  /**
   * PUT
   */
  put = async (url: string, payload: RestRequest): Promise<Response> => {
    const options: Options = {
      ...initialOptions,
      method: HttpMethods.put,
      json: payload.parameters,
    };

    const headers = {
      'Content-Type': MediaTypes.JSON,
    };

    return await this.send(url, options, headers);
  };

  /**
   * PATCH
   */
  patch = async (
    url: string,
    searchParams?: Options['searchParams'],
    payload?: RestRequest,
  ): Promise<Response> => {
    const options: Options = {
      ...initialOptions,
      method: HttpMethods.patch,
      searchParams,
      json: payload?.parameters,
    };

    const headers = {
      'Content-Type': MediaTypes.JSON,
    };

    return await this.send(url, options, headers);
  };

  /**
   * DELETE
   */
  delete = async (
    url: string,
    searchParams?: Options['searchParams'],
  ): Promise<Response> => {
    const options: Options = {
      ...initialOptions,
      method: HttpMethods.delete,
      searchParams,
    };

    return await this.send(url, options);
  };

  /**
   * Download blob object
   */
  downloadAuto = async (
    url: string,
    payload: any,
    filename: string,
    searchParams?: Options['searchParams'],
  ) => {
    const options: Options = {
      ...initialOptions,
      method: HttpMethods.post,
      searchParams,
      json: payload,
      hooks: {
        beforeRequest: [
          (request) => {
            const margeHeaders =
              { ...this.authHeader(), ...this.envHeader() } ;
            Object.keys(margeHeaders).forEach((key) => {
              if (margeHeaders[key]) {
                request.headers.set(key, margeHeaders[key]);
              }
            });

            if (process.env.NODE_ENV === 'development') {
              console.log(request);
            }
          },
        ],
        afterResponse: [
          (_request, _options, response: Response) => {
            if (process.env.NODE_ENV === 'development') {
              console.log(response);
            }
          },
        ],
      },
      mode: process.env.NODE_ENV === 'development' ? 'cors' : undefined,
    };

    const response = await ky
      .post(this.correctionUrl(url, options), options)
      .blob();

    // ファイルが取得できなかった
    if (!response) {
      console.error('file not found.');
      return;
    }

    // ファイルを正常取得
    const { createObjectURL } = window.URL || window.webkitURL;
    const objectURL = createObjectURL(response);

    const element = document.createElement('a');
    element.href = objectURL;
    element.setAttribute('download', filename);
    element.click();

    const { revokeObjectURL } = window.URL || window.webkitURL;
    revokeObjectURL(objectURL);
  };

  /**
   * Download blob object for Manual
   *
   * @param url
   * @param payload
   * @param searchParams
   * @returns
   */
  downloadManual = async (
    url: string,
    searchParams?: Options['searchParams'],
  ) => {
    const options: Options = {
      ...initialOptions,
      method: HttpMethods.get,
      searchParams,
      hooks: {
        beforeRequest: [
          (request) => {
            const margeHeaders =
              { ...this.authHeader(), ...this.envHeader() } ;
            Object.keys(margeHeaders).forEach((key) => {
              if (margeHeaders[key]) {
                request.headers.set(key, margeHeaders[key]);
              }
            });

            if (process.env.NODE_ENV === 'development') {
              console.log(request);
            }
          },
        ],
        afterResponse: [
          (_request, _options, response: Response) => {
            if (process.env.NODE_ENV === 'development') {
              console.log(response);
            }
          },
        ],
      },
      mode: process.env.NODE_ENV === 'development' ? 'cors' : undefined,
    };

    const response = await ky.post(this.correctionUrl(url, options), options);

    // ファイルが取得できなかった
    if (!response || !response.ok) {
      console.error('data not found.');
      return;
    }
    return response.blob();
  };

  /**
   * postMultipart
   */
  postMultipart = async (
    url: string,
    formData: FormData,
    searchParams?: { [key: string]: any },
  ) => {
    const options: Options = {
      ...initialOptions,
      method: HttpMethods.post,
      searchParams,
      body: formData,
      timeout: 300000,
    };
    return await this.send(url, options);
  };

  /**
   * postForm
   */
  postForm = async (
    url: string,
    formData: URLSearchParams,
    searchParams?: { [key: string]: any },
  ) => {
    const options: Options = {
      ...initialOptions,
      method: HttpMethods.post,
      searchParams,
      body: formData,
    };
    return await this.send(url, options);
  };

  /**
   * Send request, return parse json to object
   */
  private send = async (
    url: string,
    options: Options,
    headers?: { [key: string]: string },
  ) => {
    const requestOptions: Options = {
      ...options,
      retry: {
        limit: 2,
        methods: [HttpMethods.get],
        statusCodes: [CL_ERROR_REQUEST_TIMEOUT, SV_ERROR_GATEWAY_TIMEOUT],
        backoffLimit: 3000,
      },
      hooks: {
        beforeRequest: [
          (request) => {
            const margeHeaders =
              { ...headers, ...this.authHeader(), ...this.envHeader() } ;
            Object.keys(margeHeaders).forEach((key) => {
              if (margeHeaders[key]) {
                request.headers.set(key, margeHeaders[key]);
              }
            });

            if (process.env.NODE_ENV === 'development') {
              console.log(request);
            }
          },
        ],
        afterResponse: [
          (request, options, response: Response) => {
            if (process.env.NODE_ENV === 'development') {
              console.log(response);
            }

            if (response.status === CL_ERROR_UNAUTHORIZED) {
              if (request.url.endsWith('/authenticate')) {
                // 認証エラー
                throw new AuthenticationError(response, request, options);
              } else {
                // トークン期限切れ
                throw new ExpiredAccessTokenError(response, request, options);
              }
            } else if (response.status === CL_ERROR_FORBIDDEN) {
              // 403:アクセス権限エラー
              throw new PermissionError(response, request, options);
            } else if (response.status === CL_ERROR_BAD_REQUEST) {
              // 400:業務エラー
              throw new BusinessError(response, request, options);
            } else if (response.status === CL_ERROR_PRECONDITION_FAILED) {
              // 412:楽観的排他エラー
              throw new OptimisticLockError(response, request, options);
            } else if (response.status === CL_ERROR_PAYLOAD_TOO_LARGE) {
              // 413:ボディサイズエラー
              throw new PayloadTooLargeError(response, request, options);
            } else if (response.status === SV_ERROR_INTERNAL_ERROR) {
              // 500:システムエラー
              throw new SystemError(response, request, options);
            } else if (response.status === SV_ERROR_BAD_GATEWAY) {
              // 502:サーバ通信接続エラー
              throw new BadGatewayError(response, request, options);
            } else if (response.status === SV_ERROR_SERVICE_UNAVAILABLE) {
              // 503:サービス利用不可
              throw new ServiceUnavailableError(response, request, options);
            } else if (response.status === SV_ERROR_GATEWAY_TIMEOUT) {
              // 504:サーバ通信接続タイムアウト
              throw new GatewayTimeoutError(response, request, options);
            }
          },
        ],
      },
      mode: process.env.NODE_ENV === 'development' ? 'cors' : undefined,
    };
    return await ky(this.correctionUrl(url, requestOptions), requestOptions);
  };

  private authHeader = (): { [key: string]: string } => {
    const token = localStorage.getItem(httpConstants.JWT_TOKEN_NAME) ?? '';
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  };

  private envHeader = (): { [key: string]: string } => {
    return {
      'Accept-Encoding': 'gzip',
      'Accept-Language': i18n.language,
      'X-Jikuu-Frontend-Version': packageInfo.version,
    };
  };

  private correctionUrl = (url: string, options: Options) => {
    if (options.prefixUrl || url.startsWith('http')) {
      return url;
    }

    if (!url.startsWith('/')) {
      return `/${url}`;
    }
    return url;
  };
}

export const http = new HttpClient();
