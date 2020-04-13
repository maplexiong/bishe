import Vue from "vue";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import "./assets/css/comm.css";
import moment from "moment";

Vue.filter("dateFormat", (daraStr, pattern = "YYYY-MM-DD HH:mm:ss") => {
  return moment(daraStr).format(pattern);
});

Vue.filter("isOnSale", val => {
  if (val === 1) {
    return "在售";
  } else if (val === 0) {
    return "未售";
  } else {
    return "未知";
  }
});

Vue.filter("sex", val => {
  if (val === 1) {
    return "男";
  } else if (val === 0) {
    return "女";
  } else {
    return "未知";
  }
});

Vue.filter("role", val => {
  switch (val) {
    case "admin":
      return "管理员";
    case "general":
      return "普通员工";
    case "teamLeader":
      return "组长";
    default:
      return "未知";
  }
});
Vue.filter("pathName", val => {
  switch (val) {
    case "ProductList":
      return "商品列表";
    case "AuthorityInformation":
      return "权限列表";
    case "UserList":
      return "用户列表";
    case "OrderList":
      return "订单列表";
    case "SaleInformation":
      return "销售信息";
    case "FullInformation":
      return "商品详情";
    case "PurchaseInformation":
      return "进货信息";
    default:
      return val;
  }
});

axios.defaults.baseURL = "http://127.0.0.1:6060";
// axios.defaults.baseURL = "http://106.53.50.157:6060";
axios.defaults.withCredentials = true;
Vue.prototype.axios = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
