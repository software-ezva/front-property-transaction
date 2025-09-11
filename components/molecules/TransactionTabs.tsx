interface TransactionTabsProps {
  activeTab: "overview" | "timeline" | "documents";
  onTabChange: (tabId: "overview" | "timeline" | "documents") => void;
}

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "timeline", label: "Timeline" },
  { id: "documents", label: "Documents" },
] as const;

export default function TransactionTabs({
  activeTab,
  onTabChange,
}: TransactionTabsProps) {
  return (
    <div className="border-b border-border">
      <nav className="flex space-x-8 px-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as any)}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
