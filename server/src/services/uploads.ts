import type { Core } from '@strapi/strapi';

import path from 'path';
import fs from 'fs-extra';

import { FOLDER_NAME, UPLOAD_NAME } from '../constants';

const uploads = ({ strapi }: { strapi: Core.Strapi }) => ({
  async backup(backupFolderName: string) {
    try {
      const pathToFolder = path.join(backupFolderName, UPLOAD_NAME);
      const pathToUploadFolder = path.join(strapi.dirs.static.public, 'uploads');

      await fs.copy(pathToUploadFolder, pathToFolder); // Copy all uploads to tmp folder
      return pathToFolder;
    } catch (error) {
      throw new Error('Error in creating uploads backup.');
    }
  },
  async restore(fileURL: string) {
    try {
      const pathToUploadFolder = path.join(strapi.dirs.static.public, 'uploads');
      const pathToFolder = path.join(strapi.dirs.app.extensions, FOLDER_NAME, fileURL, UPLOAD_NAME);

      if (!(await fs.pathExists(pathToUploadFolder))) {
        throw new Error(`Source directory does not exist: ${pathToUploadFolder}`);
      }

      await fs.remove(pathToUploadFolder);
      await fs.mkdir(pathToUploadFolder);
      await fs.copy(pathToFolder, pathToUploadFolder);
    } catch (error) {
      throw new Error('Error in restoring uploads backup.');
    }
  },
});

export default uploads;
