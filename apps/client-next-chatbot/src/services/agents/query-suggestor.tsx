import type { ExperimentalMessage } from 'ai';
import type { createStreamableUI } from 'ai/rsc';
import { OpenAI } from '@ai-sdk/openai';
import { experimental_streamObject } from 'ai';
import { createStreamableValue } from 'ai/rsc';

import type { PartialRelatedSchema } from '../schema/related';
import { SearchRelated } from '~/components/chatbot/search-related';
import { Section } from '~/components/chatbot/section';
import { relatedSchema } from '../schema/related';

export async function querySuggestor(
  uiStream: ReturnType<typeof createStreamableUI>,
  messages: ExperimentalMessage[],
) {
  const openai = new OpenAI();

  const objectStream = createStreamableValue<PartialRelatedSchema>();
  uiStream.append(
    <Section title="Related" separator>
      <SearchRelated relatedQueries={objectStream.value} />
    </Section>,
  );

  await experimental_streamObject({
    model: openai.chat('gpt-3.5-turbo'),
    system: `As a professional web researcher, your task is to generate a set of three queries that explore the subject matter more deeply, building upon the initial query and the information uncovered in its search results.

    For instance, if the original query was "Starship's third test flight key milestones", your output should follow this format:

    "{
      "related": [
        "What were the primary objectives achieved during Starship's third test flight?",
        "What factors contributed to the ultimate outcome of Starship's third test flight?",
        "How will the results of the third test flight influence SpaceX's future development plans for Starship?"
      ]
    }"

    Aim to create queries that progressively delve into more specific aspects, implications, or adjacent topics related to the initial query. The goal is to anticipate the user's potential information needs and guide them towards a more comprehensive understanding of the subject matter.
    Please match the language of the response to the user's language.`,
    messages,
    schema: relatedSchema,
  })
    .then(async (result) => {
      for await (const obj of result.partialObjectStream) {
        objectStream.update(obj);
      }
    })
    .finally(() => {
      objectStream.done();
    });
}
