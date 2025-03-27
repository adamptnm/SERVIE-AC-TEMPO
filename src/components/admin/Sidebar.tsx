import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logoutAdmin } from "@/lib/api";
import {
  Home,
  ClipboardList,
  Users,
  History,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Loader2,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

const SidebarItem = ({
  icon,
  label,
  path,
  isActive,
  isCollapsed,
  onClick,
}: SidebarItemProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 px-3 py-2 mb-1",
        isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
        isCollapsed ? "justify-center px-2" : "",
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        {icon}
        {!isCollapsed && <span>{label}</span>}
      </div>
    </Button>
  );
};

interface SidebarProps {
  className?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Sidebar = ({
  className = "",
  activeTab = "overview",
  onTabChange = () => {},
}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const currentPath = location.pathname;

  const sidebarItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/admin/dashboard",
      id: "overview",
    },
    {
      icon: <ClipboardList size={20} />,
      label: "Service Requests",
      path: "/admin/dashboard",
      id: "requests",
    },
    {
      icon: <Users size={20} />,
      label: "Customer Info",
      path: "/admin/dashboard",
      id: "customers",
    },
    {
      icon: <History size={20} />,
      label: "Service History",
      path: "/admin/dashboard",
      id: "history",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      path: "/admin/dashboard",
      id: "settings",
    },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutAdmin();
      localStorage.removeItem("adminAuthenticated");
      navigate("/admin/login");
    } catch (error) {
      console.error("Error logging out:", error);
      // Fallback to local logout
      localStorage.removeItem("adminAuthenticated");
      navigate("/admin/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-background border-r border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-border">
        {!isCollapsed && <div className="font-bold text-lg">AC Home Admin</div>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex-1 py-4 px-2 overflow-y-auto">
        <nav className="space-y-1">
          {sidebarItems.map((item, index) => (
            <div key={index}>
              <SidebarItem
                icon={item.icon}
                label={item.label}
                path={item.path}
                isActive={item.id === activeTab}
                isCollapsed={isCollapsed}
                onClick={() => onTabChange(item.id)}
              />
            </div>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50",
            isCollapsed ? "justify-center px-2" : "",
          )}
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <LogOut size={20} />
          )}
          {!isCollapsed && (
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
