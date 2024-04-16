'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAIState, useUIState } from 'ai/rsc';

import { ChatList } from '~/components/chat-rsc/chat-list';
import { ChatPanel } from '~/components/chat-rsc/chat-panel';
import { EmptyScreen } from '~/components/shared/empty-screen';
import { ChatProvider } from '~/services/context/useChatProvider';
import { useScrollAnchor } from '~/services/hooks/useScrollAnchor';
import { useChatStore } from '~/services/store/useChatIdStore';

interface InternalChatProps {
  chatId: string;
}

function InternalChat({ chatId }: InternalChatProps) {
  const [messages] = useUIState();
  const [aiState] = useAIState();

  const router = useRouter();

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();

  useEffect(() => {
    useChatStore.getState().setChatId(chatId);
  }, [chatId]);

  useEffect(() => {
    const messagesLength = aiState.messages?.length;
    if (messagesLength === 2) {
      router.refresh();
    }
  }, [aiState.messages, router]);

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <div className="pb-[200px] pt-4" ref={messagesRef}>
        {messages.length ? (
          <ChatList messages={messages} isShared={false} />
        ) : (
          <EmptyScreen />
        )}
        <div className="h-px w-full" ref={visibilityRef} />
      </div>
      <ChatPanel isAtBottom={isAtBottom} scrollToBottom={scrollToBottom} />
    </div>
  );
}

type ChatProps = InternalChatProps;

export function Chat({ chatId }: ChatProps) {
  return (
    <ChatProvider>
      <InternalChat chatId={chatId} />
    </ChatProvider>
  );
}
