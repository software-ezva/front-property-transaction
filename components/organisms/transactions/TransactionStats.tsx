import { FileText, Calendar, User } from "lucide-react";
import { Transaction } from "@/types/transactions";

interface TransactionStatsProps {
  transactions: Transaction[];
}

export default function TransactionStats({
  transactions,
}: TransactionStatsProps) {
  const stats = [
    {
      title: "Total Transactions",
      value: transactions.length,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "In Progress",
      value: transactions.filter((t) =>
        [
          "preparation",
          "active",
          "under_contract",
          "pending",
          "review",
          "in_preparation",
        ].includes(t.status)
      ).length,
      icon: Calendar,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Sold/Leased",
      value: transactions.filter((t) =>
        ["sold", "leased", "completed", "sold_leased"].includes(t.status)
      ).length,
      icon: User,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-card rounded-lg p-4 border border-border text-center"
        >
          <div className={`flex items-center justify-center mb-2`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div className="text-2xl font-bold text-foreground">{stat.value}</div>
          <div className="text-sm text-muted-foreground">{stat.title}</div>
        </div>
      ))}
    </div>
  );
}
