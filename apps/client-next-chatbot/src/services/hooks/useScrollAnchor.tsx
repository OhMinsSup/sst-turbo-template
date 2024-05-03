'use client';

import { useEffect, useRef, useState } from 'react';

import { useMemoizedFn } from '@template/react-hooks/useMemoizedFn';
import { getTargetElement } from '@template/react/dom';

export const useScrollAnchor = () => {
  const messagesRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const visibilityRef = useRef<HTMLDivElement>(null);

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const scrollToBottom = () => {
    const $ele = getTargetElement(messagesRef);

    $ele?.scrollIntoView({
      block: 'end',
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const $ele = getTargetElement(messagesRef);

    if (isAtBottom && !isVisible) {
      $ele?.scrollIntoView({
        block: 'end',
        behavior: 'smooth',
      });
    }
  }, [isAtBottom, isVisible]);

  useEffect(() => {
    const $ele = getTargetElement(scrollRef);

    const handleScroll = (event: Event) => {
      const target = event.target as HTMLDivElement;
      const offset = 25;
      setIsAtBottom(
        target.scrollTop + target.clientHeight >= target.scrollHeight - offset,
      );
    };

    $ele?.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      $ele?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const $ele = getTargetElement(visibilityRef);

    if ($ele) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
            } else {
              setIsVisible(false);
            }
          });
        },
        {
          rootMargin: '0px 0px -150px 0px',
        },
      );

      observer.observe($ele);

      return () => {
        observer.disconnect();
      };
    }
  });

  return {
    messagesRef,
    scrollRef,
    visibilityRef,
    scrollToBottom: useMemoizedFn(scrollToBottom) as unknown as () => void,
    isAtBottom,
    isVisible,
  };
};
