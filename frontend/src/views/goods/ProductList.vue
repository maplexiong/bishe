<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card" shadow="hover">
      <el-row>
        <el-col :span="24"
          ><div>
            <el-button type="success" plain @click="saleFruitFormVisible = true"
              >售货管理</el-button
            >
          </div></el-col
        >
      </el-row>
      <!-- 列表 -->

      <el-table :data="tableData" border style="width: 800;">
        <el-table-column prop="fid" label="唯一编号" width="80">
        </el-table-column>
        <el-table-column prop="fname" label="水果名"> </el-table-column>
        <el-table-column prop="funit" label="单位" width="50">
        </el-table-column>
        <el-table-column prop="fkind" label="类名"> </el-table-column>
        <el-table-column prop="forigin" label="产地"> </el-table-column>
        <el-table-column prop="fcount" label="数量"> </el-table-column>
        <el-table-column prop="f_sale_price" label="售价(元)">
        </el-table-column>
        <el-table-column prop="f_is_sale" label="是否在售">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.f_is_sale" disabled></el-switch>
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

    <!-- 售货管理 -->

    <el-dialog
      title="售货页面"
      :visible.sync="saleFruitFormVisible"
      width="300"
      :fullscreen="fullscreen"
      :destroy-on-close="true"
    >
      <p>
        <el-input
          v-model="fid"
          style="width: 100px;"
          placeholder="商品编号"
        ></el-input>
        <el-input
          v-model="needCount"
          style="width: 120px;"
          placeholder="商品数量(kg)"
        ></el-input>
        <el-button @click="getFruitCell">查询并添加</el-button>
        <el-tooltip class="item" effect="dark" content="全屏" placement="top">
          <el-button
            icon="el-icon-full-screen"
            circle
            @click="isfullscreen"
          ></el-button>
        </el-tooltip>
      </p>

      <el-divider></el-divider>

      <el-table :data="saleData" highlight-current-row>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="fid" label="商品编号"> </el-table-column>
        <el-table-column prop="fname" label="商品名称"> </el-table-column>
        <el-table-column prop="f_sale_price" label="售价(千克/元)">
        </el-table-column>
        <el-table-column prop="needCount" label="数量(千克)"> </el-table-column>
        <el-table-column label="小计(元)">
          <template slot-scope="scope">
            {{ (scope.row.f_sale_price * scope.row.needCount).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="DelCur(scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <p>商品数量:{{ saleData.length }}<span>件</span></p>
      <p>总价:{{ totalPrice.toFixed(2) }} <span>元</span></p>
      <p>
        支付金额:<el-input style="width: 100px;" v-model="payAmount"></el-input>
      </p>
      <div slot="footer">
        <el-button @click="saleFruitFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saleFruit">确 定</el-button>
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
      saleFruitFormVisible: false,
      fullscreen: false,
      fid: undefined,
      needCount: undefined,
      saleData: [],
      payAmount: undefined
    };
  },
  computed: {
    totalPrice() {
      let sum = 0;
      for (let item of this.saleData) {
        sum += Number(item.f_sale_price) * Number(item.needCount);
      }
      return sum;
    }
  },
  methods: {
    DelCur(val) {
      // console.log(val);
      this.$confirm("此操作将删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.saleData.splice(val, 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    isfullscreen() {
      this.fullscreen = !this.fullscreen;
    },
    async saleFruit() {
      let { data: res } = await this.axios.post("/order/produceOrder", {
        allData: this.saleData,
        // totalCount: this.saleData.length,
        // totalAmount: this.totalPrice.toFixed(2),
        payAmount: this.payAmount
      });
      console.log(res);
      console.log(this.payAmount);
      if (res.code === 200) {
        this.$message.success("订单产生成功");
        this.saleData = [];
        this.payAmount = 0;
      }
    },
    async getFruitCell() {
      if (!this.fid || !this.needCount) {
        this.$message.error("请提供完整信息!");
        return;
      }

      let { data: res } = await this.axios.get("/fruit/checkForSale", {
        params: { fid: this.fid, needCount: this.needCount }
      });
      if (res.code === 200) {
        res.data.needCount = this.needCount;
        this.saleData.push(res.data);
        this.fid = undefined;
        this.needCount = undefined;
      } else if (res.code === 201) {
        this.$message({
          showClose: true,
          message: "需求过大,库存不足!",
          type: "warning"
        });
      } else {
        this.$message.error("检索失败");
      }
    },
    handleCurrentChange(val) {
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
    }
  },
  created() {
    this.getFruitList();
  }
};
</script>

<style scoped></style>
