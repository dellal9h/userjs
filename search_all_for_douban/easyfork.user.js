// ==UserScript==
// @name         [skypesky 出品]豆瓣助手
// @namespace    http://www.skypesky.cn/userjs/search_subtitle_for_douban
// @version      18.06.21
// @description  目前只支持电影搜索,后续会加入更多功能
// @author       skypesky
// @include      http*://movie.douban.com/subject/*
// @grant        GM_xmlhttpRequest
// @updateURL https://greasyfork.org/scripts/369682-skypesky-%E5%87%BA%E5%93%81-%E8%B1%86%E7%93%A3%E5%8A%A9%E6%89%8B/code/%5Bskypesky%20%E5%87%BA%E5%93%81%5D%E8%B1%86%E7%93%A3%E5%8A%A9%E6%89%8B.user.js

// ==========================connect===========================
// @connect      *

// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// ==/UserScript==

// 全局变量
const config = {
    keyword: `#keyword#`,
    showLength: 5
};


(function () {

    'use strict';

    // 影片资源
    const VideoResourceList = [{
            name: `RS05`,
            url: `http://www.rs05.com/search.php?s=${config.keyword}`,
            successElement: `#movielist .pure-g`
        },
        {
            name: `看天堂`,
            url: `http://www.kantiantang.com/search?text=${config.keyword}`,
            successElement: `.col-md-8 .page-header`
        },
        {
            name: `电影天堂`,
            url: `http://www.iloldytt.cc/search.html?title=${config.keyword}`,
            successElement: `browse-inner .img-responsive`,
        },
        {
            name: `青苹果影院`,
            url: `https://www.qpg123.com/search/?wd=${config.keyword}`,
            successElement: `img.lazy`
        },
        {
            name: `迅影网`,
            url: `http://www.xunyingwang.com/search?q=${config.keyword}`,
            successElement: `.img-thumbnail`
        },
        {
            name: `BD影视`,
            url: `http://www.bd-film.co/search.jspx?q=${config.keyword}`,
            successElement: `.list-item`
        }
    ];

    // 字幕资源
    const SubtitleResourceList = [{
            name: `aaa字幕`,
            url: ``,
            successElement: ``
        },
        {
            name: `bbb字幕`,
            url: `zsc`,
            successElement: ``
        }
    ];

    // 作用的网站
    const WebsiteList = [{
        name: `豆瓣网站`,
        url: ``,
        rule: /test/,
        enable: true
    }];

    $(function () {
        Server.run(WebsiteList);
    });

})();


const Resource = {

    // 未替换的搜索链接
    _originUrl = ``,
    // 搜索资源的关键字
    _keyword = ``,
    // 资源检索成功的元素的选择器
    _successSelector = ``,
    // 真实的地址
    _realUrl = ``,

    /**
     ** @desc: 初始化参数
     ** @param: originUrl => 未替换的搜索链接
     **         keyword => 查询的关键字
     **         successSelector => 资源检索成功的元素的选择器
     ** 
     */
    init: function (originUrl, keyword, successSelector) {
        this._originUrl = originUrl;
        this._keyword = keyword;
        this._successSelector = successSelector;
    },

    /**
     ** @desc: 检测资源是否存在,存在返回true,不存在返回false
     ** @param: selector => 选择器
     **         responseText => 响应的html文本信息
     ** @return: 资源存在返回true,否则否则返回false
     */
    exist: function (responseText) {
        return $(this._successSelector, responseText).length > 0;
    },

    /**
     ** @desc: 通过替换字符串,获取真实的查询网址
     ** @param:
     ** @return: 返回真实的查询网址
     */
    getRealUrl: function () {
        this._realUrl = this._originUrl.replace(config.keyword, this._keyword);
        return this._realUrl;
    },

    /**
     ** @desc: 检索资源,检索成功返回真实链接,检索失败返回null 
     ** @param: callback => 回调函数的地址引用
     ** @return: 
     */
    search: function (callback) {
        GM_xmlhttpRequest({
            method: `GET`,
            url: this._realUrl,
            data: {
                title: this._keyword
            },
            onload: (result) => {
                // 回调函数
                callback(result);
            }
        });
    }

};



const Server = {
    videoSearchList: [],
    title: null,
    //计数器
    count: 0,
    run: function (ResourceList) {
        // 初始化计数器
        this.count = 0;
        // get title
        this.title = this.getTitle();

        for (let i = 0; i < ResourceList.length; ++i) {
            this.getData(ResourceList[i]);
        }

        let task = setInterval(() => {
            if (this.count == ResourceList.length) {
                if (this.videoSearchList.length > 0) {
                    this.addStyle(this.videoSearchList);
                    clearInterval(task);
                } else {
                    this.addEmptyStyle("抱歉,这部电影未找到适配的下载源!");
                }
            }
        }, 50);

    },
    // 查找成功,返回true,否则返回false
    searchSuccess: (success, responseText) => {
        return $(success.selector, responseText).length > 0;
    },
    // 获取电影名称
    getTitle: function () {
        return $(`#content > h1 > span:nth-child(1)`).text().split(` `)[0];
    },
    // 添加样式
    addStyle: function (data) {

        let table = `<br /><hr style="border: 1px solid #e5e5e5" />`;

        table += `<table style='text-align: center; padding: 14px; width: 100%;'>`;

        for (let i = 0; i < data.length; i = i + config.showLength) {

            table += `<tr>`;

            for (let j = i; j < i + config.showLength && data[j]; ++j) {
                table += `<td><a href='${data[j].link}' target='_blank'>${data[j].name}</td>`;
            }

            table += `</tr>`;
        }

        table += `</table>`;
        table += `<hr style="border: 1px solid #e5e5e5" /><br />`;

        $(`.subjectwrap`).after(table);

    },
    addEmptyStyle: function (message) {
        let table = `<br /><hr style="border: 1px solid #e5e5e5" />`;
        table += `<p>${message}</p>`;
        table += `<hr style="border: 1px solid #e5e5e5" /><br />`;
        $(`.subjectwrap`).after(table);
    },
    getData: function (value) {
        let _this = this;
        // 获取跳转链接
        let link = value.url.replace(config.keyword, this.title);
        console.log(`link is ${link}`);
        GM_xmlhttpRequest({
            method: `GET`,
            url: link,
            data: {
                title: this.title
            },
            onload: (res) => {
                this.callback(value, link, res);
            }
        });
    },
    callback: function (value, link, res) {
        // 查询成功
        if (this.searchSuccess(value.success, res.responseText)) {
            // 添加有效的资源到队列尾部
            this.videoSearchList[this.videoSearchList.length] = {
                link: link,
                name: value.name
            };
        }
        // 计数器+1
        ++this.count;
    }
}

// 验证工具类
const Validate = {
    /*
     ** @desc: 验证对象
     ** @param: object
     ** @return: object不为null且不为undefined时返回true,否则返回false
     */
    checkObject: function (object) {
        if (!object || object == undefined) {
            return false;
        }
        return true;
    }
}