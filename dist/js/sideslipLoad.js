/**
 * Created by chenmingkang on 16/3/1.
 *
 * sideslipLoadBindEvtFactory 负责绑定事件方法
 * sideslipLoadFactory        桥接sideslipLoadBindEvtFactory跟指令的方法
 */
;(function(){
    'use strict';

    angular.module('cz-sideslip-load',[]).factory('sideslipLoadBindEvtFactory',[function(){
        function bindEvt(elm,evtData,toTouchesFn){
            return {
                start : function(evt,event){
                    evtData.touchStartX = evt.x;
                    evtData.touchStartY = evt.y;
                    toTouchesFn(elm,evt,'move');   //当点击一次的时候不会出发move事件，touchEndX没值，所以第一次负值
                },
                move : function(evt,event){
                    toTouchesFn(elm,event,'move'); //调用move方法给他定位
                    if(evtData.touchEndY - evtData.touchStartY > 100 || evtData.touchEndY - evtData.touchStartY < -100){ //如果上滑或者下滑 都100以上  那我就给他还原
                        toTouchesFn(elm,event,'end'); //调用end方法还原
                    }
                },
                end : function(evt,event,touchXTime){
                    var absTouch = Math.abs(evtData.touchX);
                    if(evtData.touchY < 80 && absTouch > evtData.aboutDistance){   //如果纵向80以上并且左右距离大于50
                        touchXTime(evt,event);
                    }else{
                        toTouchesFn(elm,event,'end');
                    }
                }
            };
        }

        return bindEvt;
    }]).factory('sideslipLoadFactory',["$rootScope","$timeout","sideslipLoadBindEvtFactory",function($rootScope,$timeout,sideslipLoadBindEvtFactory){
        var prevClass = 'prev-sides',
            nextClass = 'next-sides';
        var evtData = {};


        function tarnsform(elm,model){
            if($rootScope.browser.v.ios) {     //效果只能在ios上支持
                if(model == 'tarnsform'){
                    elm.css({
                        '-webkit-transform': 'translate3d(' + evtData.touchX + 'px, 0px, 0px)',
                        '-moz-transform': 'translate3d(' + evtData.touchX + 'px,, 0, 0)',
                        '-ms-transform': 'translate3d(' + evtData.touchX + 'px,, 0, 0)',
                        'transform': 'translate3d(' + evtData.touchX + 'px,, 0, 0)'
                    });
                }else{
                    elm.css({
                        '-webkit-transform': ''
                    });
                }
            }
        }

        function sideslipLoadFn(scope,elm,attrs){
            function init(){
                angular.extend(evtData,{
                    touchStartX : 0,   //开始X位置
                    touchEndX : 0,     //结束X位置
                    touchStartY : 0,   //开始Y位置
                    touchEndY : 0,     //结束Y位置
                    touchX : 0,        //移动中的X
                    touchY : 0,        //移动中的Y
                    aboutDistance : 80 || scope.aboutDistance       //滑动到多少距离让他加载下一页
                });
                return evtData;
            }

            function toTouches(elm,event,model){   //事件之后的回调
                if(!event.touches ||  event.touches.length > 1){   //判断是否一根手指,不是的话定位给他回去
                    tarnsform(elm,'remove');
                    return;
                }

                if(model === 'start' && !elm.hasClass('sides')) {
                    elm.addClass("sides");
                }

                if(model === 'move'){
                    evtData.touchEndX = event.touches[0].clientX;
                    evtData.touchEndY = event.touches[0].clientY;
                    evtData.touchX = evtData.touchEndX - evtData.touchStartX;
                    evtData.touchY = Math.abs(evtData.touchStartY - evtData.touchEndY);
                    tarnsform(elm,"tarnsform");  //ios 里面效果
                }

                if(model === 'end'){
                    tarnsform(elm,'remove');
                    init();
                }
            }

            function touchXTime(evt,event){   //事件结束执行的方法
                var absTouch = Math.abs(parseInt(evtData.touchX));
                $timeout(function(){
                    if(absTouch < $rootScope.bodyInfo.width) {
                        evtData.touchX = evtData.touchX < 0 ? evtData.touchX - 10 : evtData.touchX + 10;
                        tarnsform(elm,'tarnsform');
                        touchXTime(evt, event);
                        return;
                    }

                    if(evtData.touchX > evtData.aboutDistance){    //横向滚动到80 在触发事件
                        if(scope.$eval(attrs.sideslipLoad).prev){
                            scope.$eval(attrs.sideslipLoad).prev();
                            elm.addClass(prevClass);
                        }
                    }else{
                        if(scope.$eval(attrs.sideslipLoad).next){
                            scope.$eval(attrs.sideslipLoad).next();
                            elm.addClass(nextClass);
                        }
                    }
                    $timeout(function(){
                        elm.removeClass(prevClass);
                        elm.removeClass(nextClass);
                    },300);
                    toTouches(elm,event,'end');
                },2);
            }

            init();

            return {
                toTouches : toTouches,
                touchXTime : touchXTime,
                bindEvtFn : sideslipLoadBindEvtFactory(elm,evtData,toTouches)
            }
        }

        return sideslipLoadFn;
    }]).directive('sideslipLoad', ['$swipe','$rootScope', '$timeout','sideslipLoadFactory',function($swipe,$rootScope, $timeout,sideslipLoadFactory) {

        return {
            restrict : 'EA',
            scope : {
                aboutDistance : '=',
                sideslipLoad  : '&'
            },
            link : function(scope, elm, attrs) {
                var sideslipLoadFn = sideslipLoadFactory(scope, elm, attrs);

                $timeout(function(){
                    scope.$on('$destroy', function(){
                        elm.off();
                    });

                    $swipe.bind(elm, {
                        start : sideslipLoadFn.bindEvtFn.start,
                        move : sideslipLoadFn.bindEvtFn.move,
                        end : function(evt,event){
                            sideslipLoadFn.bindEvtFn.end(evt,event,sideslipLoadFn.touchXTime)
                        },
                        cancel:function(event){
                            scope.$apply(function() {
                                sideslipLoadFn.toTouches(elm,event,'end');
                            });
                        }
                    });
                },0);
            }
        }
    }]);
}());
