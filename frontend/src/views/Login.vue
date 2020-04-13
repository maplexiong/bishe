<template>
  <el-card class="login">
    <span class="login_title">嘉华水果店销售管理系统</span>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px">
      <div class="login_info">
        <el-form-item label="用户姓名" prop="uname" class="label_font">
          <el-input
            type="text"
            v-model="ruleForm.uname"
            autocomplete="off"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="用户密码" prop="upwd">
          <el-input
            type="password"
            v-model="ruleForm.upwd"
            autocomplete="off"
            clearable
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item label="验证码" prop="captcha">
          <div class="captcha">
            <el-input
              type="text"
              v-model="ruleForm.captcha"
              autocomplete="off"
              style="width: 110px;"
              maxlength="4"
              clearable
            ></el-input>
            <el-image
              style="width: 120px; height: 40px;"
              :src="captchaURL"
            ></el-image>
            <el-button
              @click="randomNum = Math.random()"
              icon="el-icon-refresh"
              circle
            ></el-button>
          </div>
        </el-form-item>

        <el-form-item>
          <div class="login_btn" @click="login">登录</div>
        </el-form-item>
      </div>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    var validateUname = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    var validateUpwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    var validateCaptcha = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        uname: "",
        upwd: "",
        captcha: "",
      },
      rules: {
        uname: [{ validator: validateUname, trigger: "blur" }],
        upwd: [{ validator: validateUpwd, trigger: "blur" }],
        captcha: [{ validator: validateCaptcha, trigger: "blur" }],
      },
      randomNum: Math.random(),
    };
  },
  computed: {
    captchaURL() {
      return this.axios.defaults.baseURL + "/captcha/login?" + this.randomNum;
    },
  },
  methods: {
    login() {
      let uname = this.ruleForm.uname;
      let upwd = this.ruleForm.upwd;
      let captcha = this.ruleForm.captcha;
      if (!uname || !upwd || !captcha) {
        this.$message({
          showClose: true,
          message: "请输入完整登录信息!",
          type: "error",
        });
        return;
      }

      this.axios
        .post(`/user/login`, { uname, upwd, loginCaptcha: captcha })
        .then((res) => {
          console.log(res.data);
          if (res.data.code === 200) {
            this.$store.commit("setUserInfo", res.data.data);
            sessionStorage.setItem("user", JSON.stringify(res.data.data));
            this.$router.push("/index");
          } else if (res.data.code === 404) {
            this.$message({
              showClose: true,
              message: "验证码错误",
              type: "error",
            });
            return;
          } else if (res.data.code == 201) {
            this.$message({
              showClose: true,
              message: "用户状态禁用,联系管理员",
              type: "warning",
            });
          } else {
            this.$message({
              showClose: true,
              message: "用户信息错误或不存在",
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>

<style scoped>
.login {
  position: fixed;
  width: 400px;
  height: 450px;
  top: 48%;
  left: 50%;
  margin-left: -200px;
  margin-top: -225px;
  text-align: center;
  box-sizing: border-box;
}
.login_title {
  font-size: 30px;
}
.login_info {
  margin-top: 80px;
}

.login_btn {
  width: 250px;
  height: 50px;
  border: 1px solid #dcdfe6;
  border-radius: 16px;
  text-align: center;
  background: #3194d0;
  color: #fff;
  font-size: 20px;
  line-height: 50px;
  margin-top: 30px;
  cursor: default;
  user-select: none;
}

.captcha {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}
</style>
