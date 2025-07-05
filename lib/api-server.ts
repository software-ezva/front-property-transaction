import { auth0 } from "@/lib/auth0";

export interface ApiServerError extends Error {
  status?: number;
  statusText?: string;
  data?: any;
}

interface ServerRequestConfig extends RequestInit {
  timeout?: number;
}

class ApiServerClientClass {
  private baseUrl: string;
  private defaultTimeout: number = 10000;
  private allowedEndpoints: RegExp = /^[\w\-\/]+$/;

  constructor() {
    this.baseUrl =
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_BACKEND_API_URL ||
      "http://localhost:4000";
  }

  private async getHeaders(isFormData = false): Promise<HeadersInit> {
    const headers: HeadersInit = {};

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }
    headers["X-Requested-With"] = "XMLHttpRequest";
    let accessToken = await auth0.getAccessToken();
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken.token}`;
    }
    return headers;
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiServerError = new Error(
        `HTTP ${response.status}: ${response.statusText}`
      );
      error.status = response.status;
      error.statusText = response.statusText;
      try {
        error.data = await response.json();
        error.message = error.data?.message || error.message;
      } catch {}
      throw error;
    }
    if (response.status === 204) return undefined as unknown as T;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return response.text() as unknown as T;
  }

  private async makeRequest<T>(
    method: string,
    endpoint: string,
    data?: any,
    options: ServerRequestConfig = {}
  ): Promise<T> {
    if (!this.allowedEndpoints.test(endpoint)) {
      throw new Error("Invalid endpoint format");
    }
    const { timeout = this.defaultTimeout, ...restOptions } = options;
    const isFormData = data instanceof FormData;
    const headers = await this.getHeaders(isFormData);
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`[API] Request: ${method} ${url}`);
    const response = await this.fetchWithTimeout(
      url,
      {
        method,
        headers,
        body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
        ...restOptions,
      },
      timeout
    );
    return this.handleResponse<T>(response);
  }

  async get<T>(endpoint: string, options?: ServerRequestConfig): Promise<T> {
    return this.makeRequest<T>("GET", endpoint, undefined, options);
  }
  async post<T>(
    endpoint: string,
    data?: any,
    options?: ServerRequestConfig
  ): Promise<T> {
    return this.makeRequest<T>("POST", endpoint, data, options);
  }
  async put<T>(
    endpoint: string,
    data?: any,
    options?: ServerRequestConfig
  ): Promise<T> {
    return this.makeRequest<T>("PUT", endpoint, data, options);
  }
  async patch<T>(
    endpoint: string,
    data?: any,
    options?: ServerRequestConfig
  ): Promise<T> {
    return this.makeRequest<T>("PATCH", endpoint, data, options);
  }
  async delete<T>(endpoint: string, options?: ServerRequestConfig): Promise<T> {
    return this.makeRequest<T>("DELETE", endpoint, undefined, options);
  }
}

export const ApiServerClient = new ApiServerClientClass();
