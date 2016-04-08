/**
 * Created by chenmingkang on 16/3/4.
 *
 * czScrollDomHideListFactory   列表项
 * czScrollDomHideFnsFactory    操作列表项的
 */
;(function(){
    'use strict';

    angular.module('cz-scroll-dom-hide',[]).factory('czScrollDomHideListFactory',["$timeout",function($timeout) {
        function List(elm,data){
            this.elment = elm;
            //this.listData = {};
        };

        List.prototype.listData = {};

        List.prototype.offsetHeight = function(){
            return elment[0].offsetHeight;
        };

        List.prototype.addTargetData = function(name,data){
            this.listData[name] = data;
        };

        List.prototype.removeListData = function(name){
            delete this.listData[name];
        };

        List.prototype.removeAllListData = function(){
            this.listData = {};
        };

        List.prototype.getListData = function(name){
            return this.listData[name];
        };
        List.prototype.getAllListData = function(name){
            return this.listData;
        };
        return function(elm,data){
            return new List(elm,data)
        };
    }]).factory('czScrollDomHideFnsFactory',["$timeout","czScrollDomHideListFactory",function($timeout,czScrollDomHideListFactory) {
        var listDataFn;

        function init(elm,data,scope){
            listDataFn = czScrollDomHideListFactory(elm,data);
        };

        function setElementHeight(elm){
            elm.css({'min-height' : elm[0].clientHeight + 'px'});
        }

        function removeDomData(elm,data,scope,name){
            if(scope.datas){
                setElementHeight(elm);
                listDataFn.addTargetData(name,data);
                scope.datas = null;
            }
        };

        function addDomData(scope,name){
            var getData;
            if(!scope.datas){
                getData = listDataFn.getListData(name);
                scope.datas = getData;
                listDataFn.removeListData(name);
            }
        };

        return {
            init : init,
            addDomData : addDomData,
            removeDomData : removeDomData
        }

    }]).directive('czScrollDomHide',["$rootScope","$timeout","czScrollDomHideFnsFactory","throttleFactory","$window",function($rootScope,$timeout,czScrollDomHideFnsFactory,throttleFactory,$window) {
        return {
            restrict: 'EA',
            scope:{
                datas : '=czScrollDomData'
            },
            link : function(scope, elm, attrs) {
                var $win = angular.element($window);
                var time = $timeout(function(){
                    var scopeWatch;
                    var listDataName = attrs.czScrollDataName || attrs.czScrollDomData.replace(/\./g,"-");

                    function bindScroll(offsetTop){
                        if((window.scrollY > (offsetTop + elm[0].offsetHeight)) || (!(offsetTop < $rootScope.bodyInfo.height) && window.scrollY + 1000 < $rootScope.bodyInfo.height)){
                            czScrollDomHideFnsFactory.removeDomData(elm,scope.datas,scope,listDataName);
                        }else{
                            czScrollDomHideFnsFactory.addDomData(scope,listDataName);
                        }
                    };
                    scopeWatch = scope.$watch('datas',function(newData,lowData){
                        if(newData){
                            var offsetTop = elm[0].offsetTop;
                            czScrollDomHideFnsFactory.init(elm,newData,scope);
                            $win.on('scroll',function(){
                                bindScroll(offsetTop);
                            }).on('click',function(){
                                bindScroll(offsetTop);
                            }).on('touchend',function(){
                                bindScroll(offsetTop);
                            });
                            scopeWatch();
                        }
                    });

                    scope.$on('$destroy',function(){
                        $timeout.cancel(time);
                        $win.off('scroll',bindScroll);
                    });

                },0);
            }
        }
    }]);
}());