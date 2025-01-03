import type { Core } from '@strapi/strapi';
import type { Context } from 'koa';

import { PLUGIN_NAME } from '../constants';

const backups = ({ strapi }: { strapi: Core.Strapi }) => ({
  async delete(ctx: Context) {
    const { id } = ctx.params;

    if (!id) {
      return ctx.notFound('ID is empty');
    }

    const service = strapi.plugin(PLUGIN_NAME).service('connector');
    const json = await service.delete(id);

    ctx.body = { data: json.data };
  },
  async restore(ctx: Context) {
    const { id } = ctx.params;

    if (!id) {
      return ctx.notFound('ID is empty');
    }

    const service = strapi.plugin(PLUGIN_NAME).service('connector');
    const json = await service.restore(id);

    ctx.body = { data: json.data };

    // Nessesary to apply changes in database to Strapi
    strapi.log.info('Strapi shutdown in 5 seconds');
    setTimeout(() => {
      strapi.stop();
    }, 5000);
  },
  async create(ctx: Context) {
    const { body } = ctx.request;

    const service = strapi.plugin(PLUGIN_NAME).service('connector');
    const json = await service.backup(body);

    ctx.body = { data: json.data };
  },
  async findMany(ctx: Context) {
    const jsonServise = strapi.plugin(PLUGIN_NAME).service('jsonManager');
    const json = await jsonServise.getFromJson();

    ctx.body = { data: json.data };
  },
});

export default backups;

/*

    const { id } = ctx.params;

    if (!id) {
      return ctx.notFound('ID is empty');
    }

    const jsonServise = strapi.plugin(PLUGIN_NAME).service('connector');
    const json = await jsonServise.getFromJsonById(id);

    if (!json) {
      return ctx.notFound('JSON is emtpy');
    }

    const fileURL = json.fileURL;

    try {
      const dbClient = process.env.DATABASE_CLIENT;

      if (!dbClient) throw new Error(`Enviroment "DATABASE_CLIENT" is empty.`);
      const dbService = strapi.plugin(PLUGIN_NAME).service(dbClient);
      if (!dbService) {
        throw new Error(
          `Can not find service for your database, plugin "strapi-v5-database-backup" work only with sqlite and postgres!`
        );
      }

      await dbService.restore(fileURL);
    } catch (error) {
      ctx.internalServerError(error);
    }

    ctx.body = { data: 'Success restore Database' };

*/
