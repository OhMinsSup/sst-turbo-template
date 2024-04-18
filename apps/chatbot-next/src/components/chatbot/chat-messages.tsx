import { useUIState } from 'ai/rsc';

import { type AIType } from '~/services/agents/ai';

export function ChatMessages() {
  const [messages] = useUIState<AIType>();

  return (
    <>
      {messages.map((message) => (
        <div key={`message-${message.id}`}>{message.component}</div>
      ))}
    </>
  );
}
