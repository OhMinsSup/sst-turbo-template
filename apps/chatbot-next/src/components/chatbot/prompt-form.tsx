import React, { useCallback, useEffect, useTransition } from 'react';
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
import { cn } from '@template/ui/utils';

import { EmptyScreen } from '~/components/chatbot/empty-screen';
import { UserMessage } from '~/components/chatbot/user-message';
import { Icons } from '~/components/icons';
import { type AIType, type UIState } from '~/services/agents/ai';
import { useChatContext } from '~/services/context/useChatProvider';
import { nanoid } from '~/utils';

const schema = z.object({
  input: z.string().min(1),
});

type FormFields = z.infer<typeof schema>;

export function PromptForm() {
  const { submit } = useActions<AIType>();
  const [, setMessages] = useUIState<AIType>();
  const [isPending, startTransition] = useTransition();
  const { changeAskScreenState } = useChatContext();

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

          changeAskScreenState({
            value: true,
          });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }

      const newMessage = {
        id: nanoid(),
        isGenerating: false,
        component: <UserMessage message={input.input} />,
      } as UIState;

      setMessages((old) => [...old, newMessage]);

      startTransition(() => {
        processFetch();
      });
    },
    [changeAskScreenState, setMessages, submit],
  );

  const watchInput = form.watch('input');

  const isEmptyInput = watchInput.length === 0;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-2xl px-6"
      >
        <div className="relative flex w-full items-center">
          <InputField />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2 transform"
            disabled={isEmptyInput || isPending}
          >
            {isPending ? (
              <Icons.spinner size={20} className="animate-spin" />
            ) : (
              <Icons.arrowRight size={20} />
            )}
          </Button>
        </div>
        <EmptyScreensField />
      </form>
    </Form>
  );
}

function InputField() {
  const { changeInput, changeScreenState } = useChatContext();
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
        const { onChange, onBlur, ...resetFields } = field;
        return (
          <FormItem>
            <FormControl>
              <Input
                type="text"
                placeholder="Ask a question..."
                className="bg-muted h-12 rounded-full pl-4 pr-10"
                onChange={(e) => {
                  onChange(e);

                  const nextInput = e.target.value;

                  startTransition(() => {
                    changeScreenState({
                      key: 'empty',
                      value: nextInput.length === 0,
                    });

                    changeInput({
                      input: nextInput,
                    });
                  });
                }}
                onBlur={() => {
                  onBlur();

                  startTransition(() => {
                    changeScreenState({
                      key: 'empty',
                      value: false,
                    });
                  });
                }}
                onFocus={() => {
                  startTransition(() => {
                    changeScreenState({
                      key: 'empty',
                      value: true,
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

function EmptyScreensField() {
  const { screen, changeInput } = useChatContext();
  const { setValue } = useFormContext<FormFields>();
  const [, startTransition] = useTransition();

  const onChangeEmptyScreenMessage = useCallback(
    (msg: string) => {
      setValue('input', msg, {
        shouldDirty: true,
        shouldValidate: true,
      });

      startTransition(() => {
        changeInput({
          input: msg,
        });
      });
    },
    [changeInput, setValue],
  );

  return (
    <EmptyScreen
      submitMessage={onChangeEmptyScreenMessage}
      className={cn(screen.empty ? 'visible' : 'invisible')}
    />
  );
}
