import {
  createStreamableUI,
  createStreamableValue,
  getMutableAIState,
} from 'ai/rsc';
import { nanoid } from 'nanoid';

import { SpinnerMessage } from '~/components/shared/spinner-message';
import { type AIType, type Message } from '~/services/agents/ai';
import { airlines } from './airlines';

async function submit(content: string) {
  'use server';

  console.log('submit', content);

  const aiState = getMutableAIState<AIType>();
  const spinnerStream = createStreamableUI(<SpinnerMessage />);
  const uiStream = createStreamableUI(null);

  const oldState = aiState.get();

  const interactions = oldState.interactions ?? [];
  const messages = oldState.messages;

  console.log('oldState', oldState);
  console.log('messages', messages);

  const newMessage: Message = {
    id: nanoid(),
    role: 'user',
    content: `${interactions.join('\n\n')}\n\n${content}`,
  };

  console.log('newMessage', newMessage);

  messages.push(newMessage);

  aiState.update({
    ...oldState,
    messages,
  });

  async function processEvents() {
    //  Generate the answer
    let answer = '';
    const textStream = createStreamableValue<string>();
    try {
      const { fullResponse, hasError } = await airlines({
        aiState,
        uiStream,
        spinnerStream,
        textStream,
        messages,
      });

      answer = fullResponse;

      console.log('fullResponse', fullResponse, answer);

      if (hasError) {
        const error = new Error();
        error.name = 'AIError';
        error.message = 'Error occurred while executing the tool';
        throw error;
      }

      uiStream.done();
      textStream.done();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      uiStream.error(e);
      aiState.done(oldState);
    }
  }

  processEvents();

  return {
    id: nanoid(),
    spinner: spinnerStream.value,
    display: uiStream.value,
  };
}

export { submit };
