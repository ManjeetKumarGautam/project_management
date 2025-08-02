import { cn } from "@/lib/utils";
import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import {
  CheckCircle2,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  ListCheck,
  LogOut,
  Settings,
  Users,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { SidebarNav } from "./sidebar-nav";

export const SidebarComponent = ({
  currentWorkspace,
}: {
  currentWorkspace: Workspace | null;
}) => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Workspaces",
      href: "/workspaces",
      icon: Users,
    },
    {
      title: "My Tasks",
      href: "/my-tasks",
      icon: ListCheck,
    },
    {
      title: "Members",
      href: `/members`,
      icon: Users,
    },
    {
      title: "Achieved",
      href: `/achieved`,
      icon: CheckCircle2,
    },
    {
      title: "Settings",
      href: "/setting",
      icon: Settings,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col border-r text-white transition-all duration-300 bg-[#001f3f] sticky top-0 h-screen",

        isCollapsed ? "w-20 md:w[100px]" : "w-20 md:w-[200px]"
      )}
    >
      <div className="flex  items-center border-b px-4 py-2 mb-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <img src='/favicon.ico' className="w-12" />
            <span className="font-semibold text-lg hidden md:block">
              UK PMS
            </span>
          </div>
        )}
        {isCollapsed && <img src='/favicon.ico' className="w-12 " />}


        <Button
          variant={"ghost"}
          size="icon"
          className="ml-auto hidden md:block"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronsRight className="size-4" />
          ) : (
            <ChevronsLeft className="size-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        <SidebarNav
          items={navItems}
          isCollapsed={isCollapsed}
          className={cn(isCollapsed && "items-center space-y-2")}
          currentWorkspace={currentWorkspace}
        />
      </ScrollArea>

      <div className="flex px-3 py-2">
        <Button
          variant={"ghost"}
          size={isCollapsed ? "icon" : "default"}
          className="justify-start text-center"
          onClick={logout}
        >
          <LogOut className={cn("size-4 ", isCollapsed && "mr-2")} />
          <span className={cn("hidden md:block", isCollapsed && "sr-only")} >Logout</span>
        </Button>
      </div>
    </div>
  );
};
