import React from 'react';

import { AI } from '~/components/chat-rsc/ai';
import { Chat } from '~/components/chat-rsc/chat';
import { nanoid } from '~/utils';

export default function Page() {
  const chatId = nanoid();

  return (
    <AI initialAIState={{ chatId, interactions: [], messages: [] }}>
      <Chat chatId={chatId} />
    </AI>
  );
}
