import { SidebarMenuSkeleton } from "@template/ui/components/sidebar";

export default function SidebarSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <SidebarMenuSkeleton key={index} />
      ))}
    </>
  );
}
