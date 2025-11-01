"use client";

import { useState } from "react";
import { Copy, Check, LucideIcon } from "lucide-react";

interface MemberCardProps {
  fullName?: string;
  email?: string;
  badge?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  isEmpty?: boolean;
}

export function MemberCard({
  fullName,
  email,
  badge,
  icon: Icon,
  iconColor,
  iconBgColor,
  isEmpty = false,
}: MemberCardProps) {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopyEmail = async (emailToCopy: string) => {
    await navigator.clipboard.writeText(emailToCopy);
    setCopiedEmail(emailToCopy);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div
      className={`bg-card rounded-lg p-5 border transition-all ${
        isEmpty
          ? "border-dashed border-muted-foreground/30"
          : "border-border hover:border-tertiary/50 hover:shadow-lg"
      }`}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isEmpty ? "bg-muted/50" : iconBgColor
          }`}
        >
          <Icon
            className={`w-8 h-8 ${isEmpty ? "text-muted-foreground/50" : iconColor}`}
          />
        </div>
        <div className="w-full">
          {badge && (
            <p className={`text-xs font-medium mb-2 ${isEmpty ? "text-muted-foreground" : "text-tertiary"}`}>
              {badge}
            </p>
          )}
          {isEmpty ? (
            <p className="text-sm text-muted-foreground italic">Not assigned</p>
          ) : (
            <>
              <p className="font-semibold text-foreground text-base mb-1">
                {fullName}
              </p>
              {email && (
                <div className="flex items-center justify-center gap-2">
                  <p className="text-sm text-muted-foreground truncate">
                    {email}
                  </p>
                  <button
                    onClick={() => handleCopyEmail(email)}
                    className="flex-shrink-0 p-1 hover:bg-muted rounded transition-colors"
                    title="Copy email"
                  >
                    {copiedEmail === email ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
