'use strict';

/**
 * Module dependencies
 */
var pollsPolicy = require('../policies/polls.server.policy'),
  polls = require('../controllers/polls.server.controller');

module.exports = function (app) {
  // Polls collection routes
  app.route('/api/polls').all(pollsPolicy.isAllowed)
    .get(polls.list)
    .post(polls.create);

  // Public API Route
  app.route('/api/polls/polls').all(pollsPolicy.isAllowed)
    .get(polls.public);

  app.route('/api/vote').all(pollsPolicy.isAllowed)
    .post(polls.vote);

  // Single article routes
  app.route('/api/polls/:pollId').all(pollsPolicy.isAllowed)
    .get(polls.read)
    .put(polls.update)
    .delete(polls.delete);

  // Finish by binding the article middleware
  app.param('pollId', polls.pollByID);
};

/* ROUTES:
/api/polls/polls - return public voting
/api/polls - POST and GET, POST makes a new object, GET returns all. Only admins
/api/polls/:id - GET a specif poll, DELETE a specific poll, PUT update a specific poll (ONLY GET PUBLIC)
DISABLE AND ENABLE NOW GO UNDER THE PUT REQUEST
/api/vote - POST public
 */
