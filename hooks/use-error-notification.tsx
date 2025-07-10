"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { toast } from "./use-toast";

interface ErrorNotificationContextType {
  showError: (error: string | Error, title?: string) => void;
}

const ErrorNotificationContext = createContext<
  ErrorNotificationContextType | undefined
>(undefined);

export function ErrorNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const showError = useCallback((error: string | Error, title = "Error") => {
    const message = error instanceof Error ? error.message : error;

    toast({
      title,
      description: message,
      variant: "destructive",
    });
  }, []);

  // Escuchar eventos de error globales
  useEffect(() => {
    const handleApiError = (event: CustomEvent) => {
      const { error, title } = event.detail;
      showError(error, title);
    };

    window.addEventListener("api-error", handleApiError as EventListener);

    return () => {
      window.removeEventListener("api-error", handleApiError as EventListener);
    };
  }, [showError]);

  return (
    <ErrorNotificationContext.Provider value={{ showError }}>
      {children}
    </ErrorNotificationContext.Provider>
  );
}

export function useErrorNotification() {
  const context = useContext(ErrorNotificationContext);
  if (!context) {
    throw new Error(
      "useErrorNotification must be used within an ErrorNotificationProvider"
    );
  }
  return context;
}
