import React from "react";

import {
  SidebarHeader as ShadcnSidebarHeader,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@template/ui/components/sidebar";

import { Icons } from "~/components/icons";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarNavMain } from "./SidebarNavMain";
import SidebarTeamSwitcher from "./SidebarTeamSwitcher";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: Icons.GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: Icons.AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Icons.Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: Icons.SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Icons.Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: Icons.BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Icons.Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Icons.Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: Icons.PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export default function DashboardSidebar() {
  return (
    <Sidebar collapsible="icon" className="bg-background">
      <ShadcnSidebarHeader>
        <SidebarLogo />
        <SidebarTeamSwitcher teams={data.teams} />
      </ShadcnSidebarHeader>
      <SidebarContent>
        <SidebarNavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
