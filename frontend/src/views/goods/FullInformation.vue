<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 列表 -->
    <el-card class="box-card" shadow="hover">
      <el-row>
        <el-col :span="24"
          ><div>
            <el-button type="primary" plain @click="addFruitFormVisible = true"
              >添加水果信息</el-button
            >
          </div></el-col
        >
      </el-row>

      <el-table :data="tableData" border style="width: 800;">
        <el-table-column prop="fid" label="唯一编号" width="80">
        </el-table-column>
        <el-table-column prop="fname" label="水果名"> </el-table-column>
        <el-table-column prop="funit" label="单位" width="50">
        </el-table-column>
        <el-table-column prop="fkind" label="类名"> </el-table-column>
        <el-table-column prop="forigin" label="产地"> </el-table-column>
        <el-table-column prop="fcount" label="数量"> </el-table-column>
        <el-table-column prop="fprice" label="进价(元)"> </el-table-column>
        <el-table-column prop="f_sale_price" label="售价(元)">
        </el-table-column>
        <el-table-column prop="f_is_sale" label="是否在售">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.f_is_sale" disabled></el-switch>
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
                  editFruitFormVisible = true;
                  ThisFruitInfo(scope.row);
                "
              ></el-button>

              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="DelRow(scope.row.fid)"
              ></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
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

    <!-- 编辑水果信息 -->
    <el-dialog
      :title="'当前水果编号: ' + editFruitForm.fid"
      :visible.sync="editFruitFormVisible"
      width="300"
    >
      <el-form
        :model="editFruitForm"
        status-icon
        ref="editFruitForm"
        label-width="100px"
      >
        <el-form-item label="水果名">
          <el-input
            v-model="editFruitForm.fname"
            style="width: 220px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-radio-group v-model="editFruitForm.funit">
            <el-radio label="kg"></el-radio>
            <el-radio label="g"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类名">
          <el-input
            v-model="editFruitForm.fkind"
            style="width: 220px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="产地">
          <el-input
            v-model="editFruitForm.forigin"
            style="width: 220px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input
            v-model="editFruitForm.fcount"
            style="width: 220px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="进价(元)">
          <el-input
            v-model="editFruitForm.fprice"
            style="width: 220px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="售价(元)">
          <el-input
            v-model="editFruitForm.f_sale_price"
            style="width: 220px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否在售">
          <el-switch v-model="editFruitForm.f_is_sale"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editFruitFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFruit()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加水果信息 -->

    <el-dialog
      title="添加水果信息页面"
      :visible.sync="addFruitFormVisible"
      width="300"
    >
      <el-form
        :model="addFruitForm"
        status-icon
        ref="addFruitForm"
        label-width="100px"
      >
        <el-form-item label="水果名">
          <el-input
            v-model="addFruitForm.fname"
            style="width: 220px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-radio-group v-model="addFruitForm.funit">
            <el-radio label="kg"></el-radio>
            <el-radio label="g"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类名">
          <el-input
            v-model="addFruitForm.fkind"
            style="width: 220px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="产地">
          <el-input
            v-model="addFruitForm.forigin"
            style="width: 220px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input
            v-model="addFruitForm.fcount"
            style="width: 220px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="进价(元)">
          <el-input
            v-model="addFruitForm.fprice"
            style="width: 220px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="售价(元)">
          <el-input
            v-model="addFruitForm.f_sale_price"
            style="width: 220px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否在售">
          <el-switch v-model="addFruitForm.f_is_sale"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addFruitFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFruit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      pageCount: 0,
      total: 0,
      pageSize: 8,
      pageNum: 1,
      editFruitFormVisible: false,
      addFruitFormVisible: false,
      editFruitForm: {
        fid: undefined,
        fname: "",
        funit: "",
        fkind: "",
        forigin: "",
        fcount: "",
        fprice: "",
        f_sale_price: "",
        f_is_sale: undefined
      },
      addFruitForm: {
        fname: "",
        funit: "g",
        fkind: "",
        forigin: "",
        fcount: "",
        fprice: "",
        f_sale_price: "",
        f_is_sale: false
      }
    };
  },

  methods: {
    addFruit() {
      let fname = this.addFruitForm.fname;
      let funit = this.addFruitForm.funit;
      let fkind = this.addFruitForm.fkind;
      let forigin = this.addFruitForm.forigin;
      let fcount = this.addFruitForm.fcount;
      let fprice = this.addFruitForm.fprice;
      let f_sale_price = this.addFruitForm.f_sale_price;
      let f_is_sale = this.addFruitForm.f_is_sale;
      if (
        !fname ||
        !funit ||
        !fkind ||
        !forigin ||
        !fcount ||
        !fprice ||
        !f_sale_price ||
        !f_is_sale
      ) {
        this.$message.error("请提供完整信息!");
        return;
      }

      console.log(this.addFruitForm);
      this.axios
        .post("/fruit/add", {
          fname,
          funit,
          fkind,
          forigin,
          fcount,
          fprice,
          f_sale_price,
          f_is_sale
        })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success("添加水果信息成功");
            this.getFruitList();
          } else {
            this.$message.error("添加水果信息失败!");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    ThisFruitInfo(val) {
      this.editFruitForm.fid = val.fid;
      this.editFruitForm.fname = val.fname;
      this.editFruitForm.funit = val.funit;
      this.editFruitForm.fkind = val.fkind;
      this.editFruitForm.forigin = val.forigin;
      this.editFruitForm.fcount = val.fcount;
      this.editFruitForm.fprice = val.fprice;
      this.editFruitForm.f_sale_price = val.f_sale_price;
      this.editFruitForm.f_is_sale = val.f_is_sale;
    },
    handleCurrentChange(val) {
      // console.log(val);
      this.pageNum = val;
      this.getFruitList(val);
    },
    getFruitList() {
      this.axios
        .get("/fruit/list", {
          params: { pageNum: this.pageNum, pageSize: this.pageSize }
        })
        .then(res => {
          this.tableData = res.data.data;
          this.total = res.data.totalCount;
          this.pageCount = res.data.pageCount;
          // console.log(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    async editFruit() {
      const { data: res } = await this.axios.post("/fruit/update", {
        fid: this.editFruitForm.fid,
        fname: this.editFruitForm.fname,
        funit: this.editFruitForm.funit,
        fkind: this.editFruitForm.fkind,
        forigin: this.editFruitForm.forigin,
        fcount: this.editFruitForm.fcount,
        fprice: this.editFruitForm.fprice,
        f_sale_price: this.editFruitForm.f_sale_price,
        f_is_sale: this.editFruitForm.f_is_sale + ""
      });
      if (res.code === 200) {
        this.$message.success("修改水果信息成功");
        this.editFruitFormVisible = false;
        this.getFruitList();
      } else if (res.code === 201) {
        this.$message({ message: "水果信息无更新!", type: "warning" });
      } else {
        this.$message.error("修改水果信息失败!");
      }
    },
    DelRow(row) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .post("/fruit/del", { fid: row })
            .then(res => {
              console.log(res.data);
              if (res.data.code === 200) {
                this.getFruitList();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                ++this.keyNum;
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
    }
  },
  created() {
    let user_info = sessionStorage.getItem("user");
    user_info = JSON.parse(user_info);
    this.getFruitList();
  }
};
</script>

<style scoped></style>
