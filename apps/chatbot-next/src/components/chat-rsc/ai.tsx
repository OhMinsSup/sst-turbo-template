import 'server-only';

import { createAI } from 'ai/rsc';
import { nanoid } from 'nanoid';

import { submit } from '~/components/chat-rsc/action';

export interface Message {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool';
  content: string;
  id?: string;
  name?: string;
  display?: {
    name: string;
    props: Record<string, any>;
  };
}

export interface AIState {
  chatId: string;
  interactions?: string[];
  messages: Message[];
}

export type UIState = {
  id: string;
  display: React.ReactNode;
  spinner?: React.ReactNode;
  attachments?: React.ReactNode;
}[];

export const AI = createAI<AIState, UIState>({
  actions: {
    submit,
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), interactions: [], messages: [] },
});
