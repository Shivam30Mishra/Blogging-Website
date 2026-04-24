"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function SidebarToggle({ children }: { children: React.ReactNode }) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowSidebar(!showSidebar)}
        variant="outline"
        className="flex w-full items-center gap-2 rounded-2xl border-slate-200 py-3 lg:hidden"
        type="button"
      >
        {showSidebar ? (
          <>
            <PanelLeftClose className="h-4 w-4" />
            Hide sidebar
          </>
        ) : (
          <>
            <PanelLeftOpen className="h-4 w-4" />
            Show sidebar
          </>
        )}
      </Button>
      {showSidebar && <div className="lg:hidden">{children}</div>}
    </>
  );
}
