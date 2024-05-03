import 'server-only';

import type { StreamableValue } from 'ai/rsc';
import { createAI } from 'ai/rsc';

import { submit } from '~/services/agents/action';

export interface AIState {
  role: 'user' | 'assistant' | 'system' | 'function' | 'tool';
  content: string;
  id?: string;
  name?: string;
  meta?: {
    name: string;
    props: Record<string, any>;
  };
}

const initialAIState: AIState[] = [];

export interface UIState {
  id: string;
  component: React.ReactNode;
  isGenerating: StreamableValue<boolean>;
}

const initialUIState: UIState[] = [];

const actions = {
  submit,
};

export type AIActions = typeof actions;

export const AI = createAI<AIState[], UIState[], AIActions>({
  actions,
  initialUIState,
  initialAIState,
});

export type AIType = typeof AI;
