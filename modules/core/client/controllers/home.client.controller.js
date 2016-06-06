(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['Poll'];

  function HomeController(Poll) {
    var vm = this;

    vm.polls = Poll.query();
  }
}());
