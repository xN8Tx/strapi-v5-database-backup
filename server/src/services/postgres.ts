import type { Core } from '@strapi/strapi';

import { exec } from 'child_process';
import util from 'util';
import path from 'path';

import { DATABASE_NAME, FOLDER_NAME } from '../constants';

const databaseConfig = {
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
};

const postgres = ({ strapi }: { strapi: Core.Strapi }) => ({
  async backup(backupFolderName: string) {
    const pathToFile = path.join(backupFolderName, DATABASE_NAME);

    const command = `PGPASSWORD=${databaseConfig.password} pg_dump -Fc -h ${databaseConfig.host} -U ${databaseConfig.user} ${databaseConfig.database} > ${pathToFile}`;

    const promisifyExec = util.promisify(exec);

    try {
      const { stdout, stderr } = await promisifyExec(command);
      strapi.log.info(`Succesfully create new backup. Stdout: ${stdout}`);
      strapi.log.info(`Stderr: ${stderr}`);

      return pathToFile;
    } catch (error) {
      strapi.log.error(error);
      throw new Error('Error in creating postgres backup.');
    }
  },
  async restore(fileUrl: string) {
    const pathToFile = path.join(strapi.dirs.app.extensions, FOLDER_NAME, fileUrl, DATABASE_NAME);

    const command = `PGPASSWORD=${databaseConfig.password} pg_restore -h ${databaseConfig.host} -U ${databaseConfig.user} -d ${databaseConfig.database} --clean --no-owner ${pathToFile}`;

    const promisifyExec = util.promisify(exec);

    try {
      const { stdout, stderr } = await promisifyExec(command);
      strapi.log.info(`Succesfully restore backup. Stdout: ${stdout}`);
      strapi.log.info(`Stderr: ${stderr}`);

      return pathToFile;
    } catch (error) {
      strapi.log.error(error);
      throw new Error('Error in creating postgres backup.');
    }
  },
});

export default postgres;
