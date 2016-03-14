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
