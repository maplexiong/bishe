<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 列表 -->
    <el-card class="box-card" shadow="hover">
      <el-table :data="tableData" border style="width:800">
        <el-table-column prop="orderId" label="订单编号"> </el-table-column>
        <el-table-column prop="order_principal" label="负责人">
        </el-table-column>
        <el-table-column prop="order_number" label="商品数量">
        </el-table-column>
        <el-table-column prop="order_amount" label="金额"> </el-table-column>
        <el-table-column label="订单日期">
          <template slot-scope="scope">
            {{ Number(scope.row.order_date) | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            {{ scope.row.order_state === 1 ? "已完成" : "未完成" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                size="mini"
                type="info"
                @click="
                  orderDetailDialog = true;
                  getCellOrderDetail(scope.row.orderId);
                "
                >详情</el-button
              >
              <el-button
                size="mini"
                type="primary"
                @click="editRow(scope.row.orderId)"
                >编辑</el-button
              >
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

    <!-- 订单详情 -->
    <el-dialog title="订单详情" :visible.sync="orderDetailDialog">
      <h4>订单号:{{ orderId }}</h4>
      <h4>负责人:{{ order_principal }}</h4>
      <el-table :data="orderDetailTableData" style="width: 800">
        <el-table-column type="index" width="50" label="#"> </el-table-column>
        <el-table-column prop="od_fruit_name" label="商品名"> </el-table-column>
        <el-table-column prop="od_fruit_sale_price" label="单价">
        </el-table-column>
        <el-table-column prop="od_fruit_count" label="数量"> </el-table-column>
      </el-table>
      <h4>订单金额:{{ order_amount }}</h4>
      <h4>订单状态:{{ order_state === 1 ? "已完成" : "未完成" }}</h4>
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
      pageSize: 5,
      pageNum: 1,
      orderDetailDialog: false,
      orderDetailTableData: [],
      orderId: undefined,
      order_amount: undefined,
      order_date: undefined,
      order_number: undefined,
      order_principal: undefined,
      order_state: undefined
    };
  },

  methods: {
    async getCellOrderDetail(val) {
      this.curOrderId = val;
      let { data: res } = await this.axios.get("/order/cellOrderDetail", {
        params: { orderId: val }
      });
      if (res.code === 200) {
        this.orderDetailTableData = res.data.orderDetail;
        this.orderId = res.data.orderId;
        this.order_amount = res.data.order_amount;
        this.order_date = res.data.order_date;
        this.order_number = res.data.order_number;
        this.order_principal = res.data.order_principal;
        this.order_state = res.data.order_state;
      }
    },
    handleCurrentChange(val) {
      console.log(val);
      this.pageNum = val;
      this.getDate(val);
    },
    getDate() {
      this.axios
        .get("/order/list", {
          params: { pageNum: this.pageNum, pageSize: this.pageSize }
        })
        .then(res => {
          this.tableData = res.data.data;
          this.total = res.data.totalCount;
          this.pageCount = res.data.pageCount;
        })
        .catch(err => {
          console.log(err);
        });
    },
    editRow(row) {
      alert("编辑:" + row);
    }
  },
  created() {
    let user_info = sessionStorage.getItem("user");
    user_info = JSON.parse(user_info);
    this.getDate();
  }
};
</script>

<style scoped></style>
