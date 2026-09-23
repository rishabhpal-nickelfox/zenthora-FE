const path = require('path');

function getEpsCommonVersion() {
  try {
    const spec = require(path.join(__dirname, '../package.json')).dependencies['@eps/common'];
    const match = /eps-common-(.+)\.tgz$/.exec(spec || '');
    if (match) {
      return match[1];
    }

    return require(path.join(__dirname, '../node_modules/@eps/common/package.json')).version;
  } catch (err) {
    console.warn('Unable to resolve @eps/common version:', err.message);
    return null;
  }
}

module.exports = { getEpsCommonVersion };
