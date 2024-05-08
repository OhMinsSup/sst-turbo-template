import { useCallback } from 'react';
import { Form, useBeforeUnload, useNavigation } from '@remix-run/react';
import { getFormProps, useForm, useInputControl } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { $generateHtmlFromNodes } from '@lexical/html';
import {
  type EditorState,
  type LexicalEditor as ReactLexicalEditor,
} from 'lexical';

import { ClientOnly } from '@template/react-components/client-only';
import { Avatar, AvatarFallback, AvatarImage } from '@template/ui/avatar';
import { Button } from '@template/ui/button';

import { LexicalEditor, LexicalEditorProps } from '~/components/editor';
import { Icons } from '~/components/icons';
import { ValidationMessage } from '~/components/shared/ValidationMessage';
import { useUser } from '~/libs/hooks/useUser';
import { schema } from '~/services/validate/write.validate';

interface ThreadsFormProps {
  onSuccess?: () => void;
  editable?: boolean;
  editorState?: LexicalEditorProps['editorState'];
}

export default function WriteForm({ editable, editorState }: ThreadsFormProps) {
  const user = useUser();

  const navigation = useNavigation();

  const isLoading = navigation.state === 'submitting';

  const [form, fields] = useForm({
    // Sync the result of last submission
    // lastResult: lastResult?.message,
    id: 'write-form',
    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    // Validate the form on blur event triggered
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onSubmit',
  });

  const textControl = useInputControl(fields.text);

  const onEditorUpdate = useCallback(
    (
      editorState: EditorState,
      editor: ReactLexicalEditor,
      onUpdate: (...event: any[]) => void,
    ) => {
      editor.update(() => {
        if (editorState.isEmpty()) {
          onUpdate('');
          return;
        }
        const htmlString = $generateHtmlFromNodes(editor, null);
        onUpdate(htmlString);
      });
    },
    [],
  );

  return (
    <>
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={undefined} alt="thumbnail" loading="lazy" />
          <AvatarFallback>T</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-none">{user.username}</p>
        </div>
        <div className="flex w-full justify-end">
          <Button
            form="write-form"
            type="submit"
            className="space-x-2"
            disabled={isLoading}
            aria-disabled={isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="size-4 animate-spin" />
            ) : null}
            <span>게시</span>
          </Button>
        </div>
      </div>

      <div className="my-4 grid gap-6">
        <Form method="post" {...getFormProps(form)}>
          <div className="grid gap-5">
            <div className="space-y-2">
              <ClientOnly fallback={<LexicalEditor.Skeleton />}>
                <LexicalEditor
                  editorState={editorState}
                  editable={editable}
                  onChange={(editorState, editor) => {
                    onEditorUpdate(editorState, editor, textControl.change);
                  }}
                  onBlur={(editorState, editor) => {
                    onEditorUpdate(editorState, editor, textControl.blur);
                  }}
                />
              </ClientOnly>
              {fields?.text.errors && (
                <ValidationMessage
                  error={fields.text.errors[0] ?? null}
                  isSubmitting={isLoading}
                />
              )}
            </div>
          </div>
        </Form>
      </div>
      {textControl.value && textControl.value.length > 0 ? (
        <WriteForm.BeforeUnload />
      ) : null}
    </>
  );
}

WriteForm.BeforeUnload = function Item() {
  useBeforeUnload(
    (evt) => {
      const returnValue =
        '화면을 벗어나면 작업이 취소됩니다. 화면을 벗어나시겠습니까?';

      evt.preventDefault();
      evt.returnValue = returnValue;

      return returnValue;
    },
    {
      capture: true,
    },
  );

  return null;
};
