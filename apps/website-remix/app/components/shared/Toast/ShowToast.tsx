import { useEffect, useRef } from "react";
import { toast as showToast } from "sonner";

import type { Toast } from "~/.server/utils/toast";

interface ShowToastProps {
  toast: Toast;
}

export default function ShowToast({ toast }: ShowToastProps) {
  const { id, type, title, description } = toast;
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    ref.current = setTimeout(() => {
      showToast[type](title, {
        id,
        description,
        onAutoClose: () => {
          if (ref.current) {
            clearTimeout(ref.current);
            ref.current = null;
          }
        },
      });
    }, 0);
  }, [description, id, title, type]);

  return null;
}
