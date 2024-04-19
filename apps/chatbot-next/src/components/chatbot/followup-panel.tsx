'use client';

import { useCallback, useEffect, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActions, useUIState } from 'ai/rsc';
import { useForm, useFormContext } from 'react-hook-form';
import { z } from 'zod';

import { createFormData } from '@template/react/form';
import { Button } from '@template/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@template/ui/form';
import { Input } from '@template/ui/input';

import { UserMessage } from '~/components/chatbot/user-message';
import { Icons } from '~/components/icons';
import { type AIType } from '~/services/agents/ai';
import { useChatContext } from '~/services/context/useChatProvider';
import { nanoid } from '~/utils';

const schema = z.object({
  input: z.string().min(1),
});

type FormFields = z.infer<typeof schema>;

export function FollowupPanel() {
  const { submit } = useActions<AIType>();
  const [, setMessages] = useUIState<AIType>();
  const [isPending, startTransition] = useTransition();
  const { changeInput } = useChatContext();

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      input: '',
    },
    shouldFocusError: true,
    reValidateMode: 'onBlur',
    criteriaMode: 'firstError',
  });

  const onSubmit = useCallback(
    (input: FormFields) => {
      async function processFetch() {
        try {
          const formData = createFormData(input);
          const result = await submit(formData);

          setMessages((old) => [...old, result]);

          changeInput({
            input: '',
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }

      const newMessage = {
        id: nanoid(),
        isGenerating: false,
        component: <UserMessage message={input.input} isFirstMessage={false} />,
      };

      setMessages((old) => [...old, newMessage]);

      startTransition(() => {
        processFetch();
      });
    },
    [changeInput, setMessages, submit],
  );

  const watchInput = form.watch('input');

  const isEmptyInput = watchInput.length === 0;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative flex items-center space-x-1"
      >
        <InputField />
        <Button
          type="submit"
          size="icon"
          disabled={isEmptyInput}
          variant="ghost"
          className="absolute right-1"
        >
          {isPending ? (
            <Icons.spinner size={20} className="animate-spin" />
          ) : (
            <Icons.arrowRight size={20} />
          )}
        </Button>
      </form>
    </Form>
  );
}

function InputField() {
  const { changeInput } = useChatContext();
  const { control, setFocus } = useFormContext<FormFields>();
  const [, startTransition] = useTransition();

  useEffect(() => {
    setFocus('input');
  }, [setFocus]);

  return (
    <FormField
      control={control}
      name="input"
      render={({ field }) => {
        const { onChange, ...resetFields } = field;
        return (
          <FormItem className="w-full">
            <FormControl>
              <Input
                type="text"
                placeholder="Ask a follow-up question..."
                className="h-12 pr-14"
                onChange={(e) => {
                  onChange(e);

                  startTransition(() => {
                    changeInput({
                      input: e.target.value,
                    });
                  });
                }}
                {...resetFields}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
