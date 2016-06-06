(function () {
  'use strict';

  angular
    .module('polls.services')
    .factory('Poll', Poll);

  Poll.$inject = ['$resource'];

  function Poll($resource) {
    return $resource('api/polls/:shortcode', {
      shortcode: '@shortcode'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
