/**
 * Created by chenmingkang on 16/3/1.
 */
;(function(){
    'use strict';

    angular.module('cz-mask',[]).directive('mask',["$timeout",function($timeout) {
        return {
            restrict: 'EA',
            scope : {
                maskToggle : '='
            },
            link : function(scope, elm, attrs) {
                var $win = angular.element(window);
                var watchMask;
                $timeout(function(){
                    elm.bind('touchmove', function(evt) {
                        evt.preventDefault();
                    });

                    watchMask = scope.$watch('maskToggle',function(newVal,lodVal){
                        if(newVal){
                            $win.on('mousewheel',function(evt){
                                evt.preventDefault();
                                evt.stopPropagation();
                                return false;
                            });
                        }else{
                            $win.off('mousewheel');
                        }
                    });

                    scope.$on('$destroy',function(){
                        elm.off();
                        $win.off('mousewheel');
                        watchMask();
                    })
                },0);
            }
        }
    }]);
}());
