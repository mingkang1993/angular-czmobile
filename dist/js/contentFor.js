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
