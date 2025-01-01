import React from "react";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export function Section({ children, title }: SectionProps) {
  return (
    <section>
      <div className="relative">
        <div className="mb-8 overflow-hidden rounded-md border bg-muted/30 shadow-sm">
          <div className="border-default flex items-center border-b bg-muted/30 px-6 py-4">
            <h5 className="mb-0">{title}</h5>
          </div>
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </section>
  );
}
