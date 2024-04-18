import { useCallback, useEffect, useRef, useState } from 'react';
import { useAIState, useUIState } from 'ai/rsc';

import { Button } from '@template/ui/button';
import { cn } from '@template/ui/utils';

import { Icons } from '~/components/icons';
import { type AIType } from '~/services/agents/ai';
import { useChatContext } from '~/services/context/useChatProvider';
import { PromptForm } from './prompt-form';

export function ChatPanel() {
  const [messages, setMessages] = useUIState<AIType>();
  const [, setAiMessages] = useAIState<AIType>();
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { screen, changeAskScreenState } = useChatContext();

  // Focus on input when button is pressed
  useEffect(() => {
    if (isButtonPressed) {
      inputRef.current?.focus();
      setIsButtonPressed(false);
    }
  }, [isButtonPressed]);

  // Clear messages
  const onClear = useCallback(() => {
    setMessages([]);
    setAiMessages([]);
    changeAskScreenState({
      value: false,
    });
  }, [changeAskScreenState, setAiMessages, setMessages]);

  // If there are messages and the new button has not been pressed, display the new Button
  if (messages.length > 0 && screen.ask) {
    return (
      <div className="fixed bottom-2 left-0 right-0 mx-auto flex items-center justify-center md:bottom-8">
        <Button
          type="button"
          variant="secondary"
          className="bg-secondary/80 group rounded-full transition-all hover:scale-105"
          onClick={onClear}
        >
          <span className="mr-2 hidden text-sm duration-300 animate-in fade-in group-hover:block">
            New
          </span>
          <Icons.add
            size={18}
            className="transition-all group-hover:rotate-90"
          />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn({
        'fixed bottom-8 left-0 right-0 top-10 mx-auto flex h-screen flex-col items-center justify-center':
          messages.length === 0,
        'bottom-8-ml-6 fixed': messages.length > 0,
      })}
    >
      <PromptForm />
    </div>
  );
}
