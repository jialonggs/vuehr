let CookieUtils = {};

//根据key获取cookie
CookieUtils.getCookie = function (key) {
    let arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return arr[2];
    } else {
        return null;
    }
};

//设置cookie
CookieUtils.setCookie = function (key, value, expireDays) {
    let expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + expireDays * 24 * 60 * 60 * 1000);
    document.cookie = key + '=' + escape(value) + ((expireDays == null) ? '' : ';expires=' + expireDate.toUTCString()) + ";path=/;";

};

//删除cookie
CookieUtils.deleteCookie = function (key) {
    let expireDate = new Date();
    expireDate.setTime(expireDate.getTime() - 1);
    let value = this.getCookie(key);
    if (value !== null) {
        console.log('--不为空--');
        document.cookie = key + '=' + escape(value) + ';expires=' + expireDate.toUTCString();
    } else {
        console.log('--为空--');
    }
};

export default CookieUtils;
