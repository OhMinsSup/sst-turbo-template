'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { useActions, useUIState } from 'ai/rsc';
import { nanoid } from 'nanoid';
import Textarea from 'react-textarea-autosize';

import { getTargetElement } from '@template/react/dom';
import { Button } from '@template/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@template/ui/tooltip';
import { toast } from '@template/ui/use-toast';

import { UserMessage } from '~/components/chat-rsc/message';
import { Icons } from '~/components/icons';
import { useChatContext } from '~/services/context/useChatProvider';
import { useEnterSubmit } from '~/services/hooks/useEnterSubmit';

export function PromptForm() {
  const { input, changeInput } = useChatContext();
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { submitUserMessage, describeImage } = useActions();
  const [_, setMessages] = useUIState();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const fileRef = React.useRef<HTMLInputElement>(null);

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
    setMessages((old: any[]) => [
      ...old,
      {
        id: nanoid(),
        display: <UserMessage>{value}</UserMessage>,
      },
    ]);

    try {
      // Submit and get response message
      const responseMessage = await submitUserMessage(value);
      setMessages((old: any[]) => [...old, responseMessage]);
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

  const onFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) {
        // toast.error('No file selected');
        return;
      }

      const file = event.target.files[0];

      if (file.type.startsWith('video/')) {
        const responseMessage = await describeImage('');
        setMessages((old: any[]) => [...old, responseMessage]);
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = async () => {
          const base64String = reader.result;
          const responseMessage = await describeImage(base64String);
          setMessages((old: any[]) => [...old, responseMessage]);
        };
      }
    },
    [describeImage, setMessages],
  );

  const onFileTrigger = useCallback(() => {
    const $ele = getTargetElement(fileRef);
    $ele?.click();
  }, []);

  const onChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      changeInput({
        input: e.target.value,
      });
    },
    [changeInput],
  );

  return (
    <form ref={formRef} onSubmit={void onSubmit}>
      <input
        type="file"
        className="hidden"
        id="file"
        ref={fileRef}
        onChange={void onFileChange}
      />
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-zinc-100 px-12 sm:rounded-full sm:px-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-background absolute left-4 top-[14px] size-8 rounded-full p-0 sm:left-4"
              onClick={onFileTrigger}
            >
              <Icons.add />
              <span className="sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add Attachments</TooltipContent>
        </Tooltip>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] placeholder:text-zinc-900 focus-within:outline-none sm:text-sm"
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