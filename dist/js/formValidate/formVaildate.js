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



