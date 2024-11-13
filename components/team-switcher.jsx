'use client';

import * as React from 'react';

import Image from 'next/image';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export function TeamSwitcher({
  teams,
}) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  return (
    (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div
              className="flex justify-center items-center bg-slate-700 rounded-lg text-sidebar-primary-foreground aspect-square size-8"
            >
              <Image
                src="/images/logo-min.png"
                alt="TwinAIR Logo"
                width={17}
                height={17}
                className="object-contain"
              />
            </div>
            <div className="flex-1 grid text-left text-sm leading-tight">
              <span className="font-semibold truncate">
                {activeTeam.name}
              </span>
              <span className="text-xs truncate">{activeTeam.plan}</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  );
}
