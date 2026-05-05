import type { FastifyInstance } from 'fastify';

interface PluginManifestEntry {
  name: string;
  description: string;
  navItems: { label: string; path: string; group?: string }[];
  enabled: boolean;
}

const PLUGIN_MANIFEST: PluginManifestEntry[] = [
  {
    name: 'model-serving',
    description: 'Deploy, manage, and monitor model serving endpoints.',
    navItems: [
      { label: 'Model Catalog', path: '/ai-hub/model-catalog', group: 'AI Hub' },
      { label: 'Deployments', path: '/ai-hub/deployments', group: 'AI Hub' },
    ],
    enabled: true,
  },
  {
    name: 'gen-ai',
    description: 'Playground and generative AI tooling.',
    navItems: [
      { label: 'Playground', path: '/gen-ai/playground', group: 'Gen AI Studio' },
    ],
    enabled: true,
  },
  {
    name: 'maas',
    description: 'Model-as-a-Service endpoints and API key management.',
    navItems: [
      { label: 'AI Asset Endpoints', path: '/endpoints' },
      { label: 'API Keys', path: '/api-keys' },
    ],
    enabled: true,
  },
  {
    name: 'observability',
    description: 'Cluster, model, and MAAS monitoring dashboards.',
    navItems: [
      { label: 'Cluster', path: '/monitor/cluster', group: 'Monitor' },
      { label: 'Models', path: '/monitor/models', group: 'Monitor' },
      { label: 'MAAS', path: '/monitor/maas', group: 'Monitor' },
    ],
    enabled: true,
  },
  {
    name: 'admin',
    description: 'Subscription, policy, and user management.',
    navItems: [
      { label: 'Subscriptions', path: '/settings/subscriptions', group: 'Settings' },
      { label: 'Policies', path: '/settings/policies', group: 'Settings' },
      { label: 'User Management', path: '/settings/user-management', group: 'Settings' },
    ],
    enabled: true,
  },
];

export const pluginsRoutes = async (fastify: FastifyInstance) => {
  // GET /api/plugins — return the static plugin manifest
  fastify.get('/', async (_request, reply) => {
    const enabled = PLUGIN_MANIFEST.filter((p) => p.enabled);
    return reply.send(enabled);
  });
};
