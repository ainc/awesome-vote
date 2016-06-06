/**
 * Created by drakewitt on 10/6/15.
 */
var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');


// Subdocument schema for votes
var voteSchema = new mongoose.Schema({ ip: 'String' });

// Subdocument schema for poll choices
var choiceSchema = new mongoose.Schema({
  text: String,
  votes: [voteSchema]
});

// Document schema for polls
var PollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  choices: [choiceSchema],
  pollType: { type: String, required: true },
  shortcode: { type: String, required: true, unique: true },
  user: { type: Object, required: true },
  votingEnabled: { type: Boolean },
  totalVotes: { type: Number }
});

PollSchema.plugin(uniqueValidator);

mongoose.model('Poll', PollSchema);
