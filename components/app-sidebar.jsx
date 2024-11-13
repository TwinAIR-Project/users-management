'use client';

import * as React from 'react';

import {
  AudioWaveform, Bot, Command, GalleryVerticalEnd,
} from 'lucide-react';

import isEmpty from 'lodash/isEmpty';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { NavProjects } from '@/components/nav-projects';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'TwinAIR',
      logo: GalleryVerticalEnd,
      plan: 'HEurope Project',
    },
  ],
  navMain: [
    {
      title: 'Users',
      url: '#',
      icon: Bot,
    },
  ],
  projects: [],
};

export function AppSidebar({
  ...props
}) {
  return (
    (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          {!isEmpty(data.projects) && <NavProjects projects={data.projects} />}
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    )
  );
}
