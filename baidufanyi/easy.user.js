// ==UserScript==
// @name         [skypesky 出品] 百度翻译助手
// @namespace    http://www.skypesky.cn/userjs/search_subtitle_for_douban
// @version      18.08.16
// @description  目前只支持电影搜索,后续会加入更多功能
// @author       skypesky
// @include      *://fanyi.baidu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @license Apache-2.0
// @connect      *

// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// ==/UserScript==

(function () {
    let key = "name";
    console.log(GM_getValue(key));
    console.log(GM_setValue(key, "张三"));
    console.log(GM_getValue(key));
    $(function () {
        // 当你按下enter的时候
        $(document).keyup(function (event) {
            if (event.keyCode == 13) {
                setTimeout(function () {
                    $(".input-operate .icon-sound").trigger("click");
                }, 500);
            }
        });
    });


})();