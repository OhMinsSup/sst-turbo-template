import { Agent } from './agent';
import type { GetTestHandler, PostTestHandler } from './client/types';

export class AppAgent extends Agent {
  get app() {
    return this.api.app;
  }

  postTest: PostTestHandler = (body, opts) => {
    return this.api.app.test.postTest(body, opts);
  };

  getTest: GetTestHandler = (params, opts) => {
    return this.api.app.test.getTest(params, opts);
  };
}
