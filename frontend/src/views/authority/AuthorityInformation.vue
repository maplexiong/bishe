<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card" shadow="hover">
      <el-table :data="roleList" border style="width: 100%;">
        <el-table-column label="唯一编号" prop="rmid"></el-table-column>
        <el-table-column label="角色名称">
          <template slot-scope="scope">
            {{ scope.row.role | role }}
          </template>
        </el-table-column>
        <el-table-column label="拥有权限">
          <template slot-scope="scope">
            {{ scope.row.path_name | pathName }}
          </template>
        </el-table-column>
        <el-table-column prop="state" label="启用">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isEnable"
              @change="doIsEnable(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: []
    };
  },
  created() {
    this.getAuthorityInformation();
  },
  methods: {
    async getAuthorityInformation() {
      let { data: res } = await this.axios.get("/authority/roleAuthority");
      if (res.code === 200) {
        this.roleList = res.data;
        // console.log("权限列表: ", res.data);
      }
    },
    doIsEnable(val) {
      this.axios
        .post("/authority/isEnable", {
          rmid: val.rmid,
          isEnable: val.isEnable + ""
        })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success("模块启用更新成功");
            this.getAuthorityInformation();
          } else if (res.data.code === 201) {
            this.$message({ message: "模块状态无更新", type: "warning" });
          } else {
            this.$message.error("模块状态更新失败");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style></style>
