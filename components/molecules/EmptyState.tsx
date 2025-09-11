import React from "react";
import { FileX, LucideIcon } from "lucide-react";
import Button from "@/components/atoms/Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const EmptyState = ({
  title = "No items found",
  description,
  icon: Icon = FileX,
  actionLabel,
  onAction,
  className = "",
  size = "md",
}: EmptyStateProps) => {
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
      <Icon className={`text-muted-foreground mx-auto mb-4 ${config.icon}`} />

      {/* Title */}
      <h3 className={`font-semibold text-foreground mb-2 ${config.title}`}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-muted-foreground mb-4">{description}</p>
      )}

      {/* Action button */}
      {onAction && actionLabel && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
};

export default EmptyState;
