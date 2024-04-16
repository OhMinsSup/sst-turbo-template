import { type UIState } from '~/services/agents/ai';

export interface ChatListProps {
  messages: UIState;
  isShared: boolean;
}

export function ChatList({ messages }: ChatListProps) {
  return messages.length ? (
    <div className="relative mx-auto grid max-w-2xl auto-rows-max gap-8 px-4">
      {messages.map((message) => (
        <div key={`message-${message.id}`}>
          {message.spinner}
          {message.display}
        </div>
      ))}
    </div>
  ) : null;
}
