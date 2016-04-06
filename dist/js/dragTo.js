/**
 * Created by chenmingkang on 16/3/1.
 *
 * dragMoveCssFactory    滑动时的css动画
 * dragTemplateFactory   template 模版
 * dragBindFnFactory     负责提供绑定数据的fn
 * dragFnFactory         主要是桥接的factory
 * dragToLay             指令是父节点的数据绑定
 * dragToDismiss         是当个元素的指令
 *
 */
;(function(){
    'use strict';

    angular.module('cz-drag-to',[]).factory('dragMoveCssFactory',function() {
        function tarnsform(elm,x){
            elm.css({
                '-webkit-transform': 'translate3d(' + x + 'px, 0, 0)',
                '-moz-transform': 'translate3d(' + x + 'px, 0, 0)',
                '-ms-transform': 'translate3d(' + x + 'px,, 0, 0)',
                'transform': 'translate3d(' + x + 'px,, 0, 0)'
            });
        }
        return {
            tarnsform : tarnsform
        };
    }).factory('dragTemplateFactory',function() {
        var fns = {
            templateItem : function(elm){   //item模版
                var template = '<div class="drag-to-dismiss">' +
                                    '<div ng-click="dragBgClick($event)" class="drag-to-bg"></div>'+
                                    '<div class="drag-buttons"><a href="javascript:;" class="success" style="line-height : '+ elm[0].offsetHeight +'px;" ng-repeat="item in dragOption.texts track by $index" ng-click="successClick($event,$index)">{{item}}</a></div>'+
                               '</div>';
                return template;
            },
            templateBg : function(){  //bg模版
                var templateBg = '<div class="drag-bg" ng-if="dragBgShow" ng-click="dragBgClick($event)"></div>';
                return templateBg
            }
        };
        return fns;
    }).factory('dragBindFnFactory',["$timeout","$compile","$rootScope","dragMoveCssFactory",function($timeout,$compile,$rootScope,dragMoveCssFactory) {
        var fns = function(elm,scope){
            var domDismiss = elm[0].querySelector('.drag-to-dismiss');
            var maxLeft = domDismiss.offsetWidth;

            domDismiss.style.right = -maxLeft + 'px';
            return {
                start : function(evt,evtPosition){   //开始移动的事件
                    evtPosition.startX = evt.x;
                    evtPosition.startY = evt.y;
                },
                move : function(evt,evtPosition){
                    if(!evtPosition.startX || !evtPosition.startY){   //有一些端不兼容
                        this.start(evt,evtPosition);
                    }
                    evtPosition.moveX = evt.x;
                    evtPosition.moveY = evt.y;
                    evtPosition.totalY = evtPosition.moveY - evtPosition.totalY;
                    evtPosition.totalX = - (evtPosition.moveX - evtPosition.startX) > maxLeft ? -maxLeft : evtPosition.moveX - evtPosition.startX;   //移动只能移动到最大值
                    dragMoveCssFactory.tarnsform(elm,evtPosition.totalX);
                },
                end : function(evtPosition,$scopePar){
                    scope.$apply(function(){
                        evtPosition.startX = 0;
                        evtPosition.startY = 0;

                        if(evtPosition.totalX < 0){   //给他添加效果或者class
                            dragMoveCssFactory.tarnsform(elm,-maxLeft,elm);
                            $scopePar.dragBgShow = true;
                            elm.addClass('drag-active');  //删除激活样式
                        }else{
                            dragMoveCssFactory.tarnsform(elm,2);
                            evtPosition = {};
                        }

                        //evtPosition.totalX = 0;
                    });
                }
            }
        };
        return fns;
    }]).factory('dragFnFactory',["$timeout","$compile","$swipe","dragTemplateFactory","dragBindFnFactory","dragMoveCssFactory",function($timeout,$compile,$swipe,dragTemplateFactory,dragBindFnFactory,dragMoveCssFactory) {
        var evtPosition = initPosition();

        function initPosition(){   //init的一些基本参数
            return {
                startX : 0,
                startY : 0,
                moveX : 0,
                moveY : 0,
                totalX : 0,
                totalY : 0
            };
        }

        function closeBg(dragDiv,event,$scopePar){   //关闭背景
            angular.forEach(dragDiv.find('li'),function(item){
                var $item = angular.element(item);
                dragMoveCssFactory.tarnsform($item,2);
                $item.removeClass('drag-active');  //删除激活样式
            });
            $scopePar.dragBgShow = false;
            evtPosition = initPosition();
            event.stopPropagation();
        }

        function initBindEvt(elm,scope,$scopePar){  //绑定事件,添加元素
            function init(){
                var templateItem = dragTemplateFactory.templateItem(elm);
                elm.css('position','relative').append($compile(templateItem)(scope));
                $timeout(function(){
                    bindEvt();
                },0);
            }

            function bindEvt(){
                var dargBindFn = dragBindFnFactory(elm,scope);
                $swipe.bind(elm, {
                    start : function(evt,event){
                        dargBindFn.start(evt,evtPosition)
                    },
                    move : function(evt,event){
                        dargBindFn.move(evt,evtPosition)
                    },
                    end : function(evt,event){
                        dargBindFn.end(evtPosition,$scopePar);
                    },
                    cancel:function(event){
                        evtPosition = initPosition();
                    }
                });
                scope.$on('$destroy',function(){
                    elm.off();
                });
            }
            return init();
        }

        return {
            initBindEvt : initBindEvt,
            closeBg : closeBg
        };
    }]).directive('dragToLay',["$timeout","$compile","dragFnFactory","dragTemplateFactory",function($timeout,$compile,dragFnFactory,dragTemplateFactory) {
        return {
            restrict: 'EA',
            scope:{
                dragOption : '='
            },
            controller: ['$element',"$attrs","$scope", function($element,$attrs,$scope) {
                this.$scopePar = $scope;
                this.dragOption = $scope.dragOption;
                this.dragLayElm = $element;
            }],
            link : function(scope, elm, attrs) {
                //var $getElmByDrag = function(){
                //    var getDragBg = document.getElementsByClassName('drag-bg');
                //    return angular.element(getDragBg);
                //}();
                //if(!$getElmByDrag.length){
                //    var templateBg = dragTemplateFactory.templateBg();
                //    angular.element(document.getElementsByClassName('app')[0]).append($compile(templateBg)(scope));
                //}

                var templateBg = dragTemplateFactory.templateBg();
                angular.element(document.getElementsByClassName('app')[0]).append($compile(templateBg)(scope));

                scope.dragBgClick = function(event){  //bg关闭的事件
                    dragFnFactory.closeBg(elm,event,scope);
                }
            }
        }
    }]).directive('dragToDismiss',["$timeout","dragFnFactory",function($timeout,dragFnFactory) {
        return {
            restrict: 'EA',
            require: '^?dragToLay',
            scope : false,
            link : function(scope, elm, attrs,dragToLayController) {
                $timeout(function(){
                    var dragData = eval('(' + attrs.dragData + ')');    //获取数据
                    var dragDiv = dragToLayController.dragLayElm;

                    scope.dragOption = dragToLayController.dragOption; //获取参数
                    dragFnFactory.initBindEvt(elm,scope,dragToLayController.$scopePar);

                    scope.successClick = function(event,index){
                        dragFnFactory.closeBg(dragDiv,event,dragToLayController.$scopePar);
                        scope.dragOption.callback[index](dragData);
                    };
                },0);
            }
        }
    }])
}());



