// ==UserScript==
// @name         test text
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       skypesky
// @include      http*://www.hao123.com/*
// @include      http*://workwebsite/*
// @include      http*://modwars.com/paid/sec/ships/fly.jsp*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.js
// ==/UserScript==
$(function(){

    "use strict"

    alert(document.execCommand('copy'));

})();