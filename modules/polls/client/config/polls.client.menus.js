(function () {
  'use strict';

  angular
    .module('polls')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Polls',
      state: 'polls',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'polls', {
      title: 'List Polls',
      state: 'polls.all'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'polls', {
      title: 'Create Poll',
      state: 'polls.new'
    });
  }
}());
