interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  details?: string;
  status?: number;
}

interface FetchOptions extends RequestInit {
  showError?: boolean; 
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
      const backendMessage =
        data.error || data.details || "Ha ocurrido un error";
      const error = new ApiError(backendMessage, response.status, data.details);

      if (showError) {
        window.dispatchEvent(
          new CustomEvent("api-error", {
            detail: { error, title: errorTitle, backendMessage },
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
