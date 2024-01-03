'use client';
import React from 'react';

export const useUpdate = () => {
  // eslint-disable-next-line react/hook-use-state
  const [, setState] = React.useState({});
  return React.useCallback(() => {
    setState({});
  }, []);
};
