// ==UserScript==
// @name         copy text
// @namespace    http://tampermonkey.net/
// @version      18.06.08
// @description  try to take over the world!
// @author       skypesky
// @include      http*://workwebsite/*
// @include      http*://modwars.com/paid/sec/ships/fly.jsp*
// @grant        GM_setClipboard 
// @grant        GM_registerMenuCommand
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.js
// test user Süssesgirl password mia070813
// ==/UserScript==

(function () {
    'use strict';

    const config = {
        "delayTime": 2500
    };

    const website = {
        "url": "http://modwars.com/paid/sec/ships/fly.jsp",
        "shipId": "13359609",
        "ownPlant": "0",
        "destination": {
            "startPageNumber": 10,
            "endPageNumber": 20
        },
        "scan": "Anpeoilen"
    };

    $(function () {
        UserConfig.clearCache();

        setTimeout(function () {
            Server.run(website);
        }, config.delayTime);
    });
})();

const Server = {
    run: function (website) {
        this.showInfo();
        if (!this.isStart()) {
            console.log(" !this.isStart()");
            console.log(this.isStart());
            this.saveTextToPhone();
            let urlList = JSON.parse(this.getItem('urlList'));

            if (this.isEnd(urlList)) {
                console.log(`urlList is empty`);
                let result = this.getItem("text");
                GM_setClipboard("ok?");
                GM_setClipboard(result);
                alert("you are success!");
                this.clearAll();
                return;
            }
            let url = this.getNextUrl(urlList);
            this.deleteOne(urlList);
            window.location.href = url;

        } else {
            this.setItem('text', null);
            console.log(" just.isStart()");
            this.setItem('started', true);
            let urlList = this.createUrlList(website);
            let url = this.getNextUrl(urlList);
            this.deleteOne(urlList);
            window.location.href = url;
        }
    },
    saveTextToPhone: function () {
        console.log("save text success");
        let text = this.getText();
        let saveText = this.getItem('text');
        saveText += text;
        console.log(saveText);
        this.setItem('text', saveText);
    },
    getText: function () {
        return $('body').text();
    },
    createUrlList: function (website) {
        let urlList = [];
        console.log(website.destination.endPageNumber - website.destination.startPageNumber);
        for (let i = website.destination.startPageNumber; i <= website.destination.endPageNumber; ++i) {
            let url = website.url + "?shipId=" + website.shipId + "&ownPlant=" + website.ownPlant + "&destination=" + i + "&scan=" + website.scan;
            console.log(i - website.destination.startPageNumber);
            urlList[i - website.destination.startPageNumber] = url;
        }
        console.log(urlList);
        console.log(typeof urlList);
        return urlList;
    },
    getNextUrl: function (urlList) {
        let url = urlList[0];
        return url;
    },
    setItem: function (key, value) {
        if (typeof (Storage) !== 'undefined') {
            window.localStorage.setItem(key, value);
        } else {
            console.log('sry, the browser can not support Storage!');
            $.cookie(key, value, { path: '/' });
        }
    },
    getItem: function (key) {
        if (typeof (Storage) !== 'undefined') {
            return window.localStorage.getItem(key);
        } else {
            console.log('sry, the browser can not support Storage!');
            return $.cookie(key);
        }
    },
    deleteOne: function (urlList) {
        urlList.shift();
        this.setItem('urlList', JSON.stringify(urlList));
    },
    isStart: function () {
        return (this.getItem('started') != "true");
    },
    isEnd: function (urlList) {
        return (urlList.length == 0);
    },
    clearAll: function () {
        this.setItem('urlList', null);
        this.setItem('started', null);
        this.setItem('text', "");
    },
    showInfo: function () {
        console.log("=========================================================");
        console.log(this.getItem('urlList'));
        console.log(this.getItem('started'));
        console.log(this.getItem('text'));
        console.log("=========================================================");
    }
};

const UserConfig = {
    clearCache: function () {
        GM_registerMenuCommand("clear cache", function () {
            let selectValue = confirm("clear userConfig ?");
            if (selectValue) {
                Server.clearAll();
            } else {
                return;
            }
        });
        return this;
    }
};