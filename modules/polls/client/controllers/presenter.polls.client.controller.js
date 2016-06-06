(function () {
  'use strict';

  angular
    .module('polls')
    .controller('PresenterPollsController', PresenterPollsController);

  PresenterPollsController.$inject = ['ArticlesService'];

  function PresenterPollsController(ArticlesService) {
    var vm = this;

  }
}());
