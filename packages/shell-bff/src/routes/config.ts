import type { FastifyInstance } from 'fastify';

type PlatformType = 'odh' | 'rhoai' | 'xks';

interface ShellConfig {
  platform: PlatformType;
  branding: {
    productName: string;
    logoAlt: string;
  };
  docs: {
    url: string;
    supportUrl: string;
  };
  features: {
    devMode: boolean;
  };
}

const PLATFORM_CONFIGS: Record<PlatformType, ShellConfig> = {
  odh: {
    platform: 'odh',
    branding: {
      productName: 'Open Data Hub',
      logoAlt: 'Open Data Hub Dashboard',
    },
    docs: {
      url: 'https://opendatahub.io/docs',
      supportUrl: 'https://github.com/opendatahub-io/odh-dashboard/issues',
    },
    features: { devMode: false },
  },
  rhoai: {
    platform: 'rhoai',
    branding: {
      productName: 'Red Hat OpenShift AI',
      logoAlt: 'Red Hat OpenShift AI Dashboard',
    },
    docs: {
      url: 'https://docs.redhat.com/en/documentation/red_hat_openshift_ai',
      supportUrl: 'https://access.redhat.com/support',
    },
    features: { devMode: false },
  },
  xks: {
    platform: 'xks',
    branding: {
      productName: 'XKS Dashboard',
      logoAlt: 'XKS AI Dashboard',
    },
    docs: {
      url: '',
      supportUrl: '',
    },
    features: { devMode: true },
  },
};

const activePlatform: PlatformType =
  (process.env.SHELL_PLATFORM as PlatformType) || 'xks';

export const configRoutes = async (fastify: FastifyInstance) => {
  // GET /api/config — return shell config for the active platform
  fastify.get('/', async (_request, reply) => {
    return reply.send(PLATFORM_CONFIGS[activePlatform]);
  });
};
