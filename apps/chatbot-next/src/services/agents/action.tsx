import type { ExperimentalMessage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { experimental_streamText } from 'ai';
import {
  createStreamableUI,
  createStreamableValue,
  getMutableAIState,
} from 'ai/rsc';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import { SpinnerMessage } from '~/components/shared/spinner-message';
import { type AIType, type Message } from '~/services/agents/ai';
import { researcher } from './researcher';

async function submit(content: string) {
  'use server';

  const aiState = getMutableAIState<AIType>();
  const spinnerStream = createStreamableUI(<SpinnerMessage />);
  const messageStream = createStreamableUI(null);
  const uiStream = createStreamableUI();

  const oldState = aiState.get();

  const interactions = oldState.interactions ?? [];
  const messages = oldState.messages;

  const newMessage: Message = {
    id: nanoid(),
    role: 'user',
    content: `${interactions.join('\n\n')}\n\n${content}`,
  };

  messages.push(newMessage);

  aiState.update({
    ...oldState,
    messages,
  });

  async function processEvents() {
    //  Generate the answer
    let answer = '';
    let errorOccurred = false;
    const streamText = createStreamableValue<string>();
    while (answer.length === 0) {
      // Search the web and generate the answer
      const { fullResponse, hasError } = await researcher({
        uiStream,
        spinnerStream,
        streamText,
        messages,
      });
      answer = fullResponse;
      errorOccurred = hasError;
    }
    streamText.done();
  }

  processEvents();

  return {
    id: nanoid(),
    spinner: spinnerStream.value,
    display: messageStream.value,
  };
}

export { submit };
