import { zValidator } from '@hono/zod-validator';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { prettyJSON } from 'hono/pretty-json';
import OpenAI from 'openai';
import { type ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';
import { z } from 'zod';

import { openaiApiKey } from './middlewares/openai-api-key';

type Bindings = {
  OPENAI_API_KEY: string | undefined;
};

const app = new Hono<{ Bindings: Bindings }>();

const schema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    }),
  ),
});

app.use(prettyJSON());

app.post(
  '/api/chat/openai/completions',
  openaiApiKey(),
  zValidator('json', schema),
  async (c) => {
    if (!c.var.apiKey) {
      throw new HTTPException(401, {
        message: 'API key is required',
      });
    }

    const { messages } = c.req.valid('json');

    const openai = new OpenAI({
      apiKey: c.var.apiKey,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages:
        messages as unknown as ChatCompletionCreateParamsBase['messages'],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  },
);

export default app;
