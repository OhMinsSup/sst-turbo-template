import { useLocation, useNavigate } from '@remix-run/react';

import type {
  InvalidationFunction,
  MetaData,
} from '~/services/store/useLayoutStore';
import { navigation } from '~/constants/navigation';
import { useLayoutStore } from '~/services/store/useLayoutStore';
import { useMemoizedFn } from './useMemoizedFn';

interface HrefOptions<Quotation = Record<string, unknown>> {
  quotation?: Quotation;
  invalidateFunctions?: InvalidationFunction;
  intialValue?: MetaData;
  redirectUrl?: string;
  navigateOptions?: {
    scroll?: boolean;
  };
}

export function useNavigateThreanForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { popupOpen } = useLayoutStore();

  const handleHref = (opts?: HrefOptions) => {
    const meta: MetaData = {
      quotation: undefined,
      invalidateFunctions: undefined,
      intialValue: undefined,
      redirectUrl: location.pathname,
    };

    if (opts?.invalidateFunctions) {
      meta.invalidateFunctions = opts.invalidateFunctions;
    }
    if (opts?.intialValue) {
      meta.intialValue = opts.intialValue;
    }
    if (opts?.quotation) {
      meta.quotation = opts.quotation;
    }
    if (opts?.redirectUrl) {
      meta.redirectUrl = opts.redirectUrl;
    }

    popupOpen('THREAD', meta);

    navigate(navigation.threads.root, {
      unstable_viewTransition: true,
    });
  };

  return {
    handleHref: useMemoizedFn(handleHref),
  };
}
