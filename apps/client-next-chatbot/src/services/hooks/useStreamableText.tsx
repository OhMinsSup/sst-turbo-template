import type { StreamableValue } from 'ai/rsc';
import { useCallback, useEffect, useState } from 'react';
import { readStreamableValue } from 'ai/rsc';

export const useStreamableText = (
  content: string | StreamableValue<string>,
) => {
  const [rawContent, setRawContent] = useState(
    typeof content === 'string' ? content : '',
  );

  const startStreamableValue = useCallback(
    async (text: string | StreamableValue<string>) => {
      if (typeof text === 'object') {
        let value = '';
        for await (const delta of readStreamableValue(text)) {
          if (typeof delta === 'string') {
            setRawContent((value = value + delta));
          }
        }
      }
    },
    [],
  );

  useEffect(() => {
    startStreamableValue(content);
  }, [content]);

  return rawContent;
};
