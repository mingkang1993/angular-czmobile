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
;
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
;
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
                    //$timeout(function(){
                        if(scope.asyns){   //可能在加载数据的时候点下一页，数据还没返回 page还没＋＋，所以就加1
                            if(datas.data.page){
                                datas.data.page++;
                            }

                            if(datas.data.getData && datas.data.getData.page){
                                datas.data.getData.page++;
                            }
                        }
                        datas.data.scrollTop = window.scrollY;
                        myCache.put(datas.name,datas.data);
                    //},100)
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
;
/**
 * Created by chenmingkang on 16/3/1.
 *
 * textTitle    title头部文本
 * text      文本
 * closeText  关闭文本
 * goText  确定文本
 */
;(function(){
    'use strict';
    angular.module('cz-confirm',[]).factory('confirmFactory',['$rootScope','$compile','$timeout',function($rootScope,$compile,$timeout){  //求出等比例的图片信息
        var getElmBg = function(){
            var getBg = getElm.length ? getElm[0] : document;
            return angular.element(getBg.getElementsByClassName('confirm-bg'));
        };

        var getElm = function(){
            return document.getElementsByClassName('confirm-lay');
        }();
        var $body = function(){
            return angular.element(document.getElementsByTagName('body'));
        }();

        var scope = $rootScope.$new();
        var $win = angular.element(window);
        var $elmBg;

        scope.confirm = {
            textTitle:'',
            text:'',
            closeText:'取消',
            goText:'确定',
            option:{
                go:function(){},
                close:function(){}
            }
        };

        var closeConfirm = function(){                      //清理
            $elmBg.off();
            $win.off('mousewheel');
            if(getElm[0]){
                angular.element(getElm[0]).remove();
            }
        };

        var setCss = function(){
            var getMain = getElm[0].getElementsByClassName('confirm-main')[0];
            getMain.style.marginTop = - (getMain.clientHeight / 2) + 'px';
            getMain = null;
        };

        function init(myData){
            angular.extend(scope.confirm,myData);
            var template = '<div class="confirm-lay confirm-lay-show">' +
                '<div class="confirm">' +
                '<div class="confirm-bg" id="confirm-bg" ng-click="confirmBgClose()"></div>' +
                '<div class="confirm-main">' +
                '<div class="confirm-text">'+
                '<div class="confirm-text-title" ng-bind-html="confirm.textTitle"></div>' +
                '<div class="confirm-text" ng-bind-html="confirm.text"></div>'+
                '</div>' +
                '<div class="confirm-btn">' +
                '<a href="javascript:;" ng-click="confirmClose()" class="confirm-btn-cancel">{{confirm.closeText}}</a>' +
                '<a href="javascript:;" ng-click="confirmGo()">{{confirm.goText}}</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            $body.append($compile(template)(scope));
            $elmBg = getElmBg();
            $win.on('mousewheel',function(evt){
                evt.preventDefault();
                evt.stopPropagation();
                return false;
            });
            $elmBg.bind('touchmove', function(evt) {
                evt.preventDefault();
            });
            $timeout(function(){
                setCss();
            },0);
        };

        scope.confirmGo = function(){
            closeConfirm();
            if(!!scope.confirm.option.go){
                scope.confirm.option.go();
            }
        };
        scope.confirmBgClose = function(){
            closeConfirm();
        };
        scope.confirmClose = function(){
            closeConfirm();
            if(!!scope.confirm.option.close){
                scope.confirm.option.close();
            }
        };

        scope.$on('$destroy', function(){
            closeConfirm();
            getElm = $elmBg = null;
        });

        return function(myData){
            init(myData);
        }
    }]);
}());
;
/**
 * Created by chenmingkang on 16/3/1.
 *
 * czYieldToCallback  回调 暂时没用到   type = function
 * czYieldHideBeforeCallback   一开始的回调可议配置,比如说如果app里面就可以把它remove掉,不让他显示
 * Capture    工厂类,列表项
 *
 * czYieldTo      定义模版的指令
 * czYieldHide    需要隐藏的元素
 * czContentFor   添加模版的指令
 *
 */
;(function(){
    'use strict';

    var startUrl = '';
    angular.module('cz-content-for',[]).provider('czContentForConfig', function() {
        this.options = {
            czYieldToCallback : function(){},
            czYieldHideBeforeCallback : function(){}   //这个是
        };

        this.$get = function() {
            var options = this.options;
            return {
                getOptions: function() {
                    return options;
                }
            };
        };

        this.setOptions = function(options) {
            angular.extend(this.options, options);
        };
    }).run(['Capture','$rootScope',function(Capture, $rootScope) {
        $rootScope.$on('$stateChangeStart', function(evt, current) {
            if(startUrl.split('.')[0] != current.name.split('.')[0]){
                Capture.resetAll();
            }
            startUrl = current.name;
        });
    }
    ]).factory('Capture', ['$compile','czContentForConfig',function($compile,czContentForConfig) {
            var yielders = {};

            return {
                getConfigOption : czContentForConfig.getOptions(),

                resetAll: function() {
                    for (var name in yielders) {
                        this.resetYielder(name);
                    }
                },

                resetYielder: function(name) {
                    var b = yielders[name];
                    b.element.css('display','block');
                    this.setContentFor(name, b.defaultContent, b.defaultScope);
                },

                putYielder: function(name, element, defaultScope, defaultContent) {
                    var yielder = {};
                    yielder.name = name;
                    yielder.element = element;
                    yielder.defaultContent = defaultContent || '';
                    yielder.defaultScope = defaultScope;
                    yielders[name] = yielder;
                },

                getYielder: function(name) {
                    return yielders[name];
                },

                removeYielder: function(name) {
                    delete yielders[name];
                },

                hideYielder: function(name) {
                    var item = this.getYielder(name);
                    item.element.html('').css('display','none');
                },

                setContentFor: function(name, content, scope) {
                    var b = yielders[name];
                    if (!b) {
                        return;
                    }
                    b.element.html(content);
                    $compile(b.element.contents())(scope);
                }
            };
        }
        ])

        .directive('czContentFor', ['Capture',function(Capture) {
            return {
                compile: function(tElem, tAttrs) {
                    var rawContent = tElem.html();
                    if(tAttrs.czDuplicate === null || tAttrs.czDuplicate === undefined) {
                        // no need to compile anything!
                        tElem.html('');
                        tElem.remove();
                    }

                    return function(scope, elem, attrs) {
                        Capture.setContentFor(attrs.czContentFor, rawContent, scope);
                    };
                }
            };
        }
        ]).directive('czYieldTo', ['$compile', 'Capture', function($compile, Capture) {
        return {
            link: function(scope, element, attr) {
                Capture.putYielder(attr.czYieldTo, element, scope, element.html());

                //element.on('$destroy', function(){
                //    Capture.removeYielder(attr.czYieldTo);
                //});
                //
                //scope.$on('$destroy', function(){
                //    Capture.removeYielder(attr.czYieldTo);
                //});
            }
        };
    }
    ]).directive('czYieldHide', ['$compile', 'Capture', function($compile, Capture) {
        return {
            link: function(scope, element, attr) {
                Capture.getConfigOption.czYieldHideBeforeCallback(scope,element);
                Capture.hideYielder(attr.czYieldHide);
            }
        };
    }])
}());
;
/**
 * Created by chenmingkang on 16/3/1.
 */
;(function(){
    'use strict';

    angular.module('cz-cookie',[]).factory('cookieFactory',function(){
        return {
            setCookie : function(cname, cvalue, exdays,domain) {//设置cookie
                var d = new Date();
                d.setTime(d.getTime() + (exdays*24*60*60*1000));
                var expires = "expires="+d.toUTCString();
                document.cookie = cname + "=" + cvalue + "; path=/;domain="+ domain +";" + expires;
            },
            getCookie : function(cname) {//获取cookie
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for(var i=0; i<ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0)==' ') c = c.substring(1);
                    if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
                }
                return "";
            },
            clearCookie : function(name,domain) {//清除cookie
                this.setCookie(name, '', -1,domain);
            }

        };
    });
}());
;
/**
 * Created by chenmingkang on 16/3/1.
 */
;(function(){
    'use strict';
    angular.module('cz-countdown',[]).directive('countdown', ['$rootScope', '$window', '$timeout','$document',function($rootScope, $window, $timeout,$document) {
        return {
            restrict : 'EA',
            scope:{
                countdownData:'='
            },
            link : function(scope, elm, attrs) {
                var elmText = elm.attr('countdown-end') || '商品已下架';
                var elmTextStart = elm.attr('countdown-start') || '';
                var time;
                scope.$on('$destroy', function(){
                    clearInterval(time);
                });
                time = setInterval(function(){
                    if(!!scope.countdownData){
                        var date = new Date(new Date(scope.countdownData.replace(/-/g, '/')).getTime() - new Date().getTime());
                        var getDate = date / (60000*60) /24;
                        var getHours = (getDate - Math.floor(getDate)) * 24;
                        var getMinutes = (getHours - Math.floor(getHours)) * 60;
                        var getSeconds = Math.floor((getMinutes - Math.floor(getMinutes)) * 60);

                        var getDateText = getDate > 1 ? Math.floor(getDate) + '天' : '';
                        var getHoursText =getHours > 1 ?  Math.floor(getDate) + '时' : '';

                        if(getDate <= 0){
                            elm.html(elmText);
                            clearInterval(time);
                        }else{
                            elm.html(elmTextStart + getDateText + getHoursText + Math.floor(getMinutes) + '分' + getSeconds + '秒');
                        }
                    }
                },1000)
            }
        }
    }]);
}());
;
/**
 * Created by chenmingkang on 16/3/1.
 */

;(function() {
    'use strict';
    angular.module('cz-mobile', [
        'cz-for-scroll',         //无限滚动,用于假数据循环展现
        'cz-to-load',            //上啦加载
        'cz-bottom-scroll',      //滚动加载
        'cz-type-sort',          //a-z,手势滑动'点击,页面滚动到定位到A-Z字母,提示A-Z
        'cz-countdown',          //倒计时
        'cz-sideslip-load',      //手势左右滑动,切换下一页或者加载下一条
        'cz-back-top',           //返回顶部
        'cz-history',               //重写返回按钮
        'cz-form-validate',      //表单校验
        'cz-drag-to',            //左滑动,在右边划出选项框
        'cz-mask',               //dialog 之类弹层,添加背景上,禁用滚动条
        'cz-content-for',        //头部,只需要改变文字,或者隐藏.
        'cz-scroll-dom-hide',

        'cz-message',            //消息提示
        'cz-share',              //分享三端,微信,QQ,微博
        'cz-confirm',            //确定,取消弹出框
        'cz-cache',              //数据缓存-可以缓存类似service层的数据
        'cz-open-app',           //打开App
        'cz-cookie',             //cookie
        'cz-util'            //节点流
    ]);

    angular.module('cz-util', [
        'cz-throttle'            //节点流
    ]);
}());;
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



;
/**
 * Created by chenmingkang on 16/3/1.
 */
;(function(){
    'use strict';

    angular.module('cz-for-scroll',[]).factory('forScrollListFactory',function(){
        function List(data){
            this.listData = data;
        };

        List.prototype.getFirstData = function(){
            return this.listData[0];
        };

        List.prototype.getLastData = function(){
            return this.listData[this.listData.length];
        };

        List.prototype.getData = function(){
            return this.listData;
        };

        return function(data){
            return new List(data);
        }
    }).directive('forScroll',["$timeout","forScrollListFactory",function($timeout,forScrollListFactory) {
        return {
            restrict: 'EA',
            scope:{
                'forScrollData' : '=',
                'forScrollTargetData' : '='
            },
            link : function(scope, elm, attrs) {
                $timeout(function(){
                    var elm2Html = elm[0].outerHTML,
                        elm2,
                        elmParent = elm.parent();

                    //elm.parent().append(elm2Html);

                    //elm2 = elm[0].nextElementSibling;

                    //elm2.css({top:elmParent[0].offsetHeight});

                    //function marquee(){ // 若第一遍的内容已全部显示完毕，则重新开始显示
                    //    var top = elm2.attr('top');
                    //    elm2.css({
                    //        top: top + 1
                    //    });
                    //    if(top > elmParent[0].offsetHeight + elm2){
                    //
                    //    }
                    //}

                    function marquee(){ // 若第一遍的内容已全部显示完毕，则重新开始显示
                        if(elmParent[0].scrollHeight - (elmParent[0].scrollTop + elmParent[0].offsetHeight) <= 0) {
                            elmParent[0].scrollTop = 0;
                        }
                        else {
                            elmParent[0].scrollTop++;
                        } // 否则向上滚动1个像素的量。
                    }

                    var myMarquee = setInterval(marquee,50); // 按一定的速度滚动
                },0);

                //var time,
                //    position = attrs.forPosition || 'top',
                //    second = attrs.forScrollTime * 1000,
                //    listFn = forScrollListFactory(scope.forScrollTargetData);
                //
                //function reformData(){
                //    var shiftData,lastTargetData;
                //    if(position == 'top'){
                //        shiftData = scope.forScrollData.shift();
                //        lastTargetData = scope.forScrollTargetData.pop();
                //
                //        scope.forScrollTargetData.unshift(shiftData);
                //        scope.forScrollData.push(lastTargetData);
                //    }else{
                //        shiftData = scope.forScrollData.pop();
                //        lastTargetData = scope.forScrollTargetData.shift();
                //
                //        scope.forScrollTargetData.push(shiftData);
                //        scope.forScrollData.unshift(lastTargetData);
                //    }
                //    timeFn();
                //}
                //
                //function timeFn(){
                //    time = $timeout(function(){
                //        if(attrs.forScrollSuccess){
                //            scope.$parent.$eval(attrs.forScrollSuccess)(listFn.getFirstData(),reformData)
                //        }else{
                //            reformData();
                //        }
                //    },second);
                //};
                //
                //timeFn();
                //
                //scope.$on('$destroy',function(){
                //    $timeout.cancel(time);
                //});
            }
        }
    }]);
}());
;
/**
 * Created by chenmingkang on 16/3/1.
 */
;(function(){
    'use strict';
// angular.validateAddMethod
//
    angular.module('cz-form-validate',[]).factory('validateFactory',['$compile',function($compile) {
        var rule = {};
        function provide(scope,elm,attrs,controllers){
            var ngModelCtrl = controllers[0];
            function validate(){
                var formCtrl = controllers[1];
                var formName = formCtrl.form.attr("name");
                var elmName = elm.attr("name");

                /*转换前端传过来的校验规则*/
                var rule = elm.attr('validate');
                var ruleRpe = rule.replace(/:/g,",");
                var ruleArray = ruleRpe.substr(1,rule.length-2).split(",");

                angular.forEach(ruleArray,function(item,index){
                    if(index % 2 == 0){
                        ngModelCtrl.$setValidity(item, false);
                        elm.after($compile('<div class="error" ng-show="'+ formName +'.'+ elmName +'.$error.'+ item +' && '+ formName +'.formVaild">'+ ruleArray[index + 1] +'</div>')(scope))
                    }
                });
            };

            function matchRule(rules){   //负责匹配校验规则
                var valiDataType = attrs.validateType;/*校验数据类型*/

                for(var rulesName in rules){
                    if(rulesName === valiDataType){
                        injectRule(rulesName,rules[rulesName]);   //注入校验规则
                    }
                }

                if(attrs.equalTo){   //绑定两端
                    injectRule('equalTo',rules['equalTo']);   //注入校验规则
                    equalTo('equalTo',rules['equalTo']);  //注入两端的监听
                }
            };

            function validateItem(validateName,newVal,callback){   //负责校验每个单独元素规则
                var ngModelCtrl = controllers[0];
                var test = callback(newVal,elm);
                if(newVal){
                    ngModelCtrl.$setValidity(validateName, test);
                }else{
                    ngModelCtrl.$setValidity(validateName, true);   //默认为空不校验,让他默认显示空提示
                }
            }

            function injectRule(validateName,callback){   //注入校验规则
               scope.$watch(attrs.ngModel, function(newVal){
                    validateItem(validateName,newVal,callback);
                });
            };

            function equalTo(validateName,callback){  //如密码,确定密码,两端绑定
                var tarElm = angular.element(document.getElementById(attrs.equalTo));
                tarElm.on('keyup', function () {
                    scope.$apply(function(){
                        validateItem(validateName,elm.val(),callback)
                    })
                });

                scope.$on('$destroy',function(){
                    tarElm.off();
                });
            }

            return{
                build : function(rule){
                    validate();
                    matchRule(rule);
                }
            };
        }//validateName,callback

        function validateFns(scope,attrs,controllers){
            return {
                addRule : function(validateMethod){
                    for(var validateName in validateMethod){
                        rule[validateName] = validateMethod[validateName];
                    }
                },
                run : function(elm){
                    var provideFn = provide(scope,elm,attrs,controllers);
                    provideFn.build(rule);
                }
            }
        };

        return validateFns;
    }]).run(['validateFactory',function(validateFactory){
        validateFactory().addRule(angular.validateAddMethod);
    }]).directive('formSubmit', function() {
        return {
            restrict : 'EA',
            require: ['^?formValidate'],
            controller: ['$element',"$attrs", function($element,$attrs) {
                this.formSubmit = $element;
            }],
            link: function (scope, elm, attrs,formController) {
                var form = formController[0].form;
                var formName = form.attr("name");
                elm.on('click',function(){
                    if(scope[formName].$valid){
                        scope[formName].formVaild = false;
                        scope.$eval(attrs.formSubmit);
                    }else{
                        scope[formName].formVaild = true;
                    }
                });

                scope.$on('$destroy', function(){
                    elm.off('click');
                });
            }
        }
    }).directive('formValidate', function() {
        return {
            restrict: 'EA',
            require: ['^?formSubmit'],
            controller: ['$element', "$attrs", function ($element, $attrs) {
                this.form = $element;
            }],
            link : function(scope, elm, attrs) {
                elm.attr('novalidate',true);
            }
        }
    }).directive('validate', ['$compile','$timeout','validateFactory',function($compile,$timeout,validateFactory) {
        return {
            restrict : 'EA',
            require: ['ngModel','^?formValidate'],
            link : function(scope, elm, attrs,controllers) {
                validateFactory(scope,attrs,controllers).run(elm)
            }
        }
    }])
}());

//var repeat = angular.element(document.getElementById(elm.attr("repeat")));
//repeat.on('keyup', function () {
//    repeatVal = this.value;
//    repeatFn();
//});
//scope.$watch(attrs.ngModel, function(newVal,lat){
//    tarVal = newVal || '';
//    repeatFn();
//});



;
/**
 * Created by chenmingkang on 16/3/11.
 *
 * 这里是校验公众的数据类型
 */

;(function(angular){
    angular.validateAddMethod = {
        phone : function(newVal){  //验证手机
            var res = new RegExp(/^1[3578][0-9]{9}$/);
            return newVal && res.test(newVal);
        },
        number : function(newVal){ //验证是否数字
            var res = new RegExp(/^[0-9]*$/);
            return newVal && res.test(newVal);
        },
        equalTo : function(newVal,$elm){ //两端绑定
            var tarElm = function(){
                var id = $elm.attr('equal-to');
                return document.getElementById(id);
            }();
            return tarElm.value == newVal;
        }
    };
})(angular);


//rule.phone = function(){
//    var res = new RegExp(/^1[3578][0-9]{9}$/);
//    scope.$watch(attrs.ngModel, function(newVal,lat){
//        if(!!newVal && newVal.length){
//            if(res.test(newVal)){
//                ngModelCtrl.$setValidity('phone', true);
//            }else{
//                ngModelCtrl.$setValidity('phone', false);
//            }
//        }else{
//            ngModelCtrl.$setValidity('phone', true);
//        }
//    });
//};
//rule.number = function(){
//    var res = new RegExp(/^[0-9]*$/);
//    scope.$watch(attrs.ngModel, function(newVal,lat){
//        if(!!newVal && newVal.length){
//            if(res.test(newVal)){
//                ngModelCtrl.$setValidity('number', true);
//            }else{
//                ngModelCtrl.$setValidity('number', false);
//            }
//        }else{
//            ngModelCtrl.$setValidity('number', true);
//        }
//    })
//},
//    rule.repeat = function(){
//        var repeat = angular.element(document.getElementById(elm.attr("repeat")));
//        var repeatVal = '';
//        var tarVal = '';
//        function repeatFn(){
//            if(tarVal.length > 0){
//                if(repeatVal == tarVal){
//                    ngModelCtrl.$setValidity('repeatMessage', true);
//                }else{
//                    ngModelCtrl.$setValidity('repeatMessage', false);
//                }
//            }else{
//                ngModelCtrl.$setValidity('repeatMessage', true);
//            }
//        };
//
//        repeat.on('keyup', function () {
//            repeatVal = this.value;
//            repeatFn();
//        });
//        scope.$watch(attrs.ngModel, function(newVal,lat){
//            tarVal = newVal || '';
//            repeatFn();
//        });
//    };
/**
 * Created by chenmingkang on 16/3/1.
 *
 * 重写浏览器回退功能,存储在session Storage,校验哪些页面需要登录
 *
 * validataUrl  需要验证的url
 * validateErrorHref  验证不通过要跳转的url
 * cookieName    需要校验登录的cookie
 * maxLengt     session 里面存储的最大值
 * prefix     前缀,如果采用html5Model的开发模式就为'',不是的话#
 * prevEmpty  如果上一页不存在的话就给他返回首页
 */
;(function(){
    'use strict';
    angular.module('cz-history',[]).provider('historyConfig',function(){

        this.options = {
            validataUrl : [],
            validateErrorHref : '',
            cookieName   : '',
            maxLengt     : 50,
            prefix       : '#',
            prevEmpty    : '/index'
        };

        this.$get = function() {
            var options = this.options;
            return {
                getOptions: function() {
                    return options;
                }
            };
        };
        this.setOptions = function(options) {
            angular.extend(this.options, options);
        };

    }).run(['historyFactory',function(historyFactory){
        historyFactory.autoHash();
    }]).factory('historyFactory',['$rootScope','cookieFactory','historyConfig', function($rootScope,cookieFactory,historyConfig) {
            var o = historyConfig.getOptions();
            var paths = [];
            var isBack = true;
            var isOne = true;

            var sessionFns = {
                getPaths : function(){   // 获取session
                    var getPaths = [];
                    var session = sessionStorage.getItem("b_paths");
                    if(session){
                        getPaths = session.split("[path]");
                    }
                    return getPaths;
                },
                setSession : function(){    //设置session
                    sessionStorage.setItem("b_paths", paths.join("[path]"));
                },
                getCookie : function() {    //获取cookie
                    return cookieFactory.getCookie(o.cookieName);
                }
            };

            var testFns = {
                oldEqualNew : function (oldUrl,newUrl){   //判断2个url是不是相等,后期扩展
                    return decodeURIComponent(oldUrl) == decodeURIComponent(newUrl);
                },
                vaildate : function (hash){    //判断url是否在验证规则里面里面
                    var oldURL = (hash || location.hash).split('#')[1];  //截取＃号后面的
                    var inValidataUrl = false;

                    o.validataUrl.forEach(function(item){
                        if(oldURL.indexOf(item) > -1){
                            inValidataUrl = true;
                        }
                    });
                    return inValidataUrl;
                }
            };


            function go(path){   //跳转页面
                sessionFns.setSession();
                setTimeout(function(){
                    location.href = path || o.prefix + o.prevEmpty;
                },0);
            }

            function goBack(){
                var path = o.prefix + paths.pop();
                var notCookie = !sessionFns.getCookie();
                isBack = true;   // 回退操作,设置标记

                if(notCookie && paths.length){    //判断cookie 是否存在
                    for(var i = paths.length;i > 0;i--){   //从后面取值校验是否是登录后的url地址,如果没登录,并且是校验登录页面,就再次循环
                        if(!testFns.vaildate(path)){
                            go(path);
                            return;
                        }
                        path = o.prefix + paths.pop();
                    }
                }
                go(path);
            }

            function autoHash(){
                $rootScope.$on('$locationChangeStart', function(evt, current, previous) {
                    var isEqual = testFns.oldEqualNew(current,previous);   //判断两个上一个url跟下一个url是否相等
                    var oldURL = previous.split('#')[1];  //截取＃号后面的
                    var currentURL = current.split('#')[1];  //截取＃号后面的
                    paths = sessionFns.getPaths();  //sessionData

                    if(!isOne && testFns.vaildate(current) && !sessionFns.getCookie()){  //校验是否在规则里面,并且cookie存在
                        if(o.validateErrorHref === oldURL && !isBack){     //如果validataError跳转地址跟历史纪录一样,并且他不是回退按钮点击,是浏览器自带的回退点击
                            goBack();
                            evt.preventDefault();
                        }else if(currentURL != o.validateErrorHref){   //他不是回退按钮点击,并且当前url跟validataError不一样,还是在验证规则里面,去登录页面
                            location.href = o.prefix + o.validateErrorHref;
                        }
                    }

                    if(!isBack && !isEqual && o.validateErrorHref != oldURL){    //存入历史记录   //登录页面不存储在历史纪录
                        autoStorage(oldURL);
                        return;
                    }
                    isOne = false;
                    isBack = false;
                });
            };


            // 自动存储浏览记录
            function autoStorage(path) {
                var autoPash = path || location.hash;
                if (paths.length == o.maxLengt) {    //最大值的话就移除第一条
                    paths.shift();// 移除第一条路径记录
                }
                angular.forEach(paths,function(item,index){      //匹配相同的移除掉
                    if(item == autoPash){
                        paths.splice(index,1);
                    }
                });
                paths.push(autoPash);
                sessionFns.setSession();
            }

            return {
                autoHash : autoHash,
                back : goBack
            };

        }])
        .directive('back', ['$rootScope', 'historyFactory',function($rootScope, historyFactory) {
        return {
            restrict : 'EA',
            link : function(scope, elm, attrs) {
                scope.$on('$destroy', function(){
                    elm.off('click');
                });
                elm.bind('click',function(){
                    historyFactory.back(attrs.back);
                });
            }
        }
    }]);
}());
;
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
;
/**
 * Created by chenmingkang on 16/3/1.
 */
;(function(){
    'use strict';
    angular.module('cz-message',[]).factory('messageFactory',['$rootScope','$timeout', function($rootScope,$timeout) {
        return function(o){
            var option = {
                time : 4000,
                text:''
            };

            angular.extend(option,o);
            var scope = $rootScope.$new();
            var elm = (function(){
                return document.getElementById('messageTop');
            }());
            var html = '<div class="message-top" id="messageTop">' +
                            '<div class="message-main-lay">'+
                                '<div class="message-main">'+
                                    '<div class="message-bg"></div>'+
                                    '<div class="message-text">'+ option.text +'</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>';
            var elmHtml = angular.element(html);
            if(!elm){
                angular.element(document.body).append(elmHtml[0]);
            }

            //else{
            //    elm.getElementsByClassName('massage-text')[0].innerHTML = option.text;
            //}

            setTimeout(function(){
                elm = null;
                scope.$destroy();
                elmHtml.remove();
                elmHtml = null;
            },option.time);

        }
    }]);
}());
;
/**
 * Created by chenmingkang on 16/3/1.
 */
;(function(){
    'use strict';
    angular.module('cz-open-app',[]).factory('openAppFactory',['$rootScope','confirmFactory',function($rootScope,confirmFactory) {
        var indexUrl = 'zhefengle:m.zhefengle.cn';
        var scope = $rootScope.$new();
        var option = {};
        var ua = navigator.userAgent,
            loadIframe,
            win = window;

        var confirm = {  //设置微信里面跳转APP信息
            text:'亲，请选择要去的地方',
            closeText:'去下载',
            goText:'去app',
            option:{
                close:function(){
                    location.href = option.wxAndroidUrl;
                },
                go:function(){
                    var goHref = encodeURIComponent(option.appurl);
                    location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa6ddfd2bf5f24af7&redirect_uri='+ goHref +'&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect';
                }
            }
        };
        var init = function(){
            option = {
                appurl : indexUrl,
                wxAndroidUrl : "http://a.app.qq.com/o/simple.jsp?pkgname=com.vanwell.module.zhefengle.app",
                androidUrl :  "http://7u2fm4.com1.z0.glb.clouddn.com/084131b4-dc0f-46e0-8bf6-b7cbc6779bda.apk"
            };
        };
        init();

        scope.$on('$destroy', function(){
            init();  //路由跳转都默认设置回去
        });

        function getIntentIframe(){
            if(!loadIframe){
                var iframe = document.createElement("iframe");
                iframe.style.cssText = "display:none;width:0px;height:0px;";
                document.body.appendChild(iframe);
                loadIframe = iframe;
            }
            return loadIframe;
        }

        function getChromeIntent(url){
            return  url;
        }
        var appInstall = {
            isChrome:ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
            isAndroid:ua.match(/(Android);?[\s\/]+([\d.]+)?/),
            timeout:500,
            /**
             * 尝试跳转appurl,如果跳转失败，进入h5url   //appurl于后台对接好的接口,//h5url 没有的时候去下载页面   //wxurl 微信专属跳到应用宝页面
             */
            open:function(){
                var t = Date.now();
                appInstall.openApp(option.appurl);
                setTimeout(function(){
                    if(Date.now() - t < appInstall.timeout+100){
                        appInstall.openH5();
                    }
                },appInstall.timeout)
            },
            openApp:function(){
                if(appInstall.isChrome){
                    if(appInstall.isAndroid){
                        win.location.href = getChromeIntent(option.appurl);
                    }else{
                        win.location.href = option.appurl;
                    }
                }else{
                    getIntentIframe().src = option.appurl;
                }
            },
            openH5:function(){
                win.location.href = option.wxAndroidUrl;
            }
        };


        function setOption(o){
            angular.extend(option,o);
        };

        function open(){

            if($rootScope.browser.v.weixin){
                if(option.appurl == indexUrl){
                    location.href = option.wxAndroidUrl;
                    return;
                }
                confirmFactory(confirm);
            }else{
                if(($rootScope.browser.v.iPhone && $rootScope.browser.v.QQ) || ($rootScope.browser.v.webApp) || ($rootScope.browser.v.weibo)){
                    //messageFactory({text:'该浏览器不支持，请在其他浏览器打开'});
                    location.href = option.wxAndroidUrl;   //跳应用宝
                }else{
                    appInstall.open();
                }
            }
        };

        return function(){
            return{
                setOption : setOption,
                open : open
            }
        }

    }]);
}());
;
/**
 * Created by chenmingkang on 16/3/4.
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
            //console.log(name)
            this.listData[name] = data;
        };

        List.prototype.removeListData = function(name){
            //console.log(name)
            delete this.listData[name];
        };

        List.prototype.removeAllListData = function(){
            this.listData = {};
        };

        List.prototype.getListData = function(name){
            //console.log(this.listData)
            return this.listData[name];
        };
        List.prototype.getAllListData = function(name){
            //console.log(this.listData)
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
                delete scope.datas;
            }
        };

        function addDomData(scope,name){
            var getData;
            if(!scope.datas){
                getData = listDataFn.getListData(name);
                scope.datas = getData;
                console.log(listDataFn.getAllListData());
                console.log(scope.datas)
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
                    var elmOutHeight = 0;
                    var listFn;
                    var scopeWatch;
                    var listDataName = attrs.czScrollDataName || attrs.czScrollDomData.replace(/\./g,"-");
                    var hash = location.hash;
                    //console.log(newScope)

                    function bindScroll(offsetTop){
                        if(hash !== location.hash){
                            return;
                        }
                        if((window.scrollY > (offsetTop + elm[0].offsetHeight)) || (!(offsetTop < $rootScope.bodyInfo.height) && window.scrollY < $rootScope.bodyInfo.height)){
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
}());;
/**
 * Created by chenmingkang on 16/3/1.
 */
;(function(){
    'use strict';
    angular.module('cz-share',[]).factory('shareFactory', ['$rootScope','messageFactory','partnerUrlFactory',function($rootScope,messageFactory,partnerUrlFactory) {
        return function(option){
            var o = {
                title: '', // 分享标题
                desc: '原来国外这么便宜！100%正品保障，抢先下载还能领券哦！', // 分享描述
                link: location.href, // 分享链接
                imgUrl:  partnerUrlFactory.bizChannel ? 'http://m.zhefengle.cn/img/partner/logo.png' : 'http://m.zhefengle.cn/img/logo.png', // 分享图标
                type: '',
                dataUrl: '',
                success: function () {

                },
                cancel: function () {
                    messageFactory({text:'已取消分享'});
                    $scope.$apply();
                }
            };
            angular.extend(o,option);

            if($rootScope.browser.v.weixin){
                wx.ready(function(){
                    wx.onMenuShareAppMessage(o);
                    wx.onMenuShareTimeline(o);
                    wx.onMenuShareQQ(o);
                    wx.onMenuShareWeibo(o);
                });
            }
        };
    }]);
}());;
/**
 * Created by chenmingkang on 16/3/1.
 */
;(function(){
    'use strict';

    angular.module('cz-sideslip-load',[]).directive('sideslipLoad', ['$swipe','$rootScope', '$window', '$timeout','$document',function($swipe,$rootScope, $window, $timeout,$document) {
        /*
         elm.css({
         '-webkit-transition-property':'all',
         '-webkit-transition-duration':0,
         '-webkit-transition-delay':0,
         '-webkit-transition-timing-function':'ease',
         '-webkit-perspective':0,
         '-webkit-backface-visibility': 'hidden',
         '-moz-backface-visibility': 'hidden',
         '-ms-backface-visibility': 'hidden',
         'backface-visibility': 'hidden',
         '-moz-perspective': 0,
         '-ms-perspective': 0,
         'perspective': 0
         })*/
        var touchStartX = 0;
        var touchEndX = 0;
        var touchStartY = 0;
        var touchEndY = 0;
        var aboutDistance = 80;
        var sideSpeed = 50;
        var touchX = 0;
        var touchY = 0;

        var removeTarns = function(elm){
            elm.css({
                '-webkit-transform': ''
            });
        };

        var tarnsform = function(elm){
            if($rootScope.browser.v.ios) {     //效果只能在ios上支持
                elm.css({
                    '-webkit-transform': 'translate3d(' + touchX + 'px, 0px, 0px)',
                    '-moz-transform': 'translate3d(' + touchX + 'px,, 0, 0)',
                    '-ms-transform': 'translate3d(' + touchX + 'px,, 0, 0)',
                    'transform': 'translate3d(' + touchX + 'px,, 0, 0)'
                });
            }
        };

        var toTouches = function(elm,event,model){
            if(!event.touches ||  event.touches.length > 1){   //判断是否一根手指,不是的话定位给他回去
                removeTarns(elm);
                return;
            }

            if(model === 'start' && !elm.hasClass('sides')) {
                elm.addClass("sides");
            }

            if(model === 'move'){
                touchEndX = event.touches[0].clientX;
                touchEndY = event.touches[0].clientY;
                touchX = touchEndX - touchStartX;
                touchY = Math.abs(touchStartY - touchEndY);
                tarnsform(elm);  //ios 里面效果
            }

            if(model === 'end'){
                removeTarns(elm);
                touchStartX = 0;
                touchEndX = 0;
                touchStartY = 0;
                touchEndY = 0;
                touchX = 0;
                touchY = 0;
            }
        };

        return {
            restrict : 'EA',
            link : function(scope, elm, attrs) {
                scope.$on('$destroy', function(){
                    elm.off();
                });

                function touchXTime(evt,event){
                    var absTouch = Math.abs(parseInt(touchX));
                    $timeout(function(){
                        if(absTouch < $rootScope.bodyInfo.width) {
                            touchX = touchX < 0 ? touchX - 10 : touchX + 10;
                            tarnsform(elm,evt,'move');
                            touchXTime(evt, event);
                        }else{
                            if(touchX > aboutDistance){    //横向滚动到80 在触发事件
                                if(!!scope.$eval(attrs.sideslipLoad).prev){
                                    scope.$eval(attrs.sideslipLoad).prev();
                                    elm.addClass('prev-sides');
                                }
                            }else{
                                if(!!scope.$eval(attrs.sideslipLoad).next){
                                    scope.$eval(attrs.sideslipLoad).next();
                                    elm.addClass('next-sides');
                                }
                            }
                            $timeout(function(){
                                elm.removeClass('prev-sides');
                                elm.removeClass('next-sides');
                            },300);
                            toTouches(elm,event,'end');
                        }
                    },2);
                }

                function start(evt,event){
                    touchStartX = evt.x;
                    touchStartY = evt.y;
                    toTouches(elm,evt,'move');   //当点击一次的时候不会出发move事件，touchEndX没值，所以第一次负值
                }

                function move(evt,event){
                    toTouches(elm,event,'move'); //调用move方法给他定位
                    if(touchEndY - touchStartY > 100 || touchEndY - touchStartY < -100){ //如果上滑或者下滑 都100以上  那我就给他还原
                        toTouches(elm,event,'end'); //调用end方法还原
                    }
                }

                function end(evt,event){
                    var absTouch = Math.abs(touchX);
                    if(touchY < 80 && absTouch > aboutDistance){   //如果纵向80以上并且左右距离大于50
                        touchXTime(evt,event);
                    }else{
                        toTouches(elm,event,'end');
                    }
                }

                $swipe.bind(elm, {
                    start:start,
                    move:move,
                    end:end,
                    cancel:function(event){
                        scope.$apply(function() {
                            toTouches(elm,event,'end');
                        });
                    }
                });

            }
        }
    }]);
}());
;
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
}());;
/**
 * Created by chenmingkang on 16/3/1.
 */
;(function(){
    'use strict';
    angular.module('cz-to-load',[]).directive('topLoad',['$rootScope','$document','$window',function($rootScope,$document,$window) {
        return function(scope, elm, attr) {
            if($rootScope.browser.v.weixin){    //判断是否QQ浏览器
                return;
            }
            var touchStart = 0;
            var touchEnd = 0;
            var touchStartX = 0;
            var touchEndX = 0;
            var time;
            var scroll = window.scrollY;
            var windowHeight = $window.innerHeight;
            var upLoad = -50;     //上拉的距离到一定距离在显示下拉刷新
            var unclaspLoad = -80;     //上拉的距离到一定距离在现实松开刷新
            var elmTop = function(elm,start){
                if(touchEnd< upLoad && start == 'move'){
                    elm.css({
                        'margin-top': -(touchEnd / 4) + 'px'
                    });
                    $document.find('body').css({
                        'overflow': 'hidden',
                        height: windowHeight + 'px',
                        '-webkit-overflow-scrolling': 'hidden'
                    })
                }else{
                    elm.css({
                        'margin-top': 0
                    });
                    $document.find('body').css({
                        'overflow-y':'auto',
                        height:'auto',
                        '-webkit-overflow-scrolling': 'touch'
                    })
                }
            };
            elm.bind('touchmove', function(evt) {
                scope.$apply(function() {
                    clearTimeout(time)
                    var event = evt.changedTouches[0];
                    scroll = window.scrollY;
                    if(Math.abs(touchEndX) > 10){   //判断是否侧滑往下啦并且左右滑动，如果是的话，我就让他还原，否则左右还是可以促发下面事件
                        if($rootScope.browser.v.ios){    //在跟左滑又滑一起用的时候有个bug
                            elm.css({
                                '-webkit-transform': ''
                            })
                        }
                        return;
                    }
                    if(scroll == 0 && scope.asyns == false){   //滚动条是0   必须是数据返回回来之后在执行
                        if(!touchStart){   //判断是不是第一次
                            touchStart = event.pageY;
                            touchStartX = event.pageX;
                            return;
                        }
                        touchEnd = touchStart - event.pageY;
                        touchEndX = touchStartX - event.pageX;
                        if(touchEnd > 0){   //如果小于0 代表是往上拉了
                            return;
                        }
                        if(parseInt(elm.css('margin-top')) > 0 && parseInt(elm.css('margin-top')) > upLoad){  //小于这个再给他拉回去
                            scope.upmove = false;
                            scope.loadmove = false;
                            elm.css({
                                'margin-top': -(touchEnd / 4) + 'px'
                            });
                        }
                        if(touchEnd < upLoad) {   //到一定高度在给他下啦
                            if (touchEnd > unclaspLoad) {
                                scope.upmove = true;
                                scope.loadmove = false;
                            } else {
                                scope.upmove = false;
                                scope.loadmove = true;
                            }
                            elmTop(elm,'move');
                        }
                    }
                });
            });

            elm.bind('touchend', function(evt) {
                scope.$apply(function() {
                    scroll = window.scrollY;
                    scope.loadmove = false;
                    scope.upmove = false;
                    elmTop(elm,'end');
                    if(scroll == 0 && scope.asyns == false) {
                        if (touchEnd < 0 && touchEnd <= unclaspLoad) {   //滚动条是0   touchEnd下啦距离要下拉到70高度
                            scope.$eval(attr.topLoad);
                        }
                    }
                    touchStart = 0;
                    touchEnd = 0;
                    touchStartX = 0;
                    touchEndX = 0;
                });
            });

        };
    }]);
}());
;
/**
 * Created by chenmingkang on 16/3/1.
 */

;(function(){
    'use strict';

    angular.module('cz-type-sort',[])
        .directive('typeSort', ['$window', '$timeout','$compile',function($window, $timeout,$compile) {
            function getEleUl(){
                return document.getElementById('type-sort-text');
            }
            return {
                restrict : 'EA',
                replace : false,
                link : function(scope, elm, attrs) {
                    $timeout(function(){
                        var itemChid;
                        var typeDiv = document.getElementsByClassName("hot-title");
                        var forTargetDiv = document.getElementById(elm.attr('for-target-id'));

                        var template = '<div class="type-sort-text {{typeSortTexe ? \'show\' : \'\'}}" id="type-sort-text"><div class="bj"></div><h1 class="text">{{typeSortTexe}}</h1></div>';
                        var getElm = getEleUl();
                        if(!getElm){
                            angular.element(document.getElementsByTagName('body')).append($compile(template)(scope));
                            getElm = getEleUl();
                            scope.$apply();
                        }

                        var move = function(evt,model){
                            scope.$apply(function(){
                                var offsetTop = parseInt(elm.attr('offset-top')) || 0;
                                var parOffsetTop = parseInt(elm.attr('par-offset-top')) || 0;
                                var elmLi = elm.find("li");
                                var evtY = 0;

                                if(model == 'end'){
                                    scope.typeSortTexe = '';
                                    evt.preventDefault();
                                    return false;
                                }

                                evtY = (evt.y || evt.touches[0].clientY) + parOffsetTop;  //toucheEnd的时候evt.y || evt.touches[0].clientY都不存在

                                angular.forEach(elmLi,function(item,index){
                                    if((evtY - offsetTop >= item.offsetTop) && evtY <= item.offsetTop + evtY){   //算出他距离顶部的距离＋上高度
                                        itemChid = item;
                                    }
                                });
                                //if((evt.y || evt.touches[0]) < itemChid.offsetHeight + itemChid.offsetTop){
                                angular.forEach(typeDiv,function(item,index){
                                    if(item.textContent == itemChid.textContent){
                                        if(item.offsetTop > 0 || index == 0){
                                            if(forTargetDiv){
                                                forTargetDiv.scrollTop = item.offsetTop
                                            }else{
                                                $window.scrollTo(0,item.offsetTop);
                                            }
                                        }
                                        scope.typeSortTexe = itemChid.textContent;
                                    }
                                });
                                //}
                                evt.preventDefault();
                            });
                        };

                        scope.$on('$destroy', function(){
                            elm.off();
                            angular.element(getElm).remove();
                            getElm = null;
                            scope.typeSortTexe = '';
                        });

                        elm.bind('touchstart', function(evt) {
                            move(evt,'start')
                        }).bind('click', function(evt) {
                            move(evt,'start')
                        }).bind('touchmove', function(evt) {
                            move(evt,'move')
                        }).bind('mousemove', function(evt) {
                            move(evt,'move')
                        }).bind('touchend', function(evt) {
                            move(evt,'end')
                        }).bind('mouseout', function(evt) {
                            move(evt,'end')
                        });
                    },0)
                }
            }
        }]);
}());
