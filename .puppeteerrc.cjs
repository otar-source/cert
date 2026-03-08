const path = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location to a local `./.cache/puppeteer` folder.
  // This ensures the path is writable and predictable on Render.
  cacheDirectory: path.join(__dirname, '.cache', 'puppeteer'),
};