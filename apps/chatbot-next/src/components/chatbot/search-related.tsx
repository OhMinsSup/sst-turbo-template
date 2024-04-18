'use client';

import React from 'react';
import { useActions, useStreamableValue, useUIState } from 'ai/rsc';

import { Button } from '@template/ui/button';

import { UserMessage } from '~/components/chatbot/user-message';
import { Icons } from '~/components/icons';
import { type AIType } from '~/services/agents/ai';
import { type PartialRelatedSchema } from '~/services/schema/related';
import { nanoid } from '~/utils';

export interface SearchRelatedProps {
  relatedQueries: PartialRelatedSchema;
}

export function SearchRelated({ relatedQueries }: SearchRelatedProps) {
  const { submit } = useActions<AIType>();
  const [, setMessages] = useUIState<AIType>();
  const [data] = useStreamableValue<PartialRelatedSchema>(relatedQueries);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);

    // // Get the submitter of the form
    const submitter = (event.nativeEvent as SubmitEvent).submitter as
      | HTMLInputElement
      | undefined;

    let query = '';
    if (submitter) {
      formData.append(submitter.name, submitter.value);
      query = submitter.value;
    }

    const newMessage = {
      id: nanoid(),
      isGenerating: false,
      component: <UserMessage message={query} isFirstMessage={false} />,
    };

    const result = await submit(formData);
    setMessages((old) => [...old, newMessage, result]);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap">
      {data?.items
        ?.filter((item) => item?.query !== '')
        .map((item, index) => (
          <div
            className="flex w-full items-start"
            key={`search-related-${index.toString()}`}
          >
            <Icons.arrowRight className="text-accent-foreground/50 mr-2 mt-1 h-4 w-4 flex-shrink-0" />
            <Button
              variant="link"
              className="text-accent-foreground/50 h-fit flex-1 justify-start whitespace-normal px-0 py-1 text-left font-semibold"
              type="submit"
              name="related_query"
              value={item?.query}
            >
              {item?.query}
            </Button>
          </div>
        ))}
    </form>
  );
}

export default SearchRelated;
