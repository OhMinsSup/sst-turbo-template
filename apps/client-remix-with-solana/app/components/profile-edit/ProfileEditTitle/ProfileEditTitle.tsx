import { useCallback } from 'react';
import { useNavigate } from '@remix-run/react';

import { Button } from '@template/ui/button';

import { Icons } from '~/components/icons';

export default function ProfileEditTitle() {
  const navigate = useNavigate();

  const onClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className="flex flex-row items-center">
      <Button variant="ghost" size="icon" onClick={onClick}>
        <Icons.chevronLeft className="size-6" />
      </Button>
      <h3 className="ml-2 font-semibold leading-none tracking-tight">
        프로필 편집
      </h3>
    </div>
  );
}
