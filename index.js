require('traceur-runtime');

var internal_server_api = require('./lib/internal_server_api.js');
var journey = require('./lib/journey.js');
var server_api = require('./lib/server_api.js');
var sync_storage = require('./lib/sync_storage.js');

// FIXME: Consider what is actually needed and hide the rest from the interface.
// One can always add to an interface.
var obj = {
  createConnector: server_api.createConnector,
  createSyncStorage: sync_storage.createSyncStorage,
  createJourneyId: journey.createJourneyId,
  internalServerApi: internal_server_api
};

obj.default = obj;
module.exports = obj;
