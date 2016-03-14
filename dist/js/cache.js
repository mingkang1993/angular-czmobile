/**
 * Created by chenmingkang on 16/3/1.
 */
;(function(){
    'use strict';
    angular.module('cz-cache',[]).factory('cacheFactory',['$cacheFactory','$rootScope','$window','$timeout', function($cacheFactory,$rootScope,$window,$timeout) {
        var myCache = function(){
            return $cacheFactory('myData');
        }();

        function setCache(datas){
            var scope =  datas.scope || $rootScope.$new();
            if($rootScope.cache){
                scope.$on('$destroy', function() {
                    datas.data.scrollTop = window.scrollY;
                    myCache.put(datas.name,datas.data);
                });
            }
        };

        function getCache(name){
            return myCache.get(name)
        };

        return {
            set : setCache,
            get : getCache,
            removeAll : myCache.removeAll
        }
    }])
}());
