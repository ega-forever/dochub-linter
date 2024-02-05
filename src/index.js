#!/usr/bin/env node
import express from 'express';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import storeManager from '../dochub/src/backend/storage/manager.mjs';
import parser from '../dochub/src/global/manifest/parser.mjs';
import storageCacheRequest from './storageCacheRequest.js';
import docHubEvents from '../dochub/src/backend/helpers/events.mjs';
import { normalizePath } from './utils.js';

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const init = async () => {
  const configPath = path.join(process.cwd(), 'dh_lint.json');
  if (!fs.existsSync(configPath)) {
    console.log('lint config is not found. Creating one in current directory');
    const exampleConfigPath = path.join(__dirname, '../examples/dh_lint.json');
    fs.copyFileSync(exampleConfigPath, configPath);
    console.log('lint config has been created. Please modify it according to your project and run dh-lint again');
    return;
  }

  const config = JSON.parse(fs.readFileSync(configPath).toString());

  const app = express();
  app.storage = null;

  docHubEvents.onFoundLoadingError = () => {
    console.log('error loading files at the specified paths');
    process.exit(1);
  };

  const manifestPath = normalizePath(config.entries.manifest);
  const metaPath = normalizePath(config.entries.meta);
  const docPath = normalizePath(config.entries.doc);

  parser.cache.request = storageCacheRequest(
    parser.cache,
    manifestPath,
    metaPath,
    docPath
  );
  const storage = await storeManager.reloadManifest();

  await storeManager.applyManifest(app, storage);
  while (app.storage.problems.length !== Object.keys(storage.manifest.rules.validators).length) {
    await new Promise((res) => setTimeout(res, 100));
  }

  let hasErrors = false;

  for (const problem of app.storage.problems) {
    // eslint-disable-next-line
    const displayRuleLevel = config.rules.hasOwnProperty(problem.id) ? config.rules[problem.id] : 2;

    if (displayRuleLevel === 0 || !problem.items.length) {
      continue;
    }

    if (displayRuleLevel === 1) {
      console.log(chalk.yellow.bold(`rule[${problem.id}]: ${problem.title}`));
      console.log('');
    }
    if (displayRuleLevel === 2) {
      console.log(chalk.red.bold(`rule[${problem.id}]: ${problem.title}`));
      console.log('');
      hasErrors = true;
    }

    for (const item of problem.items) {
      if (displayRuleLevel === 1) {
        console.log(chalk.yellow(`warning [${item.location}]: ${item.correction}`));
        console.log('');
      }
      if (displayRuleLevel === 2) {
        console.log(chalk.red(`error [${item.location}]: ${item.correction}`));
        console.log('');
      }
    }
  }

  if (hasErrors) {
    process.exit(1);
  }
};

init().catch((e) => {
  console.error(e);
  process.exit(1);
});
