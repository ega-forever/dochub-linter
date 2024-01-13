import storeManager from 'dochub/src/backend/storage/manager.mjs';
import parser from 'dochub/src/global/manifest/parser.mjs';
import storageCacheRequest from './storageCacheRequest.js';
import express from 'express';
import path from 'path';
import fs from 'fs'

const app = express();

app.storage = null;

// Основной цикл приложения
const init = async () => {

  const manifestPath = path.join(process.cwd(), 'DocHub/public/s.architecture/_root.yaml')
  const metaPath = path.join(process.cwd(), 'DocHub/public/metamodel_samolet/metamodel/root.yaml')

  parser.cache.request = storageCacheRequest(parser.cache, manifestPath, metaPath);
  let storage = await storeManager.reloadManifest();

  console.log(storage.manifest.rules)
  fs.writeFileSync('ru.json', JSON.stringify(storage.manifest.rules));


  return
  await storeManager.applyManifest(app, storage);
  while (app.storage.problems.length !== Object.keys(storage.manifest.rules.validators).length) {
    await new Promise(res => setTimeout(res, 100));
  }

  console.log(app.storage.problems);
  fs.writeFileSync('pr.json', JSON.stringify(app.storage.problems));
};

init();
