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
}());