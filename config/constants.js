const config = require('config');

module.exports = {
  ESA_ROOT_URL: `https://${config.get('team')}.esa.io`
}
