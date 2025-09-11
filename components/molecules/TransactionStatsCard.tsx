import React from "react";
import { LucideIcon } from "lucide-react";

interface TransactionStatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description: string;
  color?: "primary" | "accent" | "secondary" | "destructive";
  className?: string;
}

const TransactionStatsCard = ({
  title,
  value,
  icon: Icon,
  description,
  color = "primary",
  className = "",
}: TransactionStatsCardProps) => {
  const colorConfig = {
    primary: "text-primary",
    accent: "text-accent",
    secondary: "text-secondary",
    destructive: "text-destructive",
  };

  return (
    <div
      className={`bg-card rounded-lg p-6 border border-border hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon className={`w-6 h-6 ${colorConfig[color]}`} />
        </div>
      </div>
    </div>
  );
};

export default TransactionStatsCard;
