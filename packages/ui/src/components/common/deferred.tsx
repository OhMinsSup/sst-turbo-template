import React from "react";

interface DeferredProps {
  timeout?: number;
  children: React.ReactNode;
}

function Deferred({ children, timeout = 300 }: DeferredProps) {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, timeout);

    return () => {
      clearTimeout(timer);
    };
  }, [timeout]);

  return <>{show ? children : null}</>;
}

export { Deferred };
