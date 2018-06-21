// ==UserScript==
// @name         闲鱼助手 淘宝闲鱼(隐藏首页的广告)
// @author:      skypesky
// @namespace    http://skyepsky.cn/fallowFish
// @version      18.05.25
// @description  闲鱼助手 完美去除广告+搜索框

// @updateURL    https://greasyfork.org/scripts/367805-%E9%97%B2%E9%B1%BC%E5%8A%A9%E6%89%8B-%E6%B7%98%E5%AE%9D%E9%97%B2%E9%B1%BC-%E9%9A%90%E8%97%8F%E9%A6%96%E9%A1%B5%E7%9A%84%E5%B9%BF%E5%91%8A/code/%E9%97%B2%E9%B1%BC%E5%8A%A9%E6%89%8B%20%E6%B7%98%E5%AE%9D%E9%97%B2%E9%B1%BC(%E9%9A%90%E8%97%8F%E9%A6%96%E9%A1%B5%E7%9A%84%E5%B9%BF%E5%91%8A).user.js

// @include      http*://2.taobao.com/*
// @include      http*://s.2.taobao.com/*

// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js

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
