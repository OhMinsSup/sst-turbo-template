import React from "react";

import type { Target } from "./useEventListener";
import { useEventListener } from "./useEventListener";

interface Options<T extends Target = Target> {
  target?: T;
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
}

interface UseHoverParams {
  mouseEnter?: (hover: boolean) => void;
  mouseLeave?: (hover: boolean) => void;
  options?: Options;
}

export function useHover({ options, mouseEnter, mouseLeave }: UseHoverParams) {
  const [hover, setHover] = React.useState(false);

  const onMouseEnter = () => {
    setHover(true);
    mouseEnter?.(true);
  };

  const onMouseLeave = () => {
    setHover(false);
    mouseLeave?.(false);
  };

  useEventListener("mouseenter", onMouseEnter, options);
  useEventListener("mouseleave", onMouseLeave, options);

  return {
    hover,
    onMouseEnter,
    onMouseLeave,
  };
}
