/**
 * Created by chenmingkang on 16/3/8.
 */
var browser = function(){
    return {
        v : (function(){
            var u = navigator.userAgent, app = navigator.appVersion, p = navigator.platform,ua = u.toLowerCase();
            return {
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1, //android终端
                iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                weixin: u.indexOf('MicroMessenger') > -1, //是否微信
                webApp: u.indexOf('Safari') == -1, //是否web应用程序，没有头部与底部
                UCB: u.match(/UCBrowser/i) == "UCBrowser",
                QQB: u.match(/MQQBrowser/i) == "MQQBrowser",  //安卓QQ客户端包括QQ浏览器
                QQ: u.match(/QQ/i) == "QQ",  //iosQQ客户端内盒
                androidQQ: u.match(/YYB_D/i) == "YYB_D",  //安卓QQ客户端内盒
                win: p.indexOf('Win') > -1,//判断是否是WIN操作系统
                mac: p.indexOf('Mac') > -1,//判断是否是Mac操作系统
                weibo:ua.match(/weibo/i) == "weibo",
                zhefengle:ua.match(/zhefengle/i) == 'zhefengle', //判断是否是自己app
                ios9: /(iPhone|iPad|iPod).* OS 9_\d/.test(u) && !/Version\/9\./.test(u)
            };
        })()
    };
}();