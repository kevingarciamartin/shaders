"use client";

import { ChevronDown, VectorSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/useMobile";
import { shaderRegistry } from "@/lib/shaders";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  return (
    <Sidebar side={isMobile ? "right" : "left"} collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              size="lg"
              render={(buttonProps) => (
                <Link href="/" {...buttonProps}>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <VectorSquare className="size-4 text-background" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="font-semibold">Shader Sandbox</span>
                    <span className="text-xs">v0.1.0</span>
                  </div>
                </Link>
              )}
            />
            <SidebarTrigger className="ml-auto md:hidden" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {shaderRegistry.map((category) => (
              <Collapsible
                key={category.title}
                defaultOpen={true}
                className="group"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    render={(triggerProps) => (
                      <SidebarMenuButton
                        tooltip={category.title}
                        {...triggerProps}
                      >
                        {category.icon && <category.icon />}
                        <span>{category.title}</span>
                        <ChevronDown className="ml-auto" />
                      </SidebarMenuButton>
                    )}
                  />
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {category.shaders.map((shader) => (
                        <SidebarMenuSubItem key={shader.slug}>
                          <SidebarMenuSubButton
                            isActive={pathname === `/shaders/${shader.slug}`}
                            render={(linkProps) => (
                              <Link
                                href={`/shaders/${shader.slug}`}
                                {...linkProps}
                              >
                                <span>{shader.title}</span>
                              </Link>
                            )}
                          />
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
