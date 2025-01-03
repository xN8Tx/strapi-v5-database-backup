import type { Core } from '@strapi/strapi';
import { PLUGIN_NAME } from './constants';

const registerPermissionActions = async () => {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Access the Database backup',
      uid: 'read',
      pluginName: PLUGIN_NAME,
    },
    {
      section: 'plugins',
      displayName: 'Create backups',
      uid: 'backup',
      pluginName: PLUGIN_NAME,
    },
    {
      section: 'plugins',
      displayName: 'Restore database',
      uid: 'restore',
      pluginName: PLUGIN_NAME,
    },
  ];

  await strapi.service('admin::permission').actionProvider.registerMany(actions);
};

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  await registerPermissionActions();
  // bootstrap phase
  const jsonManager = strapi.plugin(PLUGIN_NAME).service('jsonManager');
  await jsonManager.generateJsonFile();
};

export default bootstrap;
