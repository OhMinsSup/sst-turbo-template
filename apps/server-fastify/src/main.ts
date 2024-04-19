import 'reflect-metadata';

import closeWithGrace from 'close-with-grace';

import app from './app';
import { envVars } from './env';

async function bootstrap() {
  // Delay is the number of milliseconds for the graceful close to finish
  const closeListeners = closeWithGrace({ delay: 500 }, async (opts: any) => {
    if (opts.err) {
      app.log.error(opts.err);
    }

    await app.close();
  });

  app.addHook('onClose', (_instance, done) => {
    closeListeners.uninstall();
    done();
  });

  void app.listen({ port: envVars.PORT, host: envVars.SERVER_HOSTNAME });

  void app.ready((err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }

    app.log.info(
      'All routes loaded! Check your console for the route details.',
    );

    app.log.info(`Server listening on port ${envVars.PORT}`);
  });
}

bootstrap();
