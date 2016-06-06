(function (app) {
  'use strict';

  app.registerModule('polls', ['core', 'rzModule']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('polls.services');
  app.registerModule('polls.routes', ['ui.router', 'core.routes', 'polls.services']);
}(ApplicationConfiguration));
