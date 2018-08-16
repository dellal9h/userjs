// ==UserScript==
// @name         copy text
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       skypesky
// @include      http*://workwebsite/*
// @include      http*://modwars.com/paid/sec/ships/fly.jsp*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.js
// ==/UserScript==

(function () {
    'use strict';

    const website = {
        "url": "http://modwars.com/paid/sec/ships/fly.jsp",
        "shipId": "13359609",
        "ownPlant": "0",
        "destination": {
            "startPageNumber": 23,
            "endPageNumber": 32
        },
        "scan": "Anpeoilen"
    };

    $(function () {
        setTimeout(function () {
            Server.run(website);
        }, 3000);
    });
    // localStorage.setItem('urlList', null);localStorage.setItem('started', null);
    // localStorage.getItem('urlList');
    // Süssesgirl  Pw: mia070813
})();

var Server = {

    // run function
    run: function (website) {

        this.showInfo();

        // started
        if (!this.isStart()) {

            console.log(this.isStart());
            console.log(" !this.isStart()")
            // save text
            this.saveTextToPhone();
            let urlList = JSON.parse(this.getItem('urlList'));

            if (this.isEnd(urlList)) {
                console.log(`urlList is empty`)
                document.write(this.getItem('text'));
                this.clearAll();
                return;
            }
            // continue run
            let url = this.getNextUrl(urlList);
            this.deleteOne(urlList);
            // jump url
            window.location.href = url;

        } else { // just start 
            this.setItem('text', null);
            console.log(" just.isStart()")
            // mark started tag
            this.setItem('started', true);
            // get urlList
            let urlList = this.createUrlList(website);
            let url = this.getNextUrl(urlList);
            this.deleteOne(urlList);
            // jump url            
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
        // save urlList
        return url;
    },
    setItem: function (key, value) {
        // use html localStorage to save date
        if (typeof (Storage) !== 'undefined') {
            // use localStorage
            window.localStorage.setItem(key, value);
        } else {
            // use cookie
            console.log('sry, the browser can not support Storage!');
            $.cookie(key, value, { path: '/' });
        }
    },
    getItem: function (key) {
        // get date from Storage
        if (typeof (Storage) !== 'undefined') {
            // use localStorage
            return window.localStorage.getItem(key);
        } else {
            // use cookie
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
    },
    showInfo: function () {
        console.log("=========================================================");
        console.log(this.getItem('urlList'));
        console.log(this.getItem('started'));
        console.log("=========================================================");
    }
};