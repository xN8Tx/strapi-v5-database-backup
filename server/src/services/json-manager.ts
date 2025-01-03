import type { Core } from '@strapi/strapi';

import path from 'path';
import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';

import { FOLDER_NAME } from '../constants';

type JSONData = {
  id: string;
  title: string;
  fileURL: string;
  createdAt: string;
};

type JSONCreate = {
  title: string;
  fileURL: string;
};

const jsonManager = ({ strapi }: { strapi: Core.Strapi }) => ({
  getFullJSONPath() {
    return path.join(strapi.dirs.app.extensions, FOLDER_NAME, 'backup-meta.json');
  },
  // Service to writte new data in backup-meta.json
  async writeToJson(obj: {}) {
    try {
      const jsonPath = this.getFullJSONPath();
      await fs.writeJson(jsonPath, obj, { spaces: 2 });
    } catch (error) {
      strapi.log.error('Can not write data to JSON file');
      return null;
    }
  },
  async getFromJson(): Promise<Record<'data', JSONData[]>> {
    const jsonPath = this.getFullJSONPath();
    const json = await fs.readJSON(jsonPath);

    return json;
  },
  async getFromJsonById(id: string): Promise<JSONData> {
    const json = await this.getFromJson();
    return json.data.find((d) => d.id === id);
  },
  // Service for creating JSON file if it doesnt exist on bootstrap
  async generateJsonFile() {
    const jsonPath = this.getFullJSONPath();
    const isExist = await fs.exists(jsonPath);

    if (isExist) {
      return;
    }

    const startJson = {
      data: [],
    };

    await fs.ensureFile(jsonPath);
    await this.writeToJson(startJson);
  },
  // Service for adding new backup to file
  async addBackupsToJson(data: JSONCreate) {
    const oldJson = await this.getFromJson();
    const newData: JSONData = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    const newJson = { data: [...oldJson.data, newData] };
    await this.writeToJson(newJson);

    return newJson;
  },
  // Service for deleting new backup to file
  async removeBackupsFromJson(id: string) {
    const oldJson = await this.getFromJson();
    const newJson = { data: oldJson.data.filter((d) => d.id.toString() !== id.toString()) };
    await this.writeToJson(newJson);

    return { newJson, oldJson };
  },
});

export default jsonManager;
