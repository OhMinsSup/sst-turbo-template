'use client';

import React from 'react';
import { useActions, useAIState, useUIState } from 'ai/rsc';

import { toast } from '@template/ui/use-toast';
import { cn } from '@template/ui/utils';

import { UserMessage } from '~/components/chat-rsc/message';
import { PromptForm } from '~/components/chat-rsc/prompt-form';
import { ButtonScrollToBottom } from '~/components/shared/button-scroll-to-bottom';
import { FooterText } from '~/components/shared/footer';
import { nanoid } from '~/utils';

interface ExampleMessageType {
  id: string;
  heading: string;
  subheading: string;
  message: string;
}

interface ExampleMessageProps {
  example: ExampleMessageType;
  index: number;
}

function ExampleMessage({ example, index }: ExampleMessageProps) {
  const { submitUserMessage } = useActions();

  const [_, setMessages] = useUIState();

  const sendMessage = async () => {
    setMessages((old: ExampleMessageType[]) => [
      ...old,
      {
        id: nanoid(),
        display: <UserMessage>{example.message}</UserMessage>,
      },
    ]);

    try {
      const responseMessage = await submitUserMessage(example.message);
      setMessages((old: ExampleMessageType[]) => [...old, responseMessage]);
    } catch {
      toast(
        <div className="text-red-600">
          You have reached your message limit! Please try again later, or{' '}
          <a
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
            href="https://vercel.com/templates/next.js/gemini-ai-chatbot"
          >
            deploy your own version
          </a>
          .
        </div>,
      );
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        'cursor-pointer rounded-2xl bg-zinc-50 p-4 text-zinc-950 transition-colors hover:bg-zinc-100 sm:p-6',
        index > 1 && 'hidden md:block',
      )}
      onClick={void sendMessage}
      onKeyDown={void sendMessage}
    >
      <div className="font-medium">{example.heading}</div>
      <div className="text-sm text-zinc-800">{example.subheading}</div>
    </div>
  );
}

export interface ChatPanelProps {
  title?: string;
  isAtBottom: boolean;
  scrollToBottom: () => void;
}

export function ChatPanel({
  title,
  isAtBottom,
  scrollToBottom,
}: ChatPanelProps) {
  const [aiState] = useAIState();
  const [messages, setMessages] = useUIState();
  const { submitUserMessage } = useActions();

  const exampleMessages: ExampleMessageType[] = [
    {
      id: '1',
      heading: 'List flights flying from',
      subheading: 'San Francisco to Rome today',
      message: `List flights flying from San Francisco to Rome today`,
    },
    {
      id: '2',
      heading: 'What is the status',
      subheading: 'of flight BA142?',
      message: 'What is the status of flight BA142?',
    },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-white/90 duration-300 ease-in-out dark:from-10% peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid gap-2 px-4 sm:grid-cols-2 sm:gap-4 sm:px-0">
          {messages.length === 0 ? (
            <>
              {exampleMessages.map((example, index) => (
                <ExampleMessage
                  key={`example-${example.id}`}
                  example={example}
                  index={index}
                />
              ))}
            </>
          ) : null}
        </div>

        <div className="grid gap-4 sm:pb-4">
          <PromptForm />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  );
}
