import 'server-only';

import { createAI } from 'ai/rsc';
import { nanoid } from 'nanoid';

import { submit } from '~/services/agents/action';

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

const initialAIState: AIState = {
  chatId: nanoid(),
  interactions: [],
  messages: [],
};

export type UIState = {
  id: string;
  display: React.ReactNode;
  spinner?: React.ReactNode;
}[];

const initialUIState: UIState = [];

const actions = {
  submit,
};

export type AIActions = typeof actions;

export const AI = createAI<AIState, UIState, AIActions>({
  actions,
  initialUIState,
  initialAIState,
});

export type AIType = typeof AI;
