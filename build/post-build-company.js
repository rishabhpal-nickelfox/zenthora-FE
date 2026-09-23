const path = require('path');
const fs = require('fs');
const util = require('util');
const { v4: uuid } = require('uuid');
const { getEpsCommonVersion } = require('./eps-common-version');

const readDir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile);

console.log('\nRunning post-build tasks');

const versionFilePath = path.join(__dirname, '../FE/company-portal/status.json');

readDir(path.join(__dirname, '../FE/company-portal/'))
  .then(() => {
    const uniqueId = uuid();
    const content = JSON.stringify({
      version: 'azure.build-branch.azure.build-number',
      eps_common_version: getEpsCommonVersion(),
      uuid: uniqueId,
      maintenance_start: null,
      maintenance_end: null,
      status_json_based_reload_enabled: true,
    }, null, 2);

    return writeFile(versionFilePath, content);
  })
  .then(() => {
    console.log('status.json created successfully.');
  })
  .catch((err) => {
    console.error('Error with post-build tasks:', err);
  });
