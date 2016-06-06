(function () {
  'use strict';

  angular
    .module('polls.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('polls', {
        abstract: true,
        url: '/polls',
        templateUrl: 'modules/polls/client/views/polls.client.view.html',
        data: {
          roles: ['admin'],
          pageTitle: 'Polls'
        }
      })
      .state('polls.all', {
        url: '/all',
        templateUrl: 'modules/polls/client/views/all.polls.client.view.html',
        controller: 'AllPollsController',
        controllerAs: 'vm'
      })
      .state('polls.new', {
        url: '/new',
        templateUrl: 'modules/polls/client/views/new.polls.client.view.html',
        controller: 'NewPollController',
        controllerAs: 'vm'
      })
      .state('polls.manage', {
        url: '/manage/:shortcode',
        templateUrl: 'modules/polls/client/views/manage.polls.client.view.html',
        controller: 'ManagePollsController',
        controllerAs: 'vm'
      })
      .state('polls.presenter', {
        url: '/presenter/:shortcode',
        templateUrl: 'modules/polls/client/views/presenter.polls.client.view.html',
        controller: 'PresenterPollsController',
        controllerAs: 'vm'
      })
      .state('vote', {
        url: '/vote/:pollId',
        templateUrl: 'modules/polls/client/views/vote.client.view.html',
        controller: 'VoteController',
        controllerAs: 'vm'
      });
  }
}());
