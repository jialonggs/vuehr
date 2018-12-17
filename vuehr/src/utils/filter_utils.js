import Vue from 'vue'
Vue.filter("formatDate", formatDate);
Vue.prototype.formatDate = formatDate;
function formatDate(value) {
  var date = new Date(value);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return year + "-" + month + "-" + day;
}
Vue.filter("formatDateTime", function formatDateTime(value) {
  var date = new Date(value);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return year + "-" + month + "-" + day + " " + hours + ":" + minutes;
});


Vue.filter("formatBaoJia", function formatBaoJia(value1, tax) {
  return value1 / (tax * 100) ;
});

Vue.filter("formatDateTime2", function formatDateTime2(value) {
  var date = new Date(value);
  var nowDate = new Date();
  let item =  date - nowDate;
  let day = item / (60* 24 * 60 * 1000);
  return Math.ceil(day);
});

Vue.filter("formatDateTime3", function formatDateTime3(value1, value2) {
  var date = new Date(value1);
  var excepted = new Date(value2);
  let item =  excepted - date;
  let day = item / (60* 24 * 60 * 1000);
  return Math.ceil(day);
});


Vue.filter("imageFilter", function imageFilter(imageUrls) {
  if(imageUrls === "undefined"|| imageUrls === ""|| imageUrls.length <=0 ){
    return "";
  }
  let url = "";
  for (var i = 0; i < imageUrls.length; i++) {
    if (i == imageUrls.length - 1) {
      url = url + imageUrls[i]
    } else {
      url = imageUrls[i]+ "|" + url
    }
  }
  return url;
});

Vue.filter("splitUrl", function splitUrl(item) {
  if(item === "undefined"|| item === ""|| item.length <=0 ){
    return [];
  }
  let urlArray = [];
  if (item != "undefined" && item != "") {
    urlArray = item.split('|');
  }
  return urlArray;
});

Vue.filter("splitRejectRemark", function splitRejectRemark(item) {
  if(item === "undefined"|| item === ""|| item.length <=0 ){
    return [];
  }
  let urlArray = [];
  if (item != "undefined" && item != "") {
    urlArray = item.split('|');
  }
  return urlArray;
});

Vue.filter("toDecimal", function toDecimal(item) {
  var f = parseFloat(item);
       if (isNaN(f)) {
           return;
       }
       f = Math.round(item*100)/100;
       return f;
});
