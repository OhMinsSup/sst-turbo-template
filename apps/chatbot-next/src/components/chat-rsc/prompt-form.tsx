'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { useActions, useUIState } from 'ai/rsc';
import { nanoid } from 'nanoid';
import Textarea from 'react-textarea-autosize';

import { getTargetElement } from '@template/react/dom';
import { Button } from '@template/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@template/ui/tooltip';
import { toast } from '@template/ui/use-toast';

import { Icons } from '~/components/icons';
import { UserMessage } from '~/components/shared/user-message';
import { type AIType } from '~/services/agents/ai';
import { useChatContext } from '~/services/context/useChatProvider';
import { useEnterSubmit } from '~/services/hooks/useEnterSubmit';

export function PromptForm() {
  const { input, changeInput } = useChatContext();
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { submit } = useActions<AIType>();
  const [_, setMessages] = useUIState<AIType>();

  useEffect(() => {
    const $ele = getTargetElement(inputRef);
    $ele?.focus();
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Blur focus on mobile
    if (window.innerWidth < 600) {
      // event.target.message?.blur();
    }

    const value = input.trim();
    changeInput({
      input: '',
    });

    if (!value) return;

    // Optimistically add user message UI
    setMessages((old) => [
      ...old,
      {
        id: nanoid(),
        display: <UserMessage>{value}</UserMessage>,
      },
    ]);

    try {
      // Submit and get response message
      const responseMessage = await submit(value);
      setMessages((old) => [...old, responseMessage]);
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

  const onChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      changeInput({
        input: e.target.value,
      });
    },
    [changeInput],
  );

  return (
    <form ref={formRef} onSubmit={onSubmit}>
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-zinc-100 px-12 sm:rounded-full sm:px-12">
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-[60px] w-full resize-none bg-transparent py-[1.3rem] pr-4 placeholder:text-zinc-900 focus-within:outline-none sm:text-sm"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={onChangeInput}
        />
        <div className="absolute right-4 top-[13px] sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={input === ''}
                className="rounded-full bg-transparent text-zinc-950 shadow-none hover:bg-zinc-200"
              >
                <Icons.send />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  );
}
