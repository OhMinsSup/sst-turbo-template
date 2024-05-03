'use client';

import React from 'react';

import { Separator } from '@template/ui/separator';
import { cn } from '@template/ui/utils';

import { Icons } from '~/components/icons';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  separator?: boolean;
}

export function Section({
  children,
  className,
  size = 'md',
  title,
  separator = false,
}: SectionProps) {
  let icon: React.ReactNode;
  switch (title) {
    case 'Images':
      icon = <Icons.media size={18} className="mr-2" />;
      break;
    case 'Sources':
      icon = <Icons.newspaper size={18} className="mr-2" />;
      break;
    case 'Answer':
      icon = <Icons.bookCheck size={18} className="mr-2" />;
      break;
    case 'Related':
      icon = <Icons.repeat2 size={18} className="mr-2" />;
      break;
    case 'Follow-up':
      icon = <Icons.messageCircleMore size={18} className="mr-2" />;
      break;
    default:
      icon = <Icons.search size={18} className="mr-2" />;
  }

  return (
    <>
      {separator ? <Separator className="bg-primary/10 my-2" /> : null}
      <section
        className={cn(
          size === 'sm' ? 'py-1' : size === 'lg' ? 'py-4' : 'py-2',
          className,
        )}
      >
        {title ? (
          <h2 className="flex items-center py-2 text-lg leading-none">
            {icon}
            {title}
          </h2>
        ) : null}
        {children}
      </section>
    </>
  );
}
