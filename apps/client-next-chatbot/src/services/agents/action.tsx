import { type ExperimentalMessage } from 'ai';
import {
  createStreamableUI,
  createStreamableValue,
  getMutableAIState,
} from 'ai/rsc';

import { FollowupPanel } from '~/components/chatbot/followup-panel';
import { Section } from '~/components/chatbot/section';
import { SpinnerMessage } from '~/components/chatbot/spinner-message';
import { type AIState, type AIType } from '~/services/agents/ai';
import { inquire } from '~/services/agents/inquire';
import { querySuggestor } from '~/services/agents/query-suggestor';
import { researcher } from '~/services/agents/researcher';
import { taskManager } from '~/services/agents/task-manager';
import { nanoid } from '~/utils';

async function submit(formData?: FormData, skip?: boolean) {
  'use server';

  const aiState = getMutableAIState<AIType>();
  const uiStream = createStreamableUI(<SpinnerMessage />);
  const isGenerating = createStreamableValue(true);

  const messages = aiState.get() as unknown as ExperimentalMessage[];
  // Limit the number of messages to 14
  messages.splice(0, Math.max(messages.length - 14, 0));

  let content: string | null = null;
  if (skip) {
    content = `{"action": "skip"}`;
  } else if (formData) {
    content = JSON.stringify(Object.fromEntries(formData));
  }

  // Add the user message to the state
  if (content) {
    const message = {
      id: nanoid(),
      role: 'user',
      content,
    } as unknown as ExperimentalMessage;
    messages.push(message);

    const nextAIState = [...aiState.get(), message] as unknown as AIState[];
    aiState.update(nextAIState);
  }

  async function processEvents() {
    uiStream.update(<SpinnerMessage />);

    let action: any = { object: { next: 'proceed' } };
    if (!skip) action = (await taskManager(messages)) ?? action;

    if (action.object.next === 'inquire') {
      // Generate inquiry
      const inquiry = await inquire(uiStream, messages);

      uiStream.done();
      isGenerating.done();

      const newMessage = {
        id: nanoid(),
        role: 'assistant',
        content: `inquiry: ${inquiry.question ?? ''}`,
      } as unknown as ExperimentalMessage;

      const nextAIState = [
        ...aiState.get(),
        newMessage,
      ] as unknown as AIState[];

      aiState.done(nextAIState);
      return;
    }

    let answer = '';
    let errorOccurred = false;
    const textStream = createStreamableValue<string>();
    while (answer.length === 0) {
      const { fullResponse, hasError } = await researcher({
        uiStream,
        textStream,
        messages,
      });
      answer = fullResponse;
      errorOccurred = hasError;
    }

    textStream.done();

    if (!errorOccurred) {
      // Generate related queries
      await querySuggestor(uiStream, messages);

      // Add follow-up panel
      uiStream.append(
        <Section title="Follow-up">
          <FollowupPanel />
        </Section>,
      );
    }

    isGenerating.done(false);
    uiStream.done();

    const newMessage = {
      id: nanoid(),
      role: 'assistant',
      content: answer,
    } as unknown as ExperimentalMessage;
    const nextAIState = [...aiState.get(), newMessage] as unknown as AIState[];
    aiState.done(nextAIState);
  }

  processEvents();

  return {
    id: nanoid(),
    isGenerating: isGenerating.value,
    component: uiStream.value,
  };
}

export { submit };
