"use client";

import {
  Menu,
  Bell,
  Search,
  LogOut,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ENTERPRISE } from "@/utils/enterprise";
import { ENDPOINTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface HeaderProps {
  onToggleSidebar?: () => void;
  user?: {
    name: string;
    profile: string;
    avatar?: string;
  };
}

const Header = ({ onToggleSidebar, user }: HeaderProps) => {
  const pathname = usePathname();

  // Helper to generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`;
      const isLast = index === paths.length - 1;
      return {
        label: path.replace(/-/g, " "),
        href,
        isLast,
      };
    });
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        <div className="hidden md:flex flex-col items-start justify-center -space-y-1">
          <h1 className="text-lg font-semibold md:text-xl font-primary text-primary leading-none">
            {ENTERPRISE.name}
          </h1>
          <Breadcrumb className="hidden lg:flex">
            <BreadcrumbList className="sm:gap-1">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center">
                  {index > 0 && (
                    <BreadcrumbSeparator className="[&>svg]:size-2.5" />
                  )}
                  <BreadcrumbItem>
                    <span
                      className={`capitalize text-[10px] ${
                        crumb.isLast
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {crumb.label}
                    </span>
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-auto py-1.5 px-3 rounded-md border border-border flex items-center gap-3 hover:bg-accent"
              >
                <span className="text-sm font-medium">
                  {user.name.split(" ")[0]}
                </span>
                <Avatar className="h-8 w-8 border border-border rounded-md">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold rounded-md text-xs">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground capitalize">
                    {user.profile.replace(/_/g, " ")}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer w-full flex">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer w-full flex">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator /> */}
              <DropdownMenuItem
                asChild
                className="text-destructive focus:text-destructive"
              >
                <a
                  href={ENDPOINTS.auth0.LOGOUT}
                  className="cursor-pointer w-full flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
