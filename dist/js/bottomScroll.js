/**
 * Created by chenmingkang on 16/3/1.
 *
 * 滚动加载
 */
;(function(){
    'use strict';

    angular.module('cz-bottom-scroll',[]).directive('bottomScroll', ['$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
        var handler;
        return {
            link: function(scope, elem, attrs) {
                $window = angular.element($window);
                handler = function(evt) {
                    if ($window[0].scrollY > 0 && ($window[0].scrollY + $window[0].innerHeight + 300) >= elem[0].offsetTop + elem[0].clientHeight) {
                        return scope.$eval(attrs.bottomScroll);
                    }
                };
                $window.on('scroll',handler);
                scope.$on('$destroy', function() {
                    return $window.off('scroll', handler);
                });
                return $timeout((function() {
                    return handler();
                }), 0);
            }
        };
    }]);
}());
