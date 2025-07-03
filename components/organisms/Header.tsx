"use client";

import { useState } from "react";
import { Menu, Bell, User, LogOut } from "lucide-react";
import Button from "../atoms/Button";
import { ENTERPRISE } from "@/utils/enterprise";
import { ENDPOINTS } from "@/lib/constants";

interface HeaderProps {
  onToggleSidebar?: () => void;
  user?: {
    name: string;
    profile: string;
    avatar?: string;
  };
}

const Header = ({ onToggleSidebar, user }: HeaderProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div>
            <h1 className="text-xl font-bold text-foreground font-primary">
              {ENTERPRISE.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* <Button variant="ghost" size="sm">
            <Bell className="w-5 h-5" />
          </Button> */}

          {user && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user.profile}
                  </p>
                </div>
              </Button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg">
                  <div className="py-1">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-accent">
                      <User className="w-4 h-4 mr-2" />
                      ProfileMOCK
                    </button>
                    <a href={ENDPOINTS.auth0.LOGOUT}>
                      <button className="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-accent">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
