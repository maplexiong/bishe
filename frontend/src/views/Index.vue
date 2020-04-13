<template>
  <el-container class="root_container">
    <el-header height="100px">
      <Header />
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          default-active="1"
          background-color="#2A3F54"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.first_name"
            v-for="(item, index) in menus"
            :key="index"
          >
            <template slot="title">
              <i :class="el_icon[index]"></i>
              <span>{{ item.first_name }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="item2.path_name"
              v-for="(item2, index2) in item.children"
              :key="index2"
            >
              {{ item2.second_name }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from "../components/Header";
export default {
  name: "index",
  components: {
    Header
  },
  data() {
    return {
      menus: [],
      el_icon: [
        "el-icon-user",
        "el-icon-setting",
        "el-icon-goods",
        "el-icon-shopping-cart-2",
        "el-icon-sunny"
      ]
    };
  },

  created() {
    this.axios
      .get("/menu")
      .then(res => {
        this.menus = res.data.data;
        // console.log(res.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style>
.root_container {
  height: 100%;
}
.el-header {
  background: #2a3f54;
  /* min-width: 1300px; */
}
.el-aside {
  height: 100%;
  background: #2a3f54;
}
.el-menu {
  border-right-width: 0;
}
h1 {
  color: #fff;
}
</style>
