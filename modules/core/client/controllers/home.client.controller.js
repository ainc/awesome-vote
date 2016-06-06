(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['Socket', 'Poll']

  function HomeController(Socket, Poll) {
    var vm = this;

    vm.polls = Poll.query();
  }
}());
