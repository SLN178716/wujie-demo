import { InterceptorManager } from './interceptorManager';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface HttpRequestConfig<T = unknown> {
  url?: string;
  method?: HttpMethod;
  baseUrl?: string;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  data?: T;
  timeout?: number;
  signal?: AbortSignal;
}

interface HttpResponse<T = unknown> extends Response {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  config: HttpRequestConfig;
}

class HttpClient {
  private defaultConfig: HttpRequestConfig;
  readonly interceptors: {
    readonly request: InterceptorManager<HttpRequestConfig>;
    readonly response: InterceptorManager<HttpResponse>;
  };

  constructor(config?: HttpRequestConfig) {
    this.defaultConfig = config || {};
    this.interceptors = {
      request: new InterceptorManager<HttpRequestConfig>(),
      response: new InterceptorManager<HttpResponse>(),
    };
  }

  async request<T = unknown>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    let chain0 = Promise.resolve(this.mergeConfig(config));
    for (const itm of this.interceptors.request) {
      chain0 = chain0.then(itm.resolve, itm.reject || Promise.reject) as Promise<HttpRequestConfig>;
    }
    let chain1 = chain0.then(this.doRequest, Promise.reject);
    for (const itm of this.interceptors.response) {
      chain1 = chain1.then(itm.resolve, itm.reject || Promise.reject) as Promise<HttpResponse>;
    }
    return chain1 as Promise<HttpResponse<T>>;
  }

  private mergeConfig(config: HttpRequestConfig): HttpRequestConfig {
    return {
      ...this.defaultConfig,
      ...config,
      headers: {
        ...(this.defaultConfig.headers || {}),
        ...(config.headers || {}),
      },
    };
  }

  private async doRequest(config: HttpRequestConfig): Promise<HttpResponse> {
    return (await fetch(new URL(config.url!), config)) as HttpResponse;
  }
}

export default HttpClient;
export type { HttpRequestConfig, HttpResponse };
