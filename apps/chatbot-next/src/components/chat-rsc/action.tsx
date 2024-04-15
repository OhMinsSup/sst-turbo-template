import {
  createStreamableUI,
  createStreamableValue,
  getMutableAIState,
} from 'ai/rsc';
import { nanoid } from 'nanoid';

import { type AI, type AIState } from '~/components/chat-rsc/ai';
import { SpinnerMessage } from '~/components/chat-rsc/message';

export async function submit(content: string) {
  'use server';

  const aiState = getMutableAIState<typeof AI>();

  const oldState = aiState.get() as unknown as AIState;

  const interactions = oldState.interactions ?? [];

  aiState.update({
    ...oldState,
    messages: [
      ...oldState.messages,
      {
        id: nanoid(),
        role: 'user',
        content: `${interactions.join('\n\n')}\n\n${content}`,
      },
    ],
  });

  const histories = oldState.messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));

  const textStream = createStreamableValue('');
  const spinnerStream = createStreamableUI(<SpinnerMessage />);
  const messageStream = createStreamableUI(null);
  const uiStream = createStreamableUI();

  async function processEvents() {
    try {
      uiStream.done();
      textStream.done();
      messageStream.done();
    } catch (e) {
      console.error(e);

      const error = new Error(
        'The AI got rate limited, please try again later.',
      );
      uiStream.error(error);
      textStream.error(error);
      messageStream.error(error);
      aiState.done(oldState);
    }
  }

  processEvents();

  return {
    id: nanoid(),
    attachments: uiStream.value,
    spinner: spinnerStream.value,
    display: messageStream.value,
  };
}
