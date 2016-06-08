(function () {
  'use strict';

  angular
    .module('polls')
    .controller('VoteController', VoteController);

  VoteController.$inject = ['Poll', 'Socket', '$stateParams'];

  function VoteController(Poll, Socket, $stateParams) {
    var vm = this;

    // Set variables
    vm.slider = {
      value: 5,
      options: {
        floor: 1,
        ceil: 10
      }
    };
    vm.vote = vote;

    // See if user has voted from local storage
    // vm.hasVoted = localStorage.getItem($stateParams.pollId);
    vm.hasVoted = false;
    if (vm.hasVoted === null) {
      vm.hasVoted = false;
    }

    // Get the poll from the server and determine if the voting is disabled or if an error occurs.
    vm.poll = Poll.get({ shortcode: $stateParams.pollId });

    // TODO: Why the hell are these two socket functions in here?
    Socket.on('myvote', function (data) {
      if (data.shortcode === $stateParams.pollId) {
        vm.poll = data;
      }
    });

    Socket.on('vote', function (data) {
      if (data.shortcode === $stateParams.pollId) {
        vm.poll.choices = data.choices;
        vm.poll.totalVotes = data.totalVotes;
      }
    });

    function vote() {
      if (!vm.hasVoted) {
        localStorage.setItem($stateParams.pollId, 'true');
        vm.hasVoted = true;
        var pollId = vm.poll._id,
          choiceId = vm.poll.userVote;

        if (vm.poll.pollType === "range") {
          var id = vm.poll.choices[vm.slider.value - 1]._id;
          var voteRangeObj = { poll_id: pollId, choice: id };
          Socket.emit('send:vote', voteRangeObj);
        } else if (vm.poll.pollType === "ma") {
          var key = Object.keys(choiceId);
          for (var i = 0; i < key.length; i++) {
            console.log(key[i]);
            var voteObj = { poll_id: pollId, choice: key[i] };
            Socket.emit('send:vote', voteObj);
          }
        } else {
          var voteObjTree = { poll_id: pollId, choice: choiceId };
          Socket.emit('send:vote', voteObjTree);
        }
      } else {
        alert('Error: Already voted!');
      }
    }

    function errorHandler(err) {
      if (err.data.error === "Voting Disabled") {
        vm.disabled = true;
      } else if (err.data.error === "no_result") {
        alert("No poll matching that id.");
        window.location.href = "./";
      } else {
        alert("Uh oh! An error occurred");
        console.error(err);
      }
    }
  }
}());
