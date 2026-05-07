"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/useMobile";

export function Header() {
  const isMobile = useIsMobile();
  
  return (
    <header className="sticky z-1 top-0 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 md:px-2">
      {!isMobile && <SidebarTrigger />}
      <div className="flex flex-1 items-center justify-between">
        <span className="font-semibold uppercase tracking-wider text-muted-foreground">
          Shader Sandbox
        </span>
        {isMobile && <SidebarTrigger className="-mr-1" />}
      </div>
    </header>
  );
}
