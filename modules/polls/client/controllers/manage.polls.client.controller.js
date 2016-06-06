(function () {
  'use strict';

  angular
    .module('polls')
    .controller('ManagePollsController', ManagePollsController);

  ManagePollsController.$inject = ['Poll', '$stateParams'];

  function ManagePollsController(Poll, $stateParams) {
    var vm = this;

    vm.enableVoting = enableVoting;
    vm.disableVoting = disableVoting;

    // GET POLL OBJECT FROM SHORTCODE QUERY
    // UPDATE TOGGLED STATE
    // SAVE UPDATE THROUGH SERVICE
    vm.shortcode = $stateParams.shortcode;
    vm.poll = Poll.get({ shortcode: vm.shortcode });

    function enableVoting() {
      vm.poll.votingEnabled = true;
      vm.poll.$update(successHandler, errorHandler);
    }

    function disableVoting() {
      vm.poll.votingEnabled = false;
      vm.poll.$update(successHandler, errorHandler);
    }

    function successHandler() {
      console.log("Success");
    }

    function errorHandler(error) {
      console.error(error);
    }


  }
}());
