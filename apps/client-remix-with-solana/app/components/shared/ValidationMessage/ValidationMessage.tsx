import { useEffect, useState } from 'react';

interface ValidationMessageProps {
  error: string | null;
  isSubmitting: boolean;
}

export default function ValidationMessage({
  error,
  isSubmitting,
}: ValidationMessageProps) {
  const [show, setShow] = useState(!!error);

  useEffect(() => {
    const id = setTimeout(() => {
      const hasError = !!error;
      setShow(hasError && !isSubmitting);
    });
    return () => clearTimeout(id);
  }, [error, isSubmitting]);

  return (
    <p
      className="px-1 text-red-600 transition-all duration-300 ease-in-out"
      style={{
        opacity: show ? 1 : 0,
      }}
    >
      {error}
    </p>
  );
}
