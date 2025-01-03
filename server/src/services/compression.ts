import type { Core } from '@strapi/strapi';

import { create, extract } from 'tar';
import fs from 'fs-extra';
import path from 'path';

import { DATABASE_NAME, FOLDER_NAME, UPLOAD_NAME, ZIP_NAME } from '../constants';

const compression = ({ strapi }: { strapi: Core.Strapi }) => ({
  async createCompressedFile(backupFolderName: string, fileName: string) {
    try {
      if (!(await fs.pathExists(backupFolderName))) {
        throw new Error(`Source directory does not exist: ${backupFolderName}`);
      }

      const file = path.join(strapi.dirs.app.extensions, FOLDER_NAME, fileName);
      await create(
        {
          file,
          gzip: true,
          cwd: backupFolderName,
        },
        [UPLOAD_NAME, DATABASE_NAME]
      );

      strapi.log.error(`Archive created: ${backupFolderName}`);
      return fileName;
    } catch (error) {
      strapi.log.error(`Error creating archive: ${backupFolderName}`);
    }
  },
  async restore(fileURL: string) {
    try {
      const file = path.join(strapi.dirs.app.extensions, FOLDER_NAME, `${fileURL}${ZIP_NAME}`);
      const cwd = path.join(strapi.dirs.app.extensions, FOLDER_NAME, fileURL);

      if (!(await fs.pathExists(file))) {
        throw new Error(`Source file does not exist: ${file}`);
      }

      await fs.mkdir(cwd);
      await extract({
        file,
        cwd,
      });

      strapi.log.info(`Archive restored: ${fileURL}`);
    } catch (error) {
      strapi.log.error(error);
    }
  },
});

export default compression;
