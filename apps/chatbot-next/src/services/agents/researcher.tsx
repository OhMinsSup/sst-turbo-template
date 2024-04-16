import type { ExperimentalMessage } from 'ai';
import { OpenAI } from '@ai-sdk/openai';
import { experimental_streamText } from 'ai';
import { type createStreamableUI, type createStreamableValue } from 'ai/rsc';

import { type Message } from '~/services/agents/ai';

interface ResearcherParams {
  uiStream: ReturnType<typeof createStreamableUI>;
  spinnerStream: ReturnType<typeof createStreamableUI>;
  streamText: ReturnType<typeof createStreamableValue<string>>;
  messages: Message[];
}

export async function researcher({
  uiStream,
  spinnerStream,
  streamText,
  messages,
}: ResearcherParams) {
  const openai = new OpenAI();

  const searchAPI: 'tavily' | 'exa' = 'tavily';

  let fullResponse = '';
  let hasError = false;
  const answerSection = (
    <Section title="Answer">
      <BotMessage content={streamText.value} />
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
        execute: async ({
          query,
          max_results,
          search_depth,
        }: {
          query: string;
          max_results: number;
          search_depth: 'basic' | 'advanced';
        }) => {
          uiStream.update(
            <Section>
              <ToolBadge tool="search">{query}</ToolBadge>
            </Section>,
          );

          uiStream.append(
            <Section>
              <SearchSkeleton />
            </Section>,
          );

          // Tavily API requires a minimum of 5 characters in the query
          const filledQuery =
            query.length < 5 ? query + ' '.repeat(5 - query.length) : query;
          let searchResult;
          try {
            searchResult =
              searchAPI === 'tavily'
                ? await tavilySearch(filledQuery, max_results, search_depth)
                : await exaSearch(query);
          } catch (error) {
            console.error('Search API error:', error);
            hasError = true;
          }

          if (hasError) {
            fullResponse += `\nAn error occurred while searching for "${query}.`;
            uiStream.update(
              <Card className="mt-2 p-4 text-sm">
                {`An error occurred while searching for "${query}".`}
              </Card>,
            );
            return searchResult;
          }

          uiStream.update(
            <Section title="Images">
              <SearchResultsImageSection
                images={searchResult.images}
                query={searchResult.query}
              />
            </Section>,
          );
          uiStream.append(
            <Section title="Sources">
              <SearchResults results={searchResult.results} />
            </Section>,
          );

          uiStream.append(answerSection);

          return searchResult;
        },
      },
    },
  });

  return {
    fullResponse: '',
    hasError: false,
  };
}
