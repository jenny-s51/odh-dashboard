import type { FastifyInstance } from 'fastify';

interface UserSession {
  username: string;
  email: string;
  groups: string[];
  isAdmin: boolean;
}

const MOCK_USERS: Record<string, UserSession> = {
  developer: {
    username: 'developer',
    email: 'developer@example.com',
    groups: ['system:authenticated'],
    isAdmin: false,
  },
  admin: {
    username: 'admin',
    email: 'admin@example.com',
    groups: ['system:authenticated', 'odh-admins'],
    isAdmin: true,
  },
};

export const authRoutes = async (fastify: FastifyInstance) => {
  // POST /api/auth/login — set a session cookie and return user info
  fastify.post<{ Body: { username: string } }>('/login', async (request, reply) => {
    const { username } = request.body ?? {};
    const user = MOCK_USERS[username];

    if (!user) {
      return reply.status(401).send({
        error: 'Unknown user',
        available: Object.keys(MOCK_USERS),
      });
    }

    reply.setCookie('shell-session', username, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
    });

    return reply.send(user);
  });

  // POST /api/auth/logout — clear the session cookie
  fastify.post('/logout', async (_request, reply) => {
    reply.clearCookie('shell-session', { path: '/' });
    return reply.send({ ok: true });
  });

  // GET /api/auth/session — return current user or 401
  fastify.get('/session', async (request, reply) => {
    const sessionUser = request.cookies['shell-session'];

    if (!sessionUser || !MOCK_USERS[sessionUser]) {
      return reply.status(401).send({ error: 'Not authenticated' });
    }

    return reply.send(MOCK_USERS[sessionUser]);
  });
};
