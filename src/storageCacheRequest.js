import { fileURLToPath } from 'url';
import yaml from 'yaml';
import path from 'path';
import fs from 'fs';
import md5 from 'md5';
import logger from '../dochub/src/backend/utils/logger.mjs';
import request from './helperRequest.js';

const LOG_TAG = 'manifest-cache';

// eslint-disable-next-line
const docHubDepPackage = fileURLToPath(import.meta.resolve('../dochub/package.json'));
const docHubDepDir = path.dirname(docHubDepPackage);

export function loadFromAssets(filename) {
  const source = path.resolve(docHubDepDir, 'src/assets', filename);

  logger.log(`Import base metamodel from  [${source}].`, LOG_TAG);
  return fs.readFileSync(source, { encoding: 'utf8', flag: 'r' });
}

// Подключает базовую метамодель
function loadBaseMatamodel() {
  return yaml.parse(loadFromAssets('base.yaml'));
}

export default (context, manifestPath, metaPath, docPath) => {
  async function reqFunc(url, propPath) {
    let result = null;
    // Если это рутовый манифест, формируем его по конфигурации
    if ((url === 'file:///$root$') && (propPath === '/')) {
      // Подключаем базовую метамодель
      const content = loadBaseMatamodel();
      if (!content.imports) content.imports = [];

      content.imports.push(`file://${metaPath || path.join(docHubDepDir, 'public/metamodel/root.yaml')}`);

      if (docPath) {
        content.imports.push(`file://${docPath}`);
      }

      content.imports.push(`file://${manifestPath}`);

      logger.log(`Root manifest is [${content.imports.join('], [')}].`, LOG_TAG);
      result = {
        data: content
      };
    } else {
      try {
        result = await request(url);
      } catch (e) {
        this.registerError('net', md5(url), 'Request error', url, 'See details in error log of backed server', e.message);
        throw e;
      }
      logger.log(`Source [${url}] is imported.`, LOG_TAG);
    }
    return result;
  }
  return reqFunc.bind(context);
};
