import Vue from "vue";

Vue.browser = {
    ua: navigator.userAgent,
    trident: function () {
        return this.ua.indexOf('Trident') > -1;
    },
    presto: function () {
        return this.ua.indexOf('Presto') > -1;
    },
    webKit: function () {
        return this.ua.indexOf('AppleWebKit') > -1;
    },
    gecko: function () {
        return this.ua.indexOf('Gecko') > -1 && this.ua.indexOf('KHTML') == -1;
    },
    mobile: function () {
        return !!this.ua.match(/AppleWebKit.*Mobile.*/);
    },
    ios: function () {
        return this.iPhone() || this.iPad();
    },
    android: function () {
        return this.ua.indexOf('Android') > -1 || this.ua.indexOf('Linux') > -1;
    },
    iPhone: function () {
        return this.ua.indexOf('iPhone') > -1;
    },
    iPad: function () {
        return this.ua.indexOf('iPad') > -1;
    },
    qq: function () {
        return this.ua.indexOf('QQBrowser') > -1;
    },
    weixin: function () {
        return this.ua.indexOf('MicroMessenger') > -1;
    },
    isApp: function () {
        return this.ua.indexOf('ody') > -1;
    },
    //获取ios浏览器主版本号
    getIosVersion:function () {
      var ver = this.ua.match(/OS (\d+)_(\d+)_?(\d+)?/);
      if(ver && ver.length>1){
            return parseInt(ver[1], 10);
        }else{
            return -1;
        }
    } 
};
