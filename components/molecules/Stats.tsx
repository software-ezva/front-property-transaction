import { LucideIcon } from "lucide-react";

interface StatItem {
  icon: LucideIcon;
  value: string | number;
  label: string;
  iconColor?: string;
}

interface StatsProps {
  stats: StatItem[];
  className?: string;
}

export default function Stats({ stats, className = "" }: StatsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-card rounded-lg p-4 border border-border text-center"
        >
          <stat.icon
            className={`w-6 h-6 mx-auto mb-2 ${
              stat.iconColor || "text-primary"
            }`}
          />
          <div className="text-2xl font-bold text-foreground">{stat.value}</div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
