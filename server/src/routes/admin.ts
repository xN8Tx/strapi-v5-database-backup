export const routes = {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/',
      handler: 'backups.findMany',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          {
            name: 'admin::hasPermissions',
            config: {
              actions: ['plugin::strapi-v5-database-backup.read'],
            },
          },
        ],
      },
    },
    {
      method: 'GET',
      path: '/:id',
      handler: 'backups.restore',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          {
            name: 'admin::hasPermissions',
            config: {
              actions: ['plugin::strapi-v5-database-backup.restore'],
            },
          },
        ],
      },
    },
    {
      method: 'POST',
      path: '/',
      handler: 'backups.create',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          {
            name: 'admin::hasPermissions',
            config: {
              actions: ['plugin::strapi-v5-database-backup.backup'],
            },
          },
        ],
      },
    },
    {
      method: 'DELETE',
      path: '/:id',
      handler: 'backups.delete',
      config: {
        policies: [
          'admin::isAuthenticatedAdmin',
          {
            name: 'admin::hasPermissions',
            config: {
              actions: ['plugin::strapi-v5-database-backup.backup'],
            },
          },
        ],
      },
    },
  ],
};
