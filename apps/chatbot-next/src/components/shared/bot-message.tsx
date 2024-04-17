'use client';

/* eslint-disable react/no-unstable-nested-components */
import type { StreamableValue } from 'ai/rsc';
import React from 'react';
import { useStreamableValue } from 'ai/rsc';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { MemoizedReactMarkdown } from './markdown';

interface BotMessageProps {
  streamableValue: string | StreamableValue<string>;
  className?: string;
}

export function BotMessage({ streamableValue }: BotMessageProps) {
  console.log(streamableValue);
  const [data, error, pending] = useStreamableValue<string>(streamableValue);

  console.log(data, error, pending);

  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="bg-background flex size-[25px] shrink-0 select-none items-center justify-center rounded-lg border shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="size-6" src="/images/gemini.png" alt="gemini logo" />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <div className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words">
          <MemoizedReactMarkdown
            className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words"
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>;
              },
            }}
          >
            {data}
          </MemoizedReactMarkdown>
        </div>
      </div>
    </div>
  );
}
