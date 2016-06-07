(function () {
  'use strict';

  angular
    .module('polls')
    .controller('ManagePollsController', ManagePollsController);

  ManagePollsController.$inject = ['Poll', '$stateParams', '$state'];

  function ManagePollsController(Poll, $stateParams, $state) {
    var vm = this;

    vm.enableVoting = enableVoting;
    vm.disableVoting = disableVoting;
    vm.delete = deleteClass;

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

    function deleteClass() {
      if (vm.poll.votingEnabled) {
        alert('Error, voting enabled. Disable voting and try again.');
      } else {
        var confirmation = confirm("Are you sure you want to delete this poll?");
        if (confirmation) vm.poll.$remove(deleteSuccessHandler, errorHandler);
      }
    }

    function deleteSuccessHandler() {
      $state.go('polls.all');
      console.log("Success");
    }

  }
}());
