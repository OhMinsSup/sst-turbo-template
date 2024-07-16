import { onMount } from "svelte";

function cancelAnimationFrameIsNotDefined(
  t: any,
): t is ReturnType<typeof setInterval> {
  return typeof cancelAnimationFrame === typeof undefined;
}

const clearRafInterval = function (handle: Handle) {
  if (cancelAnimationFrameIsNotDefined(handle.id)) {
    return clearInterval(handle.id);
  }
  cancelAnimationFrame(handle.id);
};

const setRafInterval = function (callback: () => void, delay = 0): Handle {
  if (typeof requestAnimationFrame === typeof undefined) {
    return {
      id: setInterval(callback, delay),
    };
  }
  let start = Date.now();
  const handle: Handle = {
    id: 0,
  };
  const loop = () => {
    const current = Date.now();
    if (current - start >= delay) {
      callback();
      start = Date.now();
    }
    handle.id = requestAnimationFrame(loop);
  };
  handle.id = requestAnimationFrame(loop);
  return handle;
};

interface Handle {
  id: number | ReturnType<typeof setInterval>;
}

export const rafInterval = (
  fn: () => void,
  delay: number | undefined,
  options?: {
    immediate?: boolean;
  },
) => {
  const immediate = options?.immediate;
  let timer: Handle | undefined;

  const clear = () => {
    if (timer) {
      clearRafInterval(timer);
    }
  };

  onMount(() => {
    if (typeof delay !== "number" || delay < 0) {
      return;
    }

    if (immediate) {
      fn();
    }

    timer = setRafInterval(fn, delay);

    return () => clear();
  });
};
