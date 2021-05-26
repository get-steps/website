const fs = require('fs');
const path = require('path');

/**
 * Autoload webpack entry points.
 * @param {string} dir - A directory to autoload entrypoints from
 */
const getEntryPoints = dir => {
  const entrypoints = {};

  fs.readdirSync(dir).forEach(file => {
    const { ext, name } = path.parse(file);

    if (ext === '.js') {
      entrypoints[name] = `${dir}/${name}${ext}`;
    }
  });

  return entrypoints;
};

module.exports = getEntryPoints;
