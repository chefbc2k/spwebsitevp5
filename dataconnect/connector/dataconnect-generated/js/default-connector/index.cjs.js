const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'speak-website-data-connect-service',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

