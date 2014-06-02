'use strict';

/* jasmine specs for directives go here */

describe('directives', function() {
  beforeEach(module('myApp.directives'));

  describe('my-line-graph', function() {
    it('should not explode', function() {
      inject(function($compile, $rootScope) {
        var element = $compile('<my-line-graph/>')($rootScope);
        expect(element.text()).toEqual('');
      });
    });
  });
  
  describe('bar graph', function() {
    it('should not explode', function() {
      inject(function($compile, $rootScope) {
        var element = $compile('<div id="d3bar" angulard3-bar-graph datajson="\'sample.json\'" xaxis-name = "\'Year\'" xaxis-pos = "905"  yaxis-name = "\'Frequency\'" yaxis-pos = "6" d3-format= "\'.0%\'" >')($rootScope);
        expect(element.text()).toEqual('');
      });
    });
  });
  
  describe('app-version', function() {
    it('should print current version', function() {
      module(function($provide) {
        $provide.value('version', 'TEST_VER');
      });
      inject(function($compile, $rootScope) {
        var element = $compile('<span app-version></span>')($rootScope);
        expect(element.text()).toEqual('TEST_VER');
      });
    });
  });
});
