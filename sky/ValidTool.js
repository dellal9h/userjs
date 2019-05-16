// 依赖jquery
const ValidTool = {
    arrayNotEmpty: function (arrayObject) {
        if (this.isUndefined(arrayObject) || this.isNull(object) || arrayObject.length == 0) {
            return false;
        }
        return true;
    },
    arrayIsEmpty: function (arrayObject) {
        return !this.arrayNotEmpty(arrayObject);
    },
    selectorIsNotNull: function (selector) {
        return !this.selectorIsNotNull(selector);
    },
    selectorIsNull: function (selector) {
        return $(selector).length <= 0;
    },
    isNull: function (object) {
        return object == null;
    },
    isNotNull: function (object) {
        return !this.isNull(object);
    },
    isUndefined: function (object) {
        return object == "undefined";
    },
    isNotUndefined: function (object) {
        return !this.isNotUndefined(object);
    },
    isNullOrUndefined: function (object) {
        return this.isNull(object) || this.isUndefined(object);
    },
    isNotNullAndUndefined: function (object) {
        return !this.isNull(object) && !this.isUndefined(object);
    }
}