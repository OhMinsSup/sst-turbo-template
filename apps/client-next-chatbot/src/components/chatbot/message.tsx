'use client';

import type { StreamableValue } from 'ai/rsc';
import { useStreamableValue } from 'ai/rsc';

import { MemoizedReactMarkdown } from '~/components/chatbot/markdown';

export function BotMessage({
  content,
}: {
  content: string | StreamableValue<string>;
}) {
  const [data, error] = useStreamableValue(content);

  // Currently, sometimes error occurs after finishing the stream.
  if (error) {
    return <div>Error</div>;
  }

  return (
    <MemoizedReactMarkdown className="prose-sm prose-neutral prose-a:text-accent-foreground/50">
      {data}
    </MemoizedReactMarkdown>
  );
}
