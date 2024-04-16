import React from 'react';

import { Chat } from '~/components/chat-rsc/chat';
import { AI } from '~/services/agents/ai';
import { nanoid } from '~/utils';

export default function Page() {
  const chatId = nanoid();

  return (
    <AI initialAIState={{ chatId, interactions: [], messages: [] }}>
      <Chat chatId={chatId} />
    </AI>
  );
}
