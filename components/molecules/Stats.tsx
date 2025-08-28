import StatItem, { StatItemData } from "@/components/atoms/StatItem";

interface StatsProps {
  stats: StatItemData[];
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Stats({
  stats,
  size = "lg",
  className = "",
}: StatsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg">
          <StatItem {...stat} size={size} />
        </div>
      ))}
    </div>
  );
}
