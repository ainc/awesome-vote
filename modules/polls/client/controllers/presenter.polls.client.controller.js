(function () {
  'use strict';

  angular
    .module('polls')
    .controller('PresenterPollsController', PresenterPollsController);

  PresenterPollsController.$inject = ['Poll', '$stateParams', 'Socket'];

  function PresenterPollsController(Poll, $stateParams, Socket) {
    var vm = this;

    vm.poll = Poll.get({ shortcode: $stateParams.shortcode });

    Socket.on('vote', function (data) {
      console.log("VOTE GOT");
      if (data.shortcode === $stateParams.shortcode) {
        vm.poll.choices = data.choices;
        vm.poll.totalVotes = data.totalVotes;
      }
    });

  }
}());
