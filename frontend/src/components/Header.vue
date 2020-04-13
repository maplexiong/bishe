<template>
  <div class="header">
    <el-row :gutter="10" justify="end">
      <el-col :span="16">
        <router-link to="/index" class="title">
          嘉华水果店销售管理系统
        </router-link>
      </el-col>
      <el-col :span="8">
        <div class="user_info_body">
          <span class="welcome_font">欢迎:</span>
          <span class="username">{{ username }}</span>
          <el-button-group>
            <el-button size="mini" round @click="logout">退出登录</el-button>
            <el-button size="mini" round @click="upwdFormVisible = true"
              >修改密码</el-button
            >
          </el-button-group>
        </div>
      </el-col>
    </el-row>
    <!-- 修改密码 -->
    <!-- --------------------------------- -->
    <el-dialog
      title="欢迎来到密码修改页"
      :visible.sync="upwdFormVisible"
      width="30%"
    >
      <el-form
        :model="form"
        :rules="rules"
        status-icon
        ref="form"
        label-width="100px"
      >
        <el-form-item label="输入新密码" prop="upwd">
          <el-input v-model="form.upwd" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="upwd2">
          <el-input
            v-model="form.upwd2"
            autocomplete="off"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="upwdFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="update_upwd">确 定</el-button>
      </div>
    </el-dialog>

    <!-- --------------------------------- -->
  </div>
</template>

<script>
export default {
  data() {
    var result = sessionStorage.getItem("user");
    result = JSON.parse(result);

    var validateUpwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    var validateUpwd2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.upwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      username: result.uname,
      upwdFormVisible: false,
      form: {
        upwd: "",
        upwd2: "",
      },
      rules: {
        upwd: [{ validator: validateUpwd, trigger: "blur" }],
        upwd2: [{ validator: validateUpwd2, trigger: "blur" }],
      },
    };
  },

  methods: {
    logout() {
      this.axios
        .get("/user/logout")
        .then((res) => {
          console.log(res);
          sessionStorage.removeItem("user");
          this.$router.push("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    update_upwd() {
      let upwd = this.form.upwd;
      let upwd2 = this.form.upwd2;
      if (!upwd || !upwd2) {
        this.$message({
          showClose: true,
          message: "请输入完整信息",
          type: "error",
        });
        return;
      }
      if (upwd !== upwd2) {
        this.$message({
          showClose: true,
          message: "两次输入密码不一致!",
          type: "error",
        });
        return;
      }
      this.axios
        .post("/user/update/passwd", { upwd })
        .then((res) => {
          console.log(res.data);

          if (res.data.code === 200) {
            this.$message({
              showClose: true,
              message: "修改成功,请重新登录",
              type: "success",
            });
            setTimeout(() => {
              this.$router.push("/login");
              this.upwdFormVisible = false;
              this.logout();
            }, 1000);
          } else if (res.data.code === 201) {
            this.$message({
              showClose: true,
              message: "密码与上次相同",
              type: "warning",
            });
          } else {
            this.$message({
              showClose: true,
              message: "密码修改失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style>
.header {
  /* min-width: 1300px; */
  position: relative;
}
.title {
  display: inline-block;
  text-decoration: none;
  color: #fff;
  font-size: 26px;
  line-height: 100px;
}
.welcome_font {
  font-size: 21px;
  color: #fff;
}
.user_info_body {
  width: 300px;
  height: 100px;
  /* border: 1px solid #d7dae2; */
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-around;
  padding: 4px;
  box-sizing: border-box;
  align-items: center;
  position: absolute;
  right: 0;
}
.username {
  color: #fff;
  font-size: 20px;
}

.el-dropdown-link {
  cursor: pointer;

  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
