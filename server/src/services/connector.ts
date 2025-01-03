import type { Core } from '@strapi/strapi';

import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';
import path from 'path';

import { FOLDER_NAME, ZIP_NAME, PLUGIN_NAME } from '../constants';

type BodyType = {
  title: string;
};

const connector = ({ strapi }: { strapi: Core.Strapi }) => ({
  async backup(body: BodyType) {
    try {
      if (!body.title) {
        throw new Error('Title is empty');
      }

      const { title } = body;

      const dbClient = process.env.DATABASE_CLIENT;
      if (!dbClient) throw new Error(`Enviroment "DATABASE_CLIENT" is empty.`);

      const dbService = strapi.plugin(PLUGIN_NAME).service(dbClient);
      const uploadsService = strapi.plugin(PLUGIN_NAME).service('uploads');
      const compressionService = strapi.plugin(PLUGIN_NAME).service('compression');

      if (!dbService) {
        throw new Error(
          `Can not find service for your database, plugin "strapi-v5-database-backup" does not work with ${dbClient}!`
        );
      }

      // Operations to backup nesessary data
      const uuid = uuidv4();
      const folderPath = path.join(strapi.dirs.app.extensions, FOLDER_NAME, uuid);

      // TODO: Learn about pipelines try to optimize  this with pipelines
      await fs.mkdir(folderPath); // Create new temporary folder
      await dbService.backup(folderPath); // Create dump from database
      await uploadsService.backup(folderPath); // Create uploads backup
      await compressionService.createCompressedFile(folderPath, `${uuid}${ZIP_NAME}`); // Create archive
      await fs.remove(folderPath); // Delete temporary folder

      // Save information to json
      const newJSON = {
        title,
        fileURL: uuid,
      };

      const jsonServise = strapi.plugin(PLUGIN_NAME).service('jsonManager');
      const json = await jsonServise.addBackupsToJson(newJSON);

      return json;
    } catch (error) {
      strapi.log.error(error);
      throw new Error('Error in creating connector backup.');
    }
  },
  async restore(id: string) {
    try {
      const dbClient = process.env.DATABASE_CLIENT;
      if (!dbClient) throw new Error(`Enviroment "DATABASE_CLIENT" is empty.`);

      const dbService = strapi.plugin(PLUGIN_NAME).service(dbClient);
      const uploadsService = strapi.plugin(PLUGIN_NAME).service('uploads');
      const compressionService = strapi.plugin(PLUGIN_NAME).service('compression');

      if (!dbService) {
        throw new Error(
          `Can not find service for your database, plugin "strapi-v5-database-backup" does not work with ${dbClient}!`
        );
      }

      const jsonServise = strapi.plugin(PLUGIN_NAME).service('jsonManager');
      const json = await jsonServise.getFromJsonById(id);

      if (!json) {
        throw new Error('JSON is empty');
      }

      const fileURL = json.fileURL;

      await compressionService.restore(fileURL);
      await uploadsService.restore(fileURL);
      await dbService.restore(fileURL);
      await fs.remove(path.join(strapi.dirs.app.extensions, FOLDER_NAME, fileURL));

      const allJson = await jsonServise.getFromJson();
      return allJson;
    } catch (error) {
      strapi.log.error(error);
      throw new Error('Error in creating connector backup.');
    } finally {
    }
  },
  async delete(id: string) {
    const jsonServise = strapi.plugin(PLUGIN_NAME).service('jsonManager');
    const { newJson, oldJson } = await jsonServise.removeBackupsFromJson(id);

    const oldFile = oldJson.data.find((d) => d.id === id);
    if (oldFile) {
      const filePath = path.join(
        strapi.dirs.app.extensions,
        FOLDER_NAME,
        `${oldFile.fileURL}${ZIP_NAME}`
      );

      await fs.remove(filePath);
    }

    return newJson;
  },
});

export default connector;
