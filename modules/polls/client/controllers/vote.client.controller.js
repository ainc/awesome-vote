(function () {
  'use strict';

  angular
    .module('polls')
    .controller('VoteController', VoteController);

  VoteController.$inject = ['ArticlesService'];

  function VoteController(ArticlesService) {
    var vm = this;

  }
}());
