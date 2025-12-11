import { getAccessToken } from "@auth0/nextjs-auth0";

export interface ApiError extends Error {
  status?: number;
  statusText?: string;
  data?: any;
}

interface RequestConfig extends RequestInit {
  timeout?: number;
}

class APIClient {
  private baseUrl: string;
  private defaultTimeout: number = 10000;
  private allowedEndpoints: RegExp = /^[\w\-\/\?\=\&]+$/; // Patrón para endpoints válidos

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";
  }

  private async getHeaders(isFormData = false): Promise<HeadersInit> {
    const headers: HeadersInit = {};

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    // Agregar cabeceras de seguridad básicas
    headers["X-Requested-With"] = "XMLHttpRequest";

    // Obtener token de Auth0 en el cliente
    let accessToken = await getAccessToken();
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    return headers;
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    console.log("FETCH URL:", url, "OPTIONS:", options);

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
    // Verificar cabeceras de seguridad en respuestas
    this.checkSecurityHeaders(response);

    if (!response.ok) {
      const error: ApiError = new Error(
        `HTTP ${response.status}: ${response.statusText}`
      );
      error.status = response.status;
      error.statusText = response.statusText;

      try {
        const errorData = await response.json();
        // Filtrar información sensible en errores
        const sanitizedErrorData = this.sanitizeErrorData(errorData);
        error.message = sanitizedErrorData.message || error.message;
        error.data = sanitizedErrorData;
      } catch {
        // Si no se puede parsear como JSON, usar mensaje por defecto
      }

      throw error;
    }

    // Manejar respuestas vacías
    if (response.status === 204) {
      return undefined as unknown as T;
    }

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
    options: RequestConfig = {}
  ): Promise<T> {
    // Validar el endpoint para prevenir inyecciones
    if (!this.allowedEndpoints.test(endpoint)) {
      throw new Error("Invalid endpoint format");
    }

    const { timeout = this.defaultTimeout, ...restOptions } = options;
    const isFormData = data instanceof FormData;
    const headers = await this.getHeaders(isFormData);

    let url = `${this.baseUrl}/${endpoint}`;
    console.log(`Making ${method} request to: ${url}`);

    const response = await this.fetchWithTimeout(
      url,
      {
        method,
        headers: {
          ...headers,
          ...restOptions.headers,
        },
        body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
        credentials: "same-origin", // Incluir cookies de autenticación
        ...restOptions,
      },
      timeout
    );

    return this.handleResponse<T>(response);
  }

  async get<T>(endpoint: string, options?: RequestConfig): Promise<T> {
    return this.makeRequest<T>("GET", endpoint, undefined, options);
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestConfig
  ): Promise<T> {
    return this.makeRequest<T>("POST", endpoint, data, options);
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestConfig
  ): Promise<T> {
    return this.makeRequest<T>("PUT", endpoint, data, options);
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestConfig
  ): Promise<T> {
    return this.makeRequest<T>("PATCH", endpoint, data, options);
  }

  async delete<T>(endpoint: string, options?: RequestConfig): Promise<T> {
    return this.makeRequest<T>("DELETE", endpoint, undefined, options);
  }

  // Métodos de seguridad adicionales
  private checkSecurityHeaders(response: Response): void {
    // Verificar cabeceras de seguridad importantes
    const headers = response.headers;

    // Advertir si faltan cabeceras de seguridad importantes
    if (process.env.NODE_ENV === "development") {
      if (!headers.get("X-Content-Type-Options")) {
        console.warn("Security header missing: X-Content-Type-Options");
      }
      if (!headers.get("X-Frame-Options")) {
        console.warn("Security header missing: X-Frame-Options");
      }
    }
  }

  private sanitizeErrorData(errorData: any): any {
    // Eliminar información potencialmente sensible de los errores
    if (errorData) {
      const safeData = { ...errorData };
      // Lista de campos que podrían contener información sensible
      const sensitiveFields = [
        "password",
        "token",
        "secret",
        "key",
        "auth",
        "credential",
      ];

      // Remover campos sensibles del objeto de error
      sensitiveFields.forEach((field) => {
        if (field in safeData) {
          delete safeData[field];
        }
      });

      return safeData;
    }
    return errorData;
  }
}

export const ApiClientSide = new APIClient();
