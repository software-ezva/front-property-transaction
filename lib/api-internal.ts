/**
 * Cliente para llamadas a API routes internas con manejo automático de errores
 */

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  details?: string;
  status?: number;
}

interface FetchOptions extends RequestInit {
  showError?: boolean; // Por defecto true
  errorTitle?: string;
}

export class ApiError extends Error {
  status: number;
  details?: string;

  constructor(message: string, status: number, details?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

/**
 * Función helper para hacer llamadas fetch con manejo automático de errores
 */
export async function apiFetch<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { showError = true, errorTitle = "Error", ...fetchOptions } = options;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      const error = new ApiError(
        data.error || "Ha ocurrido un error",
        response.status,
        data.details
      );

      // Si showError es true, el error se mostrará automáticamente
      // a través del ErrorBoundary o el hook useErrorNotification
      if (showError) {
        // Dispatch custom event para que el ErrorBoundary lo capture
        window.dispatchEvent(
          new CustomEvent("api-error", {
            detail: { error, title: errorTitle },
          })
        );
      }

      throw error;
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Error de red u otro tipo
    const networkError = new ApiError(
      "Error de conexión. Por favor, intenta nuevamente.",
      0,
      error instanceof Error ? error.message : "Unknown error"
    );

    if (showError) {
      window.dispatchEvent(
        new CustomEvent("api-error", {
          detail: { error: networkError, title: errorTitle },
        })
      );
    }

    throw networkError;
  }
}

/**
 * Helpers para métodos HTTP específicos
 */
export const apiClient = {
  get: <T = any>(url: string, options?: FetchOptions) =>
    apiFetch<T>(url, { ...options, method: "GET" }),

  post: <T = any>(url: string, data?: any, options?: FetchOptions) =>
    apiFetch<T>(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = any>(url: string, data?: any, options?: FetchOptions) =>
    apiFetch<T>(url, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = any>(url: string, data?: any, options?: FetchOptions) =>
    apiFetch<T>(url, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = any>(url: string, options?: FetchOptions) =>
    apiFetch<T>(url, { ...options, method: "DELETE" }),
};
