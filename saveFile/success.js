// ==UserScript==
// @name         test success
// @version      0.1
// @description  try to take over the world!
// @author       skypesky
// @include      http*://workwebsite/*
// @include      http*://www.google.com/*
// @include      http*://www.hao123.com/*
// @grant        GM_setClipboard 
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.js
// ==/UserScript==
(function () {
    'use strict';

    document.write("we can success!");
    GM_setClipboard("you are success!");    
    GM_setClipboard("you are success!");
})();