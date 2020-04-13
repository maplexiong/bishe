<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 列表 -->
    <el-card class="box-card" shadow="hover">
      <el-row>
        <el-col :span="24"
          ><div>
            <el-button type="primary" plain @click="addUserFormVisible = true"
              >添加用户</el-button
            >
          </div></el-col
        >
      </el-row>

      <el-table :data="tableData" border style="width:800">
        <el-table-column prop="uid" label="唯一编号" width="80">
        </el-table-column>
        <el-table-column prop="uname" label="姓名"> </el-table-column>
        <el-table-column prop="phone" label="电话"> </el-table-column>
        <el-table-column label="角色">
          <template slot-scope="scope">
            {{ scope.row.role | role }}
          </template>
        </el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">
            {{ scope.row.sex | sex }}
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄"> </el-table-column>
        <el-table-column prop="work_time" label="工龄(年)"> </el-table-column>
        <el-table-column prop="work_begin" label="入职时间"></el-table-column>
        <el-table-column prop="state" label="状态(是否启用)">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              @change="stateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="
                  editUserFormVisible = true;
                  ThisUserInfo(scope.row);
                "
              ></el-button>

              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="DelUser(scope.row.uid)"
              ></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="pageNum"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户 -->
    <!---------------------------------------->
    <el-dialog
      title="欢迎来到添加用户页"
      :visible.sync="addUserFormVisible"
      width="300"
    >
      <el-form
        :model="addUserForm"
        status-icon
        ref="addUserForm"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="uname">
          <el-input
            v-model="addUserForm.uname"
            autocomplete="off"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="upwd">
          <el-input
            v-model="addUserForm.upwd"
            autocomplete="off"
            clearable
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-radio-group v-model="addUserForm.role">
            <el-radio label="admin">管理员</el-radio>
            <el-radio label="teamLeader">组长</el-radio>
            <el-radio label="general">普通员工</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addUserFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!---------------------------------------->
    <!-- 修改用户 -->
    <el-dialog
      :title="'当前用户:' + editUserForm.uname"
      :visible.sync="editUserFormVisible"
      width="300"
    >
      <el-form
        :model="editUserForm"
        status-icon
        ref="editUserForm"
        label-width="100px"
      >
        <el-form-item label="角色">
          <el-radio-group v-model="editUserForm.role">
            <el-radio label="admin">管理员</el-radio>
            <el-radio label="teamLeader">组长</el-radio>
            <el-radio label="general">普通员工</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editUserForm.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="0">女</el-radio>
            <el-radio label="2">未知</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="editUserForm.age" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editUserForm.phone" style="width:220px"></el-input>
        </el-form-item>
        <el-form-item label="入职时间">
          <el-date-picker
            v-model="editUserForm.work_begin"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          >
            >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editUserFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!---------------------------------------->
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      addUserFormVisible: false,
      editUserFormVisible: false,
      addUserForm: {
        uname: "",
        upwd: "",
        role: "general"
      },
      editUserForm: {
        uid: undefined,
        uname: "",
        role: "",
        sex: undefined,
        age: "",
        phone: "",
        work_time: "",
        work_begin: ""
      },
      pageCount: 0,
      total: 0,
      pageSize: 5,
      pageNum: 1
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    ThisUserInfo(val) {
      this.editUserForm.uid = val.uid;
      this.editUserForm.uname = val.uname;
      this.editUserForm.role = val.role;
      this.editUserForm.sex = val.sex + "";
      this.editUserForm.age = val.age;
      this.editUserForm.phone = val.phone;
      this.editUserForm.work_begin = val.work_begin;
    },

    handleCurrentChange(val) {
      // console.log(val);
      this.pageNum = val;
      this.getUserList(val);
    },

    getUserList() {
      this.axios
        .get("/user/list", {
          params: { pageNum: this.pageNum, pageSize: this.pageSize }
        })
        .then(res => {
          // console.log(res.data);
          this.tableData = res.data.data;
          this.total = res.data.totalCount;
          this.pageCount = res.data.pageCount;
        })
        .catch(err => {
          console.log(err);
        });
    },

    async editUser() {
      const { data: res } = await this.axios.post("/user/update", {
        uid: this.editUserForm.uid,
        role: this.editUserForm.role,
        sex: this.editUserForm.sex,
        age: this.editUserForm.age,
        phone: this.editUserForm.phone,
        work_begin: this.editUserForm.work_begin
      });
      if (res.code === 200) {
        this.$message.success("修改信息成功");
        this.getUserList();
        this.editUserFormVisible = false;
      } else if (res.code === 201) {
        this.$message({ type: "warning", message: "信息无变化!" });
      } else {
        this.$message.error("修改信息失败!");
      }
    },

    DelUser(row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .post("/user/del", { uid: row })
            .then(res => {
              console.log(res.data);
              if (res.data.code === 200) {
                this.getUserList();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else if (res.data.code === 497) {
                this.$message.error("请不要删除本人!");
              } else {
                this.$message({
                  showClose: true,
                  message: "删除失败,请刷新页面后重新操作!",
                  type: "error"
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addUser() {
      let uname = this.addUserForm.uname;
      let upwd = this.addUserForm.upwd;
      let role = this.addUserForm.role;
      console.log(uname, upwd, role);
      if (!uname || !upwd || !role) {
        this.$message.error("请提供完整注册信息");
        return;
      }
      this.axios
        .post("/user/reg", { uname, upwd, role })
        .then(res => {
          console.log(res.data);
          if (res.data.code === 401) {
            this.$message.error("请提供完整注册信息");
            return;
          } else if (res.data.code === 409) {
            this.$message.error("该用户已被注册");
            return;
          } else if (res.data.code === 200) {
            this.$message.success("注册成功");
            this.getUserList();
          } else {
            this.$message.error("注册失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    async stateChange(val) {
      // console.log(val.state);
      const { data: res } = await this.axios.post("/user/userState", {
        uid: val.uid,
        userState: val.state + ""
      });
      if (res.code === 200) {
        this.$message.success("用户状态更新成功");
        this.getUserList();
      } else if (res.code === 201) {
        this.$message({ message: "用户状态无更新", type: "warning" });
      } else {
        this.$message.error("用户状态更新失败");
      }
    }
  }
};
</script>

<style></style>
