import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { CustomButton } from '@template/ui/custom-button';
import { cn } from '@template/ui/utils';

import { PAGE_ENDPOINTS } from '~/constants/constants';

interface ErrorPageProps {
  className?: string;
  status: number;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  back?: () => void;
  home?: () => void;
}

export default function ErrorPage({
  className,
  status,
  title,
  description,
  footer,
  back,
  home,
}: ErrorPageProps) {
  const router = useRouter();

  const onBack = useCallback(() => {
    if (typeof back === 'function') {
      back();
      return;
    }

    router.back();
  }, [back, router]);

  const onHome = useCallback(() => {
    if (typeof home === 'function') {
      home();
      return;
    }

    router.push(PAGE_ENDPOINTS.ROOT);
  }, [home, router]);

  return (
    <div className={cn('h-svh w-full', className)}>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">{status}</h1>

        <span className="font-medium">{title}</span>
        <p className="text-muted-foreground text-center">{description}</p>
        <div className="mt-6 flex gap-4">
          {footer ? (
            <>{footer}</>
          ) : (
            <>
              <CustomButton variant="outline" onClick={onBack}>
                Go Back
              </CustomButton>
              <CustomButton onClick={onHome}>Back to Home</CustomButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
