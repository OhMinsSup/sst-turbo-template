import { useCallback } from 'react';
import { useNavigate } from '@remix-run/react';

import { Button } from '@template/ui/button';

import { Icons } from '~/components/icons';

export default function WritePageHeader() {
  const navigate = useNavigate();

  const onClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className="flex flex-row items-center space-x-4">
      <Button variant="ghost" size="icon" onClick={onClick}>
        <Icons.chevronLeft className="size-6" />
      </Button>
      <h3 className="font-semibold leading-none tracking-tight">
        새로운 스레드
      </h3>
    </div>
  );
}
