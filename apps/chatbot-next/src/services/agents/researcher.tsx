import type { ExperimentalMessage, ToolCallPart, ToolResultPart } from 'ai';
import { OpenAI } from '@ai-sdk/openai';
import { experimental_streamText } from 'ai';
import { type createStreamableUI, type createStreamableValue } from 'ai/rsc';

import { BotMessage } from '~/components/chatbot/message';
import { Section } from '~/components/chatbot/section';
import { env } from '~/env';
import { searchSchema } from '~/services/schema/search';

interface ResearcherParams {
  uiStream: ReturnType<typeof createStreamableUI>;
  textStream: ReturnType<typeof createStreamableValue<string>>;
  messages: ExperimentalMessage[];
}

export async function researcher({
  uiStream,
  messages,
  textStream,
}: ResearcherParams) {
  const openai = new OpenAI();

  const searchAPI: 'tavily' | 'exa' = 'tavily';

  let fullResponse = '';
  let hasError = false;
  const answerSection = (
    <Section title="Answer">
      <BotMessage content={textStream.value} />
    </Section>
  );

  const result = await experimental_streamText({
    model: openai.chat('gpt-3.5-turbo'),
    maxTokens: 2500,
    system: `As a professional search expert, you possess the ability to search for any information on the web. 
    For each user query, utilize the search results to their fullest potential to provide additional information and assistance in your response.
    If there are any images relevant to your answer, be sure to include them as well.
    Aim to directly address the user's question, augmenting your response with insights gleaned from the search results.
    Whenever quoting or referencing information from a specific URL, always cite the source URL explicitly.
    Please match the language of the response to the user's language.`,
    messages: messages as unknown as ExperimentalMessage[],
    tools: {
      search: {
        description: 'Search the web for information',
        parameters: searchSchema,
        execute: async ({}) => {},
      },
    },
  });

  const toolCalls: ToolCallPart[] = [];
  const toolResponses: ToolResultPart[] = [];
  for await (const delta of result.fullStream) {
    switch (delta.type) {
      case 'text-delta': {
        if (delta.textDelta) {
          if (fullResponse.length === 0 && delta.textDelta.length > 0) {
            // Update the UI
            uiStream.update(answerSection);
          }

          fullResponse += delta.textDelta;
          textStream.update(fullResponse);
        }
        break;
      }
      case 'tool-call':
        toolCalls.push(delta);
        break;
      case 'tool-result':
        toolResponses.push(delta);
        break;
      case 'error': {
        hasError = true;
        fullResponse += `\nError occurred while executing the tool`;
        break;
      }
      case 'finish': {
        break;
      }
    }
  }

  messages.push({
    role: 'assistant',
    content: [{ type: 'text', text: fullResponse }, ...toolCalls],
  });

  if (toolResponses.length > 0) {
    // Add tool responses to the messages
    messages.push({ role: 'tool', content: toolResponses });
  }

  return {
    result,
    fullResponse,
    hasError,
  };
}

async function tavilySearch(
  query: string,
  maxResults = 10,
  searchDepth: 'basic' | 'advanced' = 'basic',
): Promise<any> {
  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: env.TAVILY_API_KEY,
      query,
      max_results: maxResults < 5 ? 5 : maxResults,
      search_depth: searchDepth,
      include_images: true,
      include_answers: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status.toString()}`);
  }

  const data = await response.json();

  return data;
}
