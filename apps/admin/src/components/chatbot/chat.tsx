import React from 'react';

import { cn } from '@template/ui/utils';

import ChatPanel from '~/components/chatbot/chat-panel';

export default function Chat() {
  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      // ref={scrollRef}
    >
      <div className={cn('pb-[200px] pt-4')}>
        {/* {messages.length ? (
        <ChatList messages={messages} isShared={false} session={session} />
      ) : (
        <EmptyScreen />
      )} */}
        {/* <div className="h-px w-full" ref={visibilityRef} /> */}
      </div>
      <ChatPanel />
      {/* <ChatPanel
      id={id}
      input={input}
      setInput={setInput}
      isAtBottom={isAtBottom}
      scrollToBottom={scrollToBottom}
    /> */}
    </div>
  );
}
