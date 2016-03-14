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
