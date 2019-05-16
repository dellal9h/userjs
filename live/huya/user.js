// ==UserScript==
// @name         [skypesky 出品]虎牙直播
// @namespace    http://www.skypesky.cn/userjs/live/huya
// @version      18.06.01
// @description  search subtitle for icheckmovies
// @author       skypesky
// @license Apache-2.0
// @include      http*://www.huya.com/feiduan1520
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// ==/UserScript==

(function () {
    "use strict"

    const HuyaLive = {
        sendMessage: function () {
            console.error("area");
            $("textarea#pub_msg_input").val("556");
            $("span#msg_send_bt").trigger("click");
        }
    }

    $(function () {
        for (let i = 0; i < 10; i++) {
            HuyaLive.sendMessage();
        }
    });

})();