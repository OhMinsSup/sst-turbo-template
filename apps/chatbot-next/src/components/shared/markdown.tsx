import type { Options } from 'react-markdown';
import React from 'react';
import ReactMarkdown from 'react-markdown';

function InternalMemoizedReactMarkdown(props: Options) {
  return <ReactMarkdown {...props} />;
}

export const MemoizedReactMarkdown = React.memo(
  InternalMemoizedReactMarkdown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className,
);
