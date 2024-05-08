import { invariantResponse } from '~/services/misc';

interface Message<Result = unknown> {
  status: 'error' | 'success';
  result: Result | null;
  message: string | (() => string) | null;
}

function getBody(message: Message) {
  const body: Record<string, unknown> = {
    status: message.status,
    result: message.result,
    message:
      typeof message.message === 'function'
        ? message.message()
        : message.message,
  };

  return JSON.stringify(body);
}

export function badRequestResponse(
  message: Message,
  responseInit?: ResponseInit,
) {
  invariantResponse(false, getBody(message), {
    status: 400,
    ...responseInit,
  });
}

export function internalServerResponse(
  message: Message,
  responseInit?: ResponseInit,
) {
  invariantResponse(false, getBody(message), {
    status: 500,
    ...responseInit,
  });
}

export function unauthorizedResponse(
  condition: unknown,
  message: Message,
  responseInit?: ResponseInit,
) {
  invariantResponse(condition, getBody(message), {
    status: 401,
    ...responseInit,
  });
}

export function forbiddenResponse(
  message: Message,
  responseInit?: ResponseInit,
) {
  invariantResponse(false, getBody(message), {
    status: 403,
    ...responseInit,
  });
}
