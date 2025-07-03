// hooks/use-api-client-side.ts
import {useState, useEffect, useCallback, useRef} from "react";
import type { ApiError } from "../lib/api-client";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
) {
  const { immediate = true, onSuccess, onError } = options;

  // Usar useRef para manejar cancelaciones y prevenir actualizaciones después de desmontaje
  const isMounted = useRef(true);

  // Memorizar la función apiCall para evitar re-ejecuciones innecesarias
  const memoizedApiCall = useCallback(apiCall, []);

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const result = await memoizedApiCall();

      // Verificar si el componente sigue montado antes de actualizar el estado
      if (isMounted.current) {
        setState({
          data: result,
          loading: false,
          error: null,
        });

        onSuccess?.(result);
      }
      return result;
    } catch (error) {
      // Validar y sanitizar el error
      const apiError = error as ApiError;

      // Asegurar que no hay información sensible en el error
      if (apiError.data) {
        const sensitiveFields = ['password', 'token', 'secret', 'key'];
        sensitiveFields.forEach(field => {
          if (apiError.data && field in apiError.data) {
            delete apiError.data[field];
          }
        });
      }

      // Actualizar estado solo si el componente sigue montado
      if (isMounted.current) {
        setState({
          data: null,
          loading: false,
          error: apiError,
        });

        onError?.(apiError);
      }
      throw apiError;
    }
  }, [memoizedApiCall, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    // Establecer flag de montado
    isMounted.current = true;

    if (immediate) {
      execute();
    }

    // Limpieza al desmontar para evitar actualizaciones de estado en componentes desmontados
    return () => {
      isMounted.current = false;
    };
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset,
    refetch: execute,
  };
}

// Hook especializado para mutaciones (POST, PUT, DELETE)
export function useMutation<T, P = any>(
  mutationFn: (params: P) => Promise<T>,
  options: UseApiOptions = {}
) {
  // Usar useRef para manejar cancelaciones
  const isMounted = useRef(true);

  // Memorizar la función de mutación
  const memoizedMutationFn = useCallback(mutationFn, []);

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  // Limpiar al desmontar
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const mutate = useCallback(
    async (params: P) => {
      if (!isMounted.current) return;

      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // Validar parámetros de mutación para seguridad
        const validatedParams = params ? { ...params } : params;

        const result = await memoizedMutationFn(validatedParams);

        // Verificar si el componente sigue montado
        if (isMounted.current) {
          setState({
            data: result,
            loading: false,
            error: null,
          });

          options.onSuccess?.(result);
        }
        return result;
      } catch (error) {
        const apiError = error as ApiError;

        // Sanitizar datos de error
        if (apiError.data) {
          const sensitiveFields = ['password', 'token', 'secret', 'key'];
          sensitiveFields.forEach(field => {
            if (apiError.data && field in apiError.data) {
              delete apiError.data[field];
            }
          });
        }

        // Actualizar estado solo si el componente sigue montado
        if (isMounted.current) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: apiError,
          }));

          options.onError?.(apiError);
        }
        throw apiError;
      }
    },
    [memoizedMutationFn, options]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}
