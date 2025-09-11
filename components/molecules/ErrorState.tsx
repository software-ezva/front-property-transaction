import React from "react";
import { AlertTriangle, LucideIcon } from "lucide-react";
import Button from "@/components/atoms/Button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: string;
  icon?: LucideIcon;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const ErrorState = ({
  title = "Error",
  description,
  error,
  icon: Icon = AlertTriangle,
  onRetry,
  retryLabel = "Try Again",
  className = "",
  size = "md",
}: ErrorStateProps) => {
  const sizeConfig = {
    sm: {
      icon: "w-8 h-8",
      title: "text-base",
      padding: "p-6",
    },
    md: {
      icon: "w-12 h-12",
      title: "text-lg",
      padding: "p-12",
    },
    lg: {
      icon: "w-16 h-16",
      title: "text-xl",
      padding: "p-16",
    },
  };

  const config = sizeConfig[size];

  return (
    <div
      className={`bg-card rounded-lg border border-border ${config.padding} text-center ${className}`}
    >
      {/* Icon */}
      <Icon className={`text-red-500 mx-auto mb-4 ${config.icon}`} />

      {/* Title */}
      <h3 className={`font-semibold text-foreground mb-2 ${config.title}`}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-muted-foreground mb-4">{description}</p>
      )}

      {/* Error details */}
      {error && <p className="text-sm text-muted-foreground mb-4">{error}</p>}

      {/* Retry button */}
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
