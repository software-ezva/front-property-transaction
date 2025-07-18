import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  variant?: "primary" | "secondary" | "success" | "destructive";
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  variant = "primary",
  className,
}) => {
  const variantClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    success: "bg-success",
    destructive: "bg-destructive",
  };

  return (
    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
      <div
        className={cn(
          "h-full rounded-full transition-all duration-300",
          variantClasses[variant],
          className
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default ProgressBar;
