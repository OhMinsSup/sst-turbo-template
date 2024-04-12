import { Hono } from 'hono';

export const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.post('/api', (c) => {
  return c.json({ message: 'Hello Hono!' });
});
