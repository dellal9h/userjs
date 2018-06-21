// ==UserScript==
// @name         闲鱼助手 淘宝闲鱼
// @author:      skypesky
// @namespace    http://skyepsky.cn/openJs/fallowFish
// @version      18.05.25
// @description  [skypesky 出品]闲鱼助手 完美去除广告+搜索框

// @license Apache-2.0

// @grant        none

// @include      http*://2.taobao.com/*
// @include      http*://s.2.taobao.com/*

// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js

// @update       2018-05-12 隐藏首页的广告
// @update       2018-05-11 创建
// ==/UserScript==

(function () {
    'use strict';
    
    var targetList = [
        ".guide-img",
        'img[alt="Scan me!"]',
        '.close-img',
        ".download-layer",
    ];

    // 添加搜索框
    addSearchBox();

    // 这段函数每次执行都会触犯添加元素的事件,在body里面寻找节点会更加完美
    $('body').on('DOMNodeInserted', function (event) {
        for (var i = 0; i < targetList.length; ++i) {
            var removeElement = $('body').find(targetList[i]);
            if ($(removeElement).length > 0) {
                console.log($(removeElement));
                console.log("成功了: " + targetList[i]);
                $(removeElement).remove();
                // 删除元素
                targetList.splice(i, 1);
            }
        }
    });
   
})();

// 获取搜索框
function addSearchBox() {
    // 创建元素
    var element = $("<div class='idle-search'><form method='get' action='//s.2.taobao.com/list/list.htm' name='search' target='_top'><input class='input-search' id='J_HeaderSearchQuery' name='q' type='text' value='' placeholder='搜闲鱼' /><input type='hidden' name='search_type' value='item' autocomplete='off' /><input type='hidden' name='app' value='shopsearch' autocomplete='off' /><button class='btn-search' type='submit'><i class='iconfont'>&#xe602;</i><span class='search-img'></span></button></form></div>");

    // 添加到元素中
    $('.idle-header').append(element);
}
