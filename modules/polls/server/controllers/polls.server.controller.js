'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Poll = mongoose.model('Poll'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    cc = require('coupon-code'),
    request = require('request');


/**
 * Create a poll
 */
exports.create = function (req, res) {
    var poll = new Poll(req.body);
    poll.user = req.user;
    poll.shortcode = cc.generate({parts: 1, partLen: 6});
    poll.votingEnabled = true;

    poll.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(poll);
        }
    });
};

exports.public = function (req, res) {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);

    Poll.find({"votingEnabled": true}, function (err, polls) {
        if (polls) {
            console.log(polls);
            res.json(polls);
        } else {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
    });
};

exports.vote = function (socket) {
    socket.on('refresh', function (data) {
        socket.broadcast.emit('refreshData', data);
    });

    // This gets tricky, but I'm going to try to comment and explain it so buckle up.
    // When socket gets the send:vote event
    socket.on('send:vote', function (data) {
        // Find the poll by ID that the vote was for
        Poll.findById(data.poll_id, function (err, poll) {
            // Get the choice that the voter made
            var choice = poll.choices.id(data.choice);
            // Increment the amount of total votes.
            poll.totalVotes++;
            // Originally, the code was for some reason tracking votes with objects with IPs, however its not anymore,
            // and the objects are there to be refactored one day.
            choice.votes.push({"broken": "code"});

            // If the voting is enabled, let the vote go through
            if (poll.votingEnabled.toString()) {
                poll.save(function (err, doc) {
                    // Generate Vote Model
                    var theDoc = {
                        question: doc.question, _id: doc._id, choices: doc.choices,
                        shortcode: doc.shortcode,
                        pollType: doc.pollType,
                        userVoted: false, totalVotes: 0
                    };

                    for (var i = 0, ln = doc.choices.length; i < ln; i++) {
                        var choice = doc.choices[i];

                        for (var j = 0, jLn = choice.votes.length; j < jLn; j++) {
                            var vote = choice.votes[j];
                            theDoc.totalVotes++;
                        }
                    }
                    socket.emit('myvote', theDoc);
                    socket.broadcast.emit('vote', theDoc);
                });
            }
        });
    });
};

/**
 * Show the current poll
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var poll = req.poll ? req.poll : {};

    // Add a custom field to the Poll, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Poll model.
    poll.isCurrentUserOwner = !!(req.user && poll.user && poll.user._id.toString() === req.user._id.toString());

    res.json(poll);
};

/**
 * Update an poll
 */
exports.update = function (req, res) {
    var poll = req.poll;

    // poll.title = req.body.title;
    poll.votingEnabled = req.body.votingEnabled;
    poll.user = req.user;

    poll.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(poll);
        }
    });
};

exports.timer = function (req, res) {
    var poll = req.poll;

    var x = new Date();
    var month = x.getMonth();
    request.post('https://onesignal.com/api/v1/notifications', {
        headers: {
            'Authorization': '',
            "content-type": "application/json"
        },
        json: true,
        body: {
            "included_segments": ["All"],
            "app_id": "",
            "contents": {"en": "Voting on " + poll.question + " will be closing in 90 seconds."},
            "filters": [{"field": "tag", "key": "month", "relation": "=", "value": "1"}]
        }
    });
    setTimeout(function(){
        poll.votingEnabled = false;
        poll.user = req.user;
        poll.save(function (err) {
            if (err) {
                console.log(errorHandler.getErrorMessage(err));
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.json(poll);
            }
        });
    }, 90000);
};

/**
 * Delete a poll
 */
exports.delete = function (req, res) {
    var poll = req.poll;

    poll.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(poll);
        }
    });
};

/**
 * List of Polls (Non-Public)
 */
exports.list = function (req, res) {
    Poll.find().sort('-created').exec(function (err, polls) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(polls);
        }
    });
};

/**
 * Poll middleware
 */
exports.pollByID = function (req, res, next, id) {
    Poll.findOne({"shortcode": id}).populate('user', 'displayName').exec(function (err, poll) {
        if (err) {
            return next(err);
        } else if (!poll) {
            return res.status(404).send({
                message: 'No poll with that identifier has been found'
            });
        }
        req.poll = poll;
        next();
    });
};
