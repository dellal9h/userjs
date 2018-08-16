// ==UserScript==
// @name         [skypesky 出品]豆瓣助手
// @namespace    http://www.skypesky.cn/userjs/search_subtitle_for_douban
// @version      18.06.01
// @description  目前只支持电影搜索,后续会加入更多功能
// @author       skypesky
// @include      http*://movie.douban.com/subject/*
// @grant        GM_xmlhttpRequest
// @license Apache-2.0
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
    const videoResourceList = [{
            name: `RS05`,
            description: `RS05(视频)`,
            url: `http://www.rs05.com/search.php?s=${config.keyword}`,
            successSelector: `#movielist .pure-g`,
            type: `video`,
            typeName: `视频下载`
        },
        {
            name: `看天堂`,
            description: `看天堂(视频)`,
            url: `http://www.kantiantang.com/search?text=${config.keyword}`,
            successSelector: `.col-md-8 .page-header`,
            type: `video`,
            typeName: `视频下载`
        },
        {
            name: `电影天堂`,
            description: `电影天堂(视频)`,
            url: `http://www.iloldytt.cc/search.html?title=${config.keyword}`,
            successSelector: `browse-inner .img-responsive`,
            type: `video`,
            typeName: `视频下载`
        },
        {
            name: `青苹果影院`,
            description: `青苹果影院(视频)`,
            url: `https://www.qpg123.com/search/?wd=${config.keyword}`,
            successSelector: `img.lazy`,
            type: `video`,
            typeName: `视频下载`
        },
        {
            name: `迅影网`,
            description: `迅影网(视频)`,
            url: `http://www.xunyingwang.com/search?q=${config.keyword}`,
            successSelector: `.img-thumbnail`,
            type: `video`,
            typeName: `视频下载`
        },
        {
            name: `BD影视`,
            description: `BD影视(视频)`,
            url: `http://www.bd-film.co/search.jspx?q=${config.keyword}`,
            successSelector: `.list-item`,
            type: `video`,
            typeName: `视频下载`
        }
    ];

    // 字幕资源
    const subtitleResourceList = [{
        name: `字幕库`,
        url: `https://www.zimuku.cn/search?q=${config.keyword}`,
        description: `字幕库(字幕)`,
        successSelector: `.tborder2`,
        type: `subtitle`,
        typeName: `字幕`
    }];

    // 运行在哪个网站?
    const websiteConfigList = [{
        name: `豆瓣电影频道网站`,
        description: `豆瓣网 | 查找电影,电视剧`,
        url: `http*://movie.douban.com/subject/*`,
        rule: /\/\/movie.douban.com\/subject\/*/,
        resourceList: [
            videoResourceList
        ],
        keywordSelector: `#content > h1 > span:nth-child(1)`,
        showView: {
            selector: `.subjectwrap`,
            position: `after`
        }
    }];

    $(function () {
        Controller.run(websiteConfigList);
    });

})();


// 对于resource来说,拿到应有的属性,就可以获得结果,通过回调函数或者返回结果进行下一步处理
function Resource() {
    // 未替换的搜索链接
    this._originUrl = ``,
        // 搜索资源的关键字
        this._keyword = ``,
        // 资源检索成功的元素的选择器
        this._successSelector = ``,
        // 真实的地址
        this._realUrl = ``
}

/**
 ** @desc: 初始化参数
 ** @param: originUrl => 未替换的搜索链接
 **         keyword => 查询的关键字
 **         successSelector => 资源检索成功的元素的选择器
 ** 
 */
Resource.prototype.init = function (originUrl, keyword, successSelector) {
    this._originUrl = originUrl;
    this._keyword = keyword;
    this._successSelector = successSelector;
    // 获取真实要访问的地址
    this.getRealUrl();
};

/**
 ** @desc: 检测资源是否存在,存在返回true,不存在返回false
 ** @param: selector => 选择器
 **         responseText => 响应的html文本信息
 ** @return: 资源存在返回true,否则否则返回false
 */
Resource.prototype.exist = function (responseText) {
    return $(this._successSelector, responseText).length > 0;
};

/**
 ** @desc: 通过替换字符串,获取真实的查询网址
 ** @param:
 ** @return: 返回真实的查询网址
 */
Resource.prototype.getRealUrl = function () {
    this._realUrl = this._originUrl.replace(config.keyword, this._keyword);
    return this._realUrl;
}

/**
 ** @desc: 检索资源,检索成功返回真实链接,检索失败返回null 
 ** @param: callback => 回调函数的地址引用
 ** @return: 
 */
Resource.prototype.search = function (callback) {
    GM_xmlhttpRequest({
        method: `GET`,
        url: this._realUrl,
        data: {
            title: this._keyword
        },
        onload: (result) => {
            // 回调函数
            callback(result, this.exist(result.responseText));
        }
    });
}


const ServerController = {
    _websiteConfig: null,
    _keyword: ``,
    // 初始化配置
    init: function (websiteConfig) {
        this._websiteConfig = websiteConfig;
        // 要查询的关键字
        this.getKeyword();
    },
    // 运行
    run: function () {

        // 查询成功后的资源列表
        let successResourceList = [];

        // 已查询的数目
        let searchNumber = 0;
        // 总共需要查询的数目
        let totalNumber = 0;

        // 查询
        for (let i = 0; i < this._websiteConfig.resourceList.length; ++i) {
            // 统计总数
            totalNumber += this._websiteConfig.resourceList[i].length;
            for (let j = 0; j < this._websiteConfig.resourceList[i].length; ++j) {
                let resource = new Resource();
                // 初始化资源属性
                resource.init(this._websiteConfig.resourceList[i][j].url, this._keyword, this._websiteConfig.resourceList[i][j].successSelector);
                // 查询
                resource.search((result, flag) => {
                    searchNumber++;
                    if (flag) { //查询成功
                        console.log("search success!");
                        successResourceList.push({
                            description: this._websiteConfig.resourceList[i][j].description,
                            link: resource.getRealUrl(),
                            type: this._websiteConfig.resourceList[i][j].type,
                            typeName: this._websiteConfig.resourceList[i][j].typeName
                        });
                    }
                });
            }
        }

        // 检测查询是否全部完成
        let task = setInterval(() => {
            // 全部查询完成,显示查询结果,关闭定时器
            if (searchNumber == totalNumber) {
                console.log(`search success!`);
                this.showView(successResourceList);
                clearInterval(task);
            }
        }, 100);
    },
    // 获取要查询的关键字
    getKeyword: function () {
        this._keyword = $(this._websiteConfig.keywordSelector).text().split(` `)[0];
        return this._keyword;
    },
    // 显示资源在视图上
    showView: function (data) {
        let table = ``;
        table += `<table style='text-align: center; padding: 14px; width: 100%;border: 2px solid #ddd; margin: 20px auto;'>`;
        for (let i = 0; i < data.length; i = i + config.showLength) {

            table += `<tr>`;

            for (let j = i; j < i + config.showLength && data[j]; ++j) {
                table += `<td style="padding-top: 10px; padding-bottom: 10px;"><a href='${data[j].link}' target='_blank'>${data[j].description}</td>`;
            }

            table += `</tr>`;
        }
        table += `</table>`;
        $(this._websiteConfig.showView.selector).after(table);
    }
}

// 选择执行的控制器
const Controller = {
    // 匹配网站
    select: function (configList, keyword) {
        for (let i = 0; i < configList.length; ++i) {
            if (configList[i].rule.test(keyword)) {
                return i;
            }
        }
        return -1;
    },
    // 匹配执行的控制器
    run: function (websiteConfigList) {
        let keyword = window.location.href;
        let index = this.select(websiteConfigList, keyword);
        if (index != -1) { //匹配成功
            console.log("匹配成功! " + websiteConfigList[index].description);
            ServerController.init(websiteConfigList[index]);
            ServerController.run();
        } else { //匹配失败
            console.log("匹配失败!");
        }
    }
}