import { LucideIcon } from "lucide-react";

export interface StatItemData {
  icon?: LucideIcon;
  value: string | number;
  label: string;
  iconColor?: string;
}

interface StatItemProps extends StatItemData {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function StatItem({
  icon: Icon,
  value,
  label,
  iconColor = "text-primary",
  size = "md",
  className = "",
}: StatItemProps) {
  const sizeClasses = {
    sm: {
      container: "p-3",
      icon: "w-4 h-4 mb-1",
      value: "text-base font-semibold",
      label: "text-xs",
    },
    md: {
      container: "p-4",
      icon: "w-5 h-5 mb-1",
      value: "text-lg font-bold",
      label: "text-xs",
    },
    lg: {
      container: "p-4",
      icon: "w-6 h-6 mb-2",
      value: "text-2xl font-bold",
      label: "text-sm",
    },
  };

  const classes = sizeClasses[size];

  return (
    <div
      className={`bg-muted/30 rounded-lg ${classes.container} text-center ${className}`}
    >
      {Icon && <Icon className={`mx-auto ${classes.icon} ${iconColor}`} />}
      <div className={`text-foreground ${classes.value}`}>{value}</div>
      <div className={`text-muted-foreground ${classes.label}`}>{label}</div>
    </div>
  );
}
