import { Api, Function, StackContext } from 'sst/constructs';

export function ApiStack({ stack }: StackContext) {
  const backend = new Function(stack, 'backend', {
    handler: 'src/handler.handler',
    url: false,
  });

  const api = new Api(stack, 'api', {
    routes: {
      $default: backend,
    },
  });

  stack.addOutputs({
    URL: api.url,
  });
}
