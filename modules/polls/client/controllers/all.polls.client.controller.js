(function () {
  'use strict';

  angular
    .module('polls')
    .controller('AllPollsController', AllPollsController);

  AllPollsController.$inject = ['Poll', '$state'];

  function AllPollsController(Poll, $state) {
    var vm = this;

    vm.polls = Poll.query();
    vm.setSelected = setSelected;

    function setSelected(sc) {
      $state.go('polls.manage', { shortcode: sc });
    }
  }
}());
