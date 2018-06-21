// ==UserScript==
// @name         douban
// @namespace    http://skypesky.cn/greasyfork/doubanSearch
// @version      0.1
// @description  try to take over the world!
// @author       skypesky
// @match        http*://www.douban.com/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// ==/UserScript==

(function () {
    'use strict';

    $(function () {
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://www.skypesky.cn:8080/test",
            responseType: "json",            
            onload: function (res) {
                console.log(res);
                console.log(res.responseText);
                let json = res.responseText;
                json = JSON.parse(json);
                console.log(typeof json);
                console.log(json);
            }
        })
    });

})();