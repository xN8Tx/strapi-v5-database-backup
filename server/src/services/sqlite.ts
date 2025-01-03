import type { Core } from '@strapi/strapi';

import { exec } from 'child_process';
import fs from 'fs-extra';
import util from 'util';
import path from 'path';

import { DATABASE_NAME, FOLDER_NAME } from '../constants';

const databaseConfig = {
  fileName: process.env.DATABASE_FILENAME,
};

const sqlite = ({ strapi }: { strapi: Core.Strapi }) => ({
  async backup(backupFolderName: string) {
    const pathToFile = path.join(backupFolderName, DATABASE_NAME);

    const command = `sqlite3 ${path.join(path.dirname(strapi.dirs.app.src), databaseConfig.fileName)}  .dump > ${pathToFile}`;
    const promisifyExec = util.promisify(exec);
    console.log('Command in sqlite:', command);

    try {
      const { stdout, stderr } = await promisifyExec(command);
      strapi.log.info(`Succesfully create new backup: ${DATABASE_NAME}. Stdout: ${stdout}`);
      strapi.log.info(`Stderr: ${stderr}`);

      return pathToFile;
    } catch (error) {
      throw new Error('Error in creating sqlite backup.');
    }
  },
  async restore(fileName: string) {
    const file = path.join(strapi.dirs.app.extensions, FOLDER_NAME, fileName, DATABASE_NAME);

    const command = `sqlite3 ${path.join(path.dirname(strapi.dirs.app.src), databaseConfig.fileName)} < ${file}`;
    const promisifyExec = util.promisify(exec);
    console.log('Command in sqlite:', command);

    await fs.remove(path.join(path.dirname(strapi.dirs.app.src), databaseConfig.fileName));
    await fs.ensureFile(path.join(path.dirname(strapi.dirs.app.src), databaseConfig.fileName));

    try {
      const { stdout, stderr } = await promisifyExec(command);
      strapi.log.info(`Succesfully restore database. Stdout: ${stdout}`);
      strapi.log.info(`Stderr: ${stderr}`);
    } catch (error) {
      throw new Error('Error in restore sqlite backup.');
    }
  },
});

export default sqlite;
