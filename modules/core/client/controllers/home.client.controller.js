(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['Poll', 'Socket', '$http'];

  function HomeController(Poll, Socket, $http) {
    var vm = this;

    vm.polls = Poll.query({ 'shortcode': 'polls' });

    Socket.on('refreshData', function () {
      // Using HTTP because the service would do weird caching thing
      // TODO: Get service to work
      $http.get('/api/polls/polls').then(function(data) {
        vm.polls = null;
        vm.polls = data.data;
      });
    });
  }
}());
