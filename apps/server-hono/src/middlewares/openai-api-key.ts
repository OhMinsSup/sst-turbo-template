import { type MiddlewareHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';

const API_KEY_NAME = 'X-OpenAI-API-Key';

type OpenAiApiKeyOptions = {
  ApiKeyName?: string;
};

export const openaiApiKey = (
  options: OpenAiApiKeyOptions = {},
): MiddlewareHandler<{
  Variables: {
    apiKey: string;
  };
}> => {
  if (!options.ApiKeyName) {
    options.ApiKeyName = API_KEY_NAME;
  }

  return async function openaiApiKey(c, next) {
    const headerToken = c.req.header(options.ApiKeyName);

    if (!headerToken) {
      // No Authorization header
      const res = new Response('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': `${options.ApiKeyName}`,
        },
      });
      throw new HTTPException(401, { res });
    }

    const regexp = new RegExp(/^sk-[a-zA-Z0-9]{32,}$/);
    const match = regexp.exec(headerToken);
    if (!match) {
      const res = new Response('Bad Request', {
        status: 400,
        headers: {
          'WWW-Authenticate': `${options.ApiKeyName} error="invalid_request"`,
        },
      });
      throw new HTTPException(400, { res });
    }

    c.set('apiKey', headerToken);

    await next();
  };
};
