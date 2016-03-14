/**
 * Created by chenmingkang on 16/3/1.
 *
 * 返回顶部
 */
;(function(){
    'use strict';
    angular.module('cz-back-top',[]).directive('backTop', ['$rootScope', '$window','throttleFactory',function($rootScope, $window,throttleFactory) {
        return {
            restrict : 'EA',
            link : function(scope, elm, attrs) {
                function winGoTopShow(){
                    if(window.scrollY > $rootScope.bodyInfo.height){
                        elm.addClass('back-top-show');
                    }else{
                        elm.removeClass('back-top-show');
                    }
                }

                var throttle = throttleFactory(winGoTopShow);   //节点流

                //scope.$on('$destroy', function(){
                //    elm.off();
                //    $win.off();
                //});
                elm.bind('touchstart',function(){
                    $window.scrollTo(0,0);
                }).bind('click',function(){
                    $window.scrollTo(0,0);
                });

                angular.element(window).on('scroll',throttle)
            }
        }
    }]);
}());
