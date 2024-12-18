import { useState, useTransition } from "react";
import { NavLink, useLocation, useNavigate } from "@remix-run/react";

import { buttonVariants } from "@template/ui/components/button";
import { ScrollArea } from "@template/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@template/ui/components/select";
import { cn } from "@template/ui/lib";

import { Icons } from "~/components/icons";
import { PAGE_ENDPOINTS } from "~/constants/constants";

const items = [
  {
    title: "내 계정",
    icon: <Icons.User />,
    href: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.SETTING,
  },
  {
    title: "내 설정",
    icon: <Icons.Settings />,
    href: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.SYSTEM,
  },
  {
    title: "내 알림",
    icon: <Icons.Bell />,
    href: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.NOTIFICATIONS,
  },
  {
    title: "내 연결",
    icon: <Icons.LayoutGrid />,
    href: PAGE_ENDPOINTS.PROTECTED.DASHBOARD.INTEGRATION,
  },
];

export default function SettingSidebarNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [_, startTransition] = useTransition();
  const [value, setValue] = useState<string>(
    location.pathname || PAGE_ENDPOINTS.PROTECTED.DASHBOARD.SETTING,
  );

  const onValueChange = (value: string) => {
    setValue(value);
    startTransition(() => {
      navigate(value, {
        viewTransition: true,
      });
    });
  };

  return (
    <>
      <div className="p-1 md:hidden">
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="h-12 sm:w-48">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.href} value={item.href}>
                <div className="flex gap-x-4 px-2 py-1">
                  <span className="scale-125">{item.icon}</span>
                  <span className="text-md">{item.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ScrollArea
        type="always"
        className="hidden w-full min-w-40 bg-background px-1 py-2 md:block"
      >
        <nav className="flex space-x-2 py-1 lg:flex-col lg:space-x-0 lg:space-y-1">
          {items.map((item) => (
            <NavLink
              key={`setting:nav:${item.href}`}
              to={item.href}
              viewTransition
              className={({ isActive }) =>
                cn(
                  buttonVariants({ variant: "ghost" }),
                  isActive
                    ? "bg-muted hover:bg-muted"
                    : "hover:bg-transparent hover:underline",
                  "justify-start",
                )
              }
            >
              <span className="mr-2">{item.icon}</span>
              {item.title}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
    </>
  );
}
