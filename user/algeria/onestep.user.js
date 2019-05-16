// ==UserScript==
// @name         one step for visa
// @namespace    http://tampermonkey.net/
// @version      19.02.28
// @description  try to take over the world!
// @author       skypesky
// @include        *://morocco.blsspainvisa.com/english/book_appointment.php*

// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      *
// ==/UserScript==

(function () {
    "use strict";


    // https://algeria.blsspainvisa.com/book_appointment.php?fbclid=IwAR3PFtwJ2IGp8NsoCMS8nW5by-vCNvvlN_zUbAPxCg0b44118tPFNfUBd_A
    // https://morocco.blsspainvisa.com/english/book_appointment.php?fbclid=IwAR3sgld7xIJaRLFhxGB50e9PCeltilARXh62h4bHtTemuBQ-dy4IsZJnytc#
    const websiteConfigArray = [{
        url: `https://morocco.blsspainvisa.com/english/book_appointment.php?fbclid=IwAR3sgld7xIJaRLFhxGB50e9PCeltilARXh62h4bHtTemuBQ-dy4IsZJnytc#`,
        name: `morocco book_appointment`,
        description: `墨西哥 入口`,
        rule: /\/\/morocco.blsspainvisa.com\/english\/book_appointment.php/,
        data: {
            unblock: [{
                name: `.app_type.marginRight`,
                selector: `.app_type.marginRight`,
                value: `guhuo@13.com`,
                type: `radio`,
            }, {
                name: `email`,
                selector: `#email`,
                value: `guhuo13@gmail.com`,
                type: `input`,
            }, {
                name: `phone`,
                selector: `#phone`,
                value: `22222222222`,
                type: `input`,
            }, {
                name: `phone_code`,
                selector: `#phone_code`,
                value: `212`,
                type: `input`,
            }, {
                name: `centre`,
                selector: `#centre`,
                value: `13#8`,
                type: `select`,
            }, {
                name: `category`,
                selector: `#category`,
                value: `Normal`,
                type: `select`,
            }],
            block: [{
                name: `centre`,
                selector: `#centre`,
                text: `Agadir`,
                type: `select`,
            }, {
                name: `category`,
                selector: `#category`,
                text: `Normal`,
                type: `select`,
            }]
        }
    }];


    // jquery拓展
    const JqueryPlugin = {
        loading: function () {
            this.extend();
        },
        extend: function () {
            $.extend({
                runWhenLoad: function (selector, length, callback) {
                    if ($(selector).length > length) {
                        console.log("task success outnner");
                        callback();
                        return;
                    }
                    let task = setInterval(() => {
                        console.log("task block", $(selector), $("selector").outerHTML);
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
    // jquery 自定义拓展
    JqueryPlugin.loading();
    $(function () {
        console.log("loading success");
        Controller.run(websiteConfigArray, function (websiteConfig) {
            Server.run(websiteConfig);
        });
    });

})();

const Server = {
    websiteConfig: [],
    init: function (websiteConfig) {
        this.websiteConfig = websiteConfig;
    },
    run: function (websiteConfig) {
        // check param
        if (ValidTool.arrayIsEmpty(this.websiteConfig)) {
            this.init(websiteConfig);
            if (ValidTool.arrayIsEmpty(this.websiteConfig)) {
                return;
            }
        }
        this.setDataByUnblock();
        this.setDataByBlock();
    },
    setDataByUnblock: function () {
        if (ValidTool.arrayIsEmpty(this.websiteConfig.data.unblock)) {
            return;
        }
        let data = this.websiteConfig.data.unblock;
        for (let index = 0; index < data.length; ++index) {
            switch (data[index].type) {
                case "input":
                    Input.run(data[index].selector, data[index].value);
                    break;
                case "radio":
                    Radio.run(data[index].selector, data[index].value);
                    break;
                case "select":
                    Select.run(data[index].selector, data[index].value);
                    break;
                default:
                    break;
            }
        }

    },
    setDataByBlock: function () {
        if (ValidTool.arrayIsEmpty(this.websiteConfig.data.block)) {
            return;
        }
        this.helper(this.websiteConfig.data.block, 0);
    },
    helper: function (dataArray, index) {
        console.log(dataArray, index);
        if (index >= dataArray.length) {
            return;
        }
        $.runWhenLoad(`${dataArray[index].selector} option`, 1, () => {
            console.log(index + " success");
            Select.run(dataArray[index].selector, dataArray[index].text);
            // can optimization
            $(dataArray[index].selector).trigger("change");
            this.helper(dataArray, ++index);
        })
    }
}

const Input = {
    run: function (selector, value) {
        $(selector).val(value);
    }
}

const Select = {
    run: function (selector, text) {
        $(selector).val($(`${selector} option:contains(${text})`).attr('value'));
    }
}

const Radio = {
    run: function (selector, value) {
        $(selector).val(value);
    }
}

const Controller = {
    select: function (websiteConfigArray) {
        if (websiteConfigArray == 'undefined' || !websiteConfigArray || !websiteConfigArray.length) {
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
        let index = this.select(websiteConfigArray);
        if (index != -1) {
            console.log("路径匹配成功!" + websiteConfigArray[index].description);
            callback(websiteConfigArray[index]);
        } else {
            console.error("路径匹配失败!");
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
    },
    isNullOrUndefined: function (object) {
        return (object == null || object == undefined);
    },
    isNotNullAndUndefined: function (object) {
        return !this.isNullOrUndefined(object);
    }
}