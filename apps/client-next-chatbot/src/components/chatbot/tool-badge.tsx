import React from 'react';

import { Badge } from '@template/ui/badge';

import { Icons } from '~/components/icons';

interface ToolBadgeProps {
  tool: string;
  children: React.ReactNode;
  className?: string;
}

export function ToolBadge({ tool, children, className }: ToolBadgeProps) {
  const icon: Record<string, React.ReactNode> = {
    search: <Icons.search size={14} />,
  };

  return (
    <Badge className={className} variant="secondary">
      {icon[tool]}
      <span className="ml-1">{children}</span>
    </Badge>
  );
}
