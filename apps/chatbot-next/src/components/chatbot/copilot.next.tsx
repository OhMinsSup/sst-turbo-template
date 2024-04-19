'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActions, useStreamableValue, useUIState } from 'ai/rsc';
import { Form, useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';

import { isEmpty } from '@template/libs/assertion';
import { createFormData } from '@template/react/form';
import { Button } from '@template/ui/button';
import { Card } from '@template/ui/card';
import { Checkbox } from '@template/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@template/ui/form';
import { Input } from '@template/ui/input';
import { cn } from '@template/ui/utils';

import { Icons } from '~/components/icons';
import { type AIType } from '~/services/agents/ai';
import {
  CopilotProvider,
  useCopilotContext,
} from '~/services/context/useCopilotProvider';
import { type PartialInquirySchema } from '~/services/schema/inquiry';

export interface CopilotProps {
  inquiry?: PartialInquirySchema;
}

const schema = z.object({
  query: z.string().min(1),
  options: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
      checked: z.boolean(),
    }),
  ),
});

type FormFields = z.infer<typeof schema>;

export function Copilot({ inquiry }: CopilotProps) {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      query: '',
      options: [],
    },
    shouldFocusError: true,
    reValidateMode: 'onBlur',
    criteriaMode: 'firstError',
  });

  return (
    <Form {...form}>
      <CopilotProvider>
        <InternalCopilot inquiry={inquiry} />;
      </CopilotProvider>
    </Form>
  );
}

function InternalCopilot({ inquiry }: CopilotProps) {
  const { handleSubmit, getValues } = useFormContext<FormFields>();
  const { skipped, completed, changeCompleted, changeSkipped } =
    useCopilotContext();
  const [data, error, pending] =
    useStreamableValue<PartialInquirySchema>(inquiry);
  const [, setMessages] = useUIState<AIType>();
  const { submit } = useActions<AIType>();

  const processFormSubmit = async (input: FormFields, skip?: boolean) => {
    changeCompleted(true);
    changeSkipped(skip ?? false);

    const formData = skip ? undefined : createFormData(input);

    const result = await submit(formData, skip);
    setMessages((old) => [...old, result]);
  };

  const onSubmit = (input: FormFields) => {
    processFormSubmit(input);
  };

  const onSkip = () => {
    const input = getValues();
    processFormSubmit(input, true);
  };

  if (error) {
    return <CopilotError error={error} />;
  }

  if (skipped) {
    return null;
  }

  if (completed) {
    return <CopilotComplete />;
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
      <form onSubmit={handleSubmit(onSubmit)}>
        {data ? <OptionField data={data} /> : null}
        {data?.allowsInput ? <InputField data={data} /> : null}
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            disabled={pending}
          >
            <Icons.fastForward size={16} className="mr-1" />
            Skip
          </Button>
          <Button type="submit" disabled={pending}>
            <Icons.arrowRight size={16} className="mr-1" />
            Send
          </Button>
        </div>
      </form>
    </Card>
  );
}

interface OptionFieldProps {
  data: PartialInquirySchema;
}

function OptionField({ data }: OptionFieldProps) {
  const isMounted = useRef(false);
  const { control, watch, setValue } = useFormContext<FormFields>();

  const { fields } = useFieldArray({
    control,
    name: 'options',
  });

  const watchFieldArray = watch('options');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const options = data.options ?? [];

  useEffect(() => {
    if (!isEmpty(data.options) && !isMounted.current) {
      isMounted.current = true;
      const makeOptions = options.filter(Boolean).map((option) => ({
        ...option,
        checked: false,
      })) as FormFields['options'];
      setValue('options', makeOptions);
    }
  }, [data]);

  return (
    <div className="mb-4 flex flex-wrap justify-start">
      <FormField
        control={control}
        name="options"
        render={({ field }) => {
          return (
            <FormItem>
              {controlledFields.map((option) => {
                return (
                  <div
                    key={`option-${option.id}`}
                    className="mb-2 flex items-center space-x-1.5"
                  >
                    <FormControl>
                      <Checkbox
                        checked={option.checked}
                        onCheckedChange={(checked) => {
                          field.onChange(
                            field.value.map((value) => ({
                              ...value,
                              checked,
                            })),
                          );
                        }}
                      />
                    </FormControl>
                    <FormLabel className="whitespace-nowrap pr-4 text-sm">
                      {option.label}
                    </FormLabel>
                  </div>
                );
              })}
            </FormItem>
          );
        }}
      />
    </div>
  );
}

interface InputFieldProps {
  data: PartialInquirySchema;
}

function InputField({ data }: InputFieldProps) {
  const { control, setFocus } = useFormContext<FormFields>();

  useEffect(() => {
    setFocus('query');
  }, [setFocus]);

  return (
    <FormField
      control={control}
      name="query"
      render={({ field }) => {
        return (
          <FormItem className="mb-6 flex flex-col text-sm">
            <FormLabel className="text-muted-foreground">
              {data.inputLabel}
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                className="w-full"
                placeholder={data.inputPlaceholder}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
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

function CopilotComplete() {
  const { watch } = useFormContext<FormFields>();

  const options = watch('options');
  const query = watch('query');

  const updatedQuery = useCallback(() => {
    const selectedOptions = Object.entries(options)
      .filter(([, checked]) => checked)
      .map(([option]) => option);
    return [...selectedOptions, query].filter(Boolean).join(', ');
  }, [options, query]);

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
