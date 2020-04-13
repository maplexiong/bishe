import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    component: Login,
    meta: { title: "嘉华水果店 - 登录页面" },
  },
  {
    path: "/index",
    component: () =>
      import(/* webpackChunkName: "homeIndex" */ "@/views/Index.vue"),
    beforeEnter: (to, from, next) => {
      let result = sessionStorage.getItem("user");
      result = JSON.parse(result);
      if (result.role) {
        next();
      } else {
        next("/login");
      }
    },
    redirect: "/welcome",
    children: [
      {
        path: "/welcome",
        component: () =>
          import(/* webpackChunkName: "welcome" */ "@/views/Welcome.vue"),
        meta: { title: "嘉华水果店 - 首页" },
      },
      {
        path: "/UserList",
        component: () =>
          import(
            /* webpackChunkName: "UserList" */ "@/views/user/UserList.vue"
          ),
        meta: { title: "嘉华水果店 - 用户列表" },
      },
      {
        path: "/ProductList",
        component: () =>
          import(
            /* webpackChunkName: "ProductList" */ "@/views/goods/ProductList.vue"
          ),
        meta: { title: "嘉华水果店 - 商品列表" },
      },
      {
        path: "/FullInformation",
        component: () =>
          import(
            /* webpackChunkName: "FullInformation" */ "@/views/goods/FullInformation.vue"
          ),
        meta: { title: "嘉华水果店 - 商品详情" },
      },
      {
        path: "/OrderList",
        component: () =>
          import(
            /* webpackChunkName: "OrderList" */ "@/views/order/OrderList.vue"
          ),
        meta: { title: "嘉华水果店 - 订单列表" },
      },
      {
        path: "/AuthorityInformation",
        component: () =>
          import(
            /* webpackChunkName: "AuthorityInformation" */ "@/views/authority/AuthorityInformation.vue"
          ),
        meta: { title: "嘉华水果店 - 权限信息" },
      },
      {
        path: "/SaleInformation",
        component: () =>
          import(
            /* webpackChunkName: "SaleInformation" */ "@/views/statistics/SaleInformation.vue"
          ),
        meta: { title: "嘉华水果店 - 销售信息" },
      },
    ],
  },
  {
    path: "*",
    component: () =>
      import(/* webpackChunkName: "NotFound" */ "@/views/NotFound.vue"),
    meta: { title: "Not Found 404" },
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  let result = sessionStorage.getItem("user");
  result = JSON.parse(result);
  if (to.path == "/login" || result) {
    next();
  } else {
    next("/login");
  }
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
