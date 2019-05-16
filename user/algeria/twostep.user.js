// ==UserScript==
// @name         two step for visa
// @namespace    http://tampermonkey.net/
// @version      19.02.28
// @description  try to take over the world!
// @author       skypesky
// @match        *://algeria.blsspainvisa.com/appointment.php*

// @include      *://morocco.blsspainvisa.com/english/appointment.php*

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
        url: `https://morocco.blsspainvisa.com/english/appointment.php`,
        name: `morocco appointment`,
        description: `墨西哥 签约`,
        rule: /\/\/morocco.blsspainvisa.com\/english\/appointment.php/,
        date: {
            name: `date`,
            selector: `#app_date`,
            // it is month, very very important
            text: `2019-03-`,
            helper: {
                selector: `.day.activeClass[title="Book"]`
            }
        },
        data: {
            unblock: [{
                name: `Appointment Time`,
                selector: `#app_time`,
                value: `09:15 - 09:30`,
                text: `09:30 - 09:45`,
                type: `select`,
            }, {
                name: `Visa Type`,
                selector: `#VisaTypeId`,
                value: `27`,
                text: `Schengen`,
                type: `select`,
            }, {
                name: `First Name`,
                selector: `#first_name`,
                value: `King`,
                type: `input`,
            }, {
                name: `Last Name`,
                selector: `#last_name`,
                value: `Kung Fu`,
                type: `input`,
            }, {
                name: `Date Of Birth`,
                selector: `#dateOfBirth`,
                value: `2019-02-25`,
                type: `input`,
            }, {
                name: `Nationality`,
                selector: `#nationalityId`,
                text: `Algeria`,
                type: `select`,
            }, {
                name: `Passport Type`,
                selector: `#passportType`,
                text: `UN laissez-passer`,
                type: `select`,
            }, {
                name: `Passport Number`,
                selector: `#passport_no`,
                value: `2986453`,
                type: `input`,
            }, {
                name: `Passport Issue Date`,
                selector: `#pptIssueDate`,
                value: `2019-03-01`,
                type: `input`,
            }, {
                name: `Passport Expiry Date`,
                selector: `#pptExpiryDate`,
                value: `2019-03-09`,
                type: `input`,
            }, {
                name: `Passport Issue Place`,
                selector: `#pptIssuePalace`,
                value: `American`,
                type: `input`,
            }, {
                name: `SMS`,
                selector: `#vasId12`,
                value: true,
                type: `checkbox`,
            }, {
                name: `Photograph`,
                selector: `#vasId5`,
                value: true,
                type: `checkbox`,
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
        // 日期没有被选择过
        if ($(this.websiteConfig.date.selector).val().length == 0) {
            this.getDate();
            return;
        }
        this.setDataByUnblock();
    },
    getDate: function () {

        // 模拟点击日历的操作
        $.runWhenLoad(this.websiteConfig.date.selector, 0, () => {
            $(this.websiteConfig.date.selector).trigger("mousedown");
            $(this.websiteConfig.date.selector).trigger("mouseup");
            $(this.websiteConfig.date.selector).trigger("focus");
            $(this.websiteConfig.date.selector).trigger("click");
            // 获取日期
            $.runWhenLoad(this.websiteConfig.date.helper.selector, 0, () => {
                // 点击当前按钮
                let length = $(this.websiteConfig.date.helper.selector).length;
                let index = 0;
                let date = "";
                while (index < length) {
                    if ((date = $($(this.websiteConfig.date.helper.selector)[index]).text()).length != 0) {
                        console.log("成功拿到日期");
                        // 获取日期
                        $(this.websiteConfig.date.selector).val(this.websiteConfig.date.text + date);
                        // 提交表单
                        $(this.websiteConfig.date.selector).trigger("change");
                        $('body').click();
                        GM_notification("Successful Date! Good job!");
                        break;
                    }
                    ++index;
                }
            });
        });

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
                    Select.run(data[index].selector, data[index].value, data[index].text);
                    break;
                case "checkbox":
                    CheckBox.run(data[index].selector, data[index].value);
                    break;
                default:
                    break;
            }
        }

    },
}

const Input = {
    run: function (selector, value) {
        $(selector).val(value);
    }
}

const Select = {
    run: function (selector, value, text) {
        if (ValidTool.isNullOrUndefined(text)) {
            $(selector).val(value);
        } else {
            $(selector).val($(`${selector} option:contains(${text})`).attr('value'));
        }
    }
}

const Radio = {
    run: function (selector, value) {
        $(selector).val(value);
    }
}

const CheckBox = {
    run: function (selector, value) {
        $(selector).attr("checked", value);
    }
}

const Controller = {
    select: function (websiteConfigArray) {
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