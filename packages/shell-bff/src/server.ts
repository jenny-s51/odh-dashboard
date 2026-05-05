import { fastify } from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { authRoutes } from './routes/auth';
import { configRoutes } from './routes/config';
import { pluginsRoutes } from './routes/plugins';

const PORT = 4001;
const DEV_ORIGIN = 'http://localhost:3000';

const app = fastify({
  logger: {
    level: 'info',
    ...(process.env.NODE_ENV === 'development'
      ? { transport: { target: 'pino-pretty', options: { colorize: true } } }
      : {}),
  },
});

const start = async () => {
  app.register(cors, { origin: DEV_ORIGIN, credentials: true });
  app.register(cookie);

  app.register(authRoutes, { prefix: '/api/auth' });
  app.register(configRoutes, { prefix: '/api/config' });
  app.register(pluginsRoutes, { prefix: '/api/plugins' });

  app.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    console.log(`Shell BFF running on http://localhost:${PORT}`);
  });
};

start();
