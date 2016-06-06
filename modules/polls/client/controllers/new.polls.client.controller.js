(function () {
  'use strict';

  angular
    .module('polls')
    .controller('NewPollController', NewPollController);

  NewPollController.$inject = ['Poll', 'Authentication', '$state', 'Socket'];

  function NewPollController(Poll, Authentication, $state, Socket) {
    var vm = this;

    vm.addChoice = addChoice;
    vm.createPoll = createPoll;
    vm.poll = {
      question: '',
      choices: [{ text: '' }, { text: '' }, { text: '' }],
      pollType: '',
      user: Authentication.user
    };

    function addChoice() {
      vm.poll.choices.push({ text: '' });
    }

    function createPoll() {
      if (vm.poll.pollType === "range") {
        vm.poll.choices = [{ text: '1' }, { text: '2' }, { text: '3' }, { text: '4' }, { text: '5' }, { text: '6' }, { text: '7' }, { text: '8' }, { text: '9' }, { text: '10' }];
      }
      var poll = vm.poll;

      // Create a new poll from the model
      var newPoll = new Poll(poll);

      // Call API to save poll to the database
      newPoll.$save(function success() {
        Socket.emit('refresh', null);
        $state.go('polls.all');
      }, function err(err) {
        alert('Could not create poll, please try again.');
        console.error(err);
      });
    }
  }
}());
