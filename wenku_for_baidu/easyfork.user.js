// ==UserScript==
// @name         百度文库助手
// @namespace    http://tampermonkey.net/
// @version      2018.06.22
// @description  try to take over the world!
// @author       skypesky
// @include      http*://wenku.baidu.com/view/*
// @grant        GM_setClipboard
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// ==/UserScript==
const id = `.reader-word-layer`;
(function () {
    'use strict';

    $(window).on("load", function (event) {
        $(window).scroll(function (event) {
            test();
        });
    });

    function test() {
        let text = $(id).text();
        GM_setClipboard(text);
    }
})();