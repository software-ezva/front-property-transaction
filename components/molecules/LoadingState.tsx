import React from "react";
import { LucideIcon } from "lucide-react";

interface LoadingStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const LoadingState = ({
  title = "Loading...",
  description,
  icon: Icon,
  className = "",
  size = "md",
}: LoadingStateProps) => {
  const sizeConfig = {
    sm: {
      spinner: "h-6 w-6",
      icon: "w-8 h-8",
      title: "text-base",
      padding: "p-6",
    },
    md: {
      spinner: "h-8 w-8",
      icon: "w-12 h-12",
      title: "text-lg",
      padding: "p-12",
    },
    lg: {
      spinner: "h-12 w-12",
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
      {/* Spinner */}
      <div
        className={`animate-spin rounded-full border-b-2 border-primary mx-auto mb-4 ${config.spinner}`}
      />

      {/* Icon (opcional) */}
      {Icon && (
        <Icon className={`text-muted-foreground mx-auto mb-4 ${config.icon}`} />
      )}

      {/* Title */}
      <h3 className={`font-semibold text-foreground mb-2 ${config.title}`}>
        {title}
      </h3>

      {/* Description (opcional) */}
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
};

export default LoadingState;
