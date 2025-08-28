import { useState } from "react";
import { ChevronDown, ChevronUp, LucideIcon } from "lucide-react";
import StatItem, { StatItemData } from "@/components/atoms/StatItem";

interface CollapsibleStatsCardProps {
  title: string;
  icon: LucideIcon;
  stats: StatItemData[];
  defaultOpen?: boolean;
  statsSize?: "sm" | "md" | "lg";
  className?: string;
}

export default function CollapsibleStatsCard({
  title,
  icon: Icon,
  stats,
  defaultOpen = false,
  statsSize = "md",
  className = "",
}: CollapsibleStatsCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`bg-card rounded-lg border border-border ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 px-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((stat, index) => (
              <StatItem key={index} {...stat} size={statsSize} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
