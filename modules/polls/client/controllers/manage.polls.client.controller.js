(function () {
  'use strict';

  angular
    .module('polls')
    .controller('ManagePollsController', ManagePollsController);

  ManagePollsController.$inject = ['Poll', '$stateParams', '$state', 'Socket', '$http'];

  function ManagePollsController(Poll, $stateParams, $state, Socket, $http) {
    var vm = this;

    vm.enableVoting = enableVoting;
    vm.disableVoting = disableVoting;
    vm.delete = deleteClass;
    vm.disableTimer = disableTimer;

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

    function disableTimer() {
      // Make http call.
        $http.post('api/timer/' + vm.shortcode, {}).success(function(data) {
          console.log("Timer");
            setTimeout(function() {
                Socket.emit('refresh', null);
            }, 200);
        });
    }

    function successHandler() {
      console.log("Success");
      setTimeout(function() {
        Socket.emit('refresh', null);
      }, 200);
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
