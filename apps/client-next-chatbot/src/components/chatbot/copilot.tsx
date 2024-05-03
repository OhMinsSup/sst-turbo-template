'use client';

import React, { useEffect, useState } from 'react';
import { useActions, useStreamableValue, useUIState } from 'ai/rsc';

import { Button } from '@template/ui/button';
import { Card } from '@template/ui/card';
import { Checkbox } from '@template/ui/checkbox';
import { Input } from '@template/ui/input';
import { cn } from '@template/ui/utils';

import { Icons } from '~/components/icons';
import { type AIType } from '~/services/agents/ai';
import { type PartialInquirySchema } from '~/services/schema/inquiry';

export interface CopilotProps {
  inquiry?: PartialInquirySchema;
}

export function Copilot({ inquiry }: CopilotProps) {
  const [completed, setCompleted] = useState(false);
  const [query, setQuery] = useState('');
  const [skipped, setSkipped] = useState(false);
  const [data, error, pending] =
    useStreamableValue<PartialInquirySchema>(inquiry);
  const [checkedOptions, setCheckedOptions] = useState<Record<string, boolean>>(
    {},
  );

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [, setMessages] = useUIState<AIType>();
  const { submit } = useActions<AIType>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    checkIfButtonShouldBeEnabled();
  };

  const handleOptionChange = (selectedOption: string) => {
    const updatedCheckedOptions = {
      ...checkedOptions,
      [selectedOption]: !checkedOptions[selectedOption],
    };
    setCheckedOptions(updatedCheckedOptions);
    checkIfButtonShouldBeEnabled(updatedCheckedOptions);
  };

  const checkIfButtonShouldBeEnabled = (currentOptions = checkedOptions) => {
    const anyCheckboxChecked = Object.values(currentOptions).some(
      (checked) => checked,
    );
    setIsButtonDisabled(!(anyCheckboxChecked || query));
  };

  const updatedQuery = () => {
    const selectedOptions = Object.entries(checkedOptions)
      .filter(([, checked]) => checked)
      .map(([option]) => option);
    return [...selectedOptions, query].filter(Boolean).join(', ');
  };

  useEffect(() => {
    checkIfButtonShouldBeEnabled();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const onFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    skip?: boolean,
  ) => {
    e.preventDefault();
    setCompleted(true);
    setSkipped(skip ?? false);

    const formData = skip
      ? undefined
      : new FormData(e.target as HTMLFormElement);

    const result = await submit(formData, skip);
    setMessages((old) => [...old, result]);
  };

  const handleSkip = (e: React.MouseEvent<HTMLButtonElement>) => {
    onFormSubmit(e as unknown as React.FormEvent<HTMLFormElement>, true);
  };

  if (error) {
    return <CopilotError error={error} />;
  }

  if (skipped) {
    return null;
  }

  if (completed) {
    return (
      <Card className="flex w-full items-center justify-between p-3 md:p-4">
        <div className="flex min-w-0 flex-1 items-center space-x-2">
          <Icons.logo className="h-4 w-4 flex-shrink-0" />
          <h5 className="text-muted-foreground truncate text-xs">
            {updatedQuery()}
          </h5>
        </div>
        <Icons.check size={16} className="h-4 w-4 text-green-500" />
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full rounded-lg p-4">
      <div className="mb-4 flex items-center">
        <Icons.logo
          className={cn('h-4 w-4 flex-shrink-0', {
            'animate-spin': pending,
          })}
        />
        <p className="text-foreground text-semibold ml-2 text-lg">
          {data?.question}
        </p>
      </div>
      <form onSubmit={onFormSubmit}>
        <div className="mb-4 flex flex-wrap justify-start">
          {data?.options?.map((option, index) => (
            <div
              key={`option-${index.toString()}`}
              className="mb-2 flex items-center space-x-1.5"
            >
              <Checkbox
                id={option?.value}
                name={option?.value}
                onCheckedChange={() => {
                  if (option?.label) {
                    handleOptionChange(option.label);
                  }
                }}
              />
              <label
                className="whitespace-nowrap pr-4 text-sm"
                htmlFor={option?.value}
              >
                {option?.label}
              </label>
            </div>
          ))}
        </div>
        {data?.allowsInput ? (
          <div className="mb-6 flex flex-col space-y-2 text-sm">
            <label className="text-muted-foreground" htmlFor="query">
              {data.inputLabel}
            </label>
            <Input
              type="text"
              name="additional_query"
              className="w-full"
              id="query"
              placeholder={data.inputPlaceholder}
              value={query}
              onChange={handleInputChange}
            />
          </div>
        ) : null}
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            disabled={pending}
          >
            <Icons.fastForward size={16} className="mr-1" />
            Skip
          </Button>
          <Button type="submit" disabled={isButtonDisabled || pending}>
            <Icons.arrowRight size={16} className="mr-1" />
            Send
          </Button>
        </div>
      </form>
    </Card>
  );
}

interface CopilotErrorProps {
  error: unknown;
}

function CopilotError({ error }: CopilotErrorProps) {
  const text =
    typeof error === 'string'
      ? error
      : `An error occurred (${JSON.stringify(error)})`;

  return (
    <Card className="flex w-full items-center justify-between p-4">
      <div className="flex items-center space-x-2">
        <Icons.sparkles className="h-4 w-4" />
        <h5 className="text-muted-foreground truncate text-xs">
          {`error: ${text}`}
        </h5>
      </div>
    </Card>
  );
}
