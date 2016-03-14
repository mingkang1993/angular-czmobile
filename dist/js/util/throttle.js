/**
 * Created by chenmingkang on 16/3/1.
 */
;(function(){
    'use strict';
    angular.module('cz-throttle',[]).factory("throttleFactory",['$rootScope','$timeout', function($rootScope,$timeout) {   //节点流，滚动事件之类多次会导致性功能低下；
        return function(fn, threshhold, scope){
            threshhold || (threshhold = 250);
            var last,
                deferTimer;
            return function () {
                var context = scope || this;

                var now = +new Date,
                    args = arguments;
                if (last && now < last + threshhold) {
                    // hold on to it
                    $timeout.cancel(deferTimer);
                    deferTimer = $timeout(function () {
                        last = now;
                        fn.apply(context, args);
                    }, threshhold);
                } else {
                    last = now;
                    fn.apply(context, args);
                }
            };
        };
    }]);
}());