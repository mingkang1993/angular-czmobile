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
