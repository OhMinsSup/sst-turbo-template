import { useRef } from 'react';

import { useMemoizedFn } from '@template/react-hooks/useMemoizedFn';

export function useEnterSubmit() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ): void => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      formRef.current?.requestSubmit();
      event.preventDefault();
    }
  };

  return { formRef, onKeyDown: useMemoizedFn(handleKeyDown) };
}
