<template>
  <div class="user">
    <div class="search">
      <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchKw">
        <template slot='prepend'>
          <el-select v-model="scenery" placeholder="请选择">
            <el-option v-for="item in options" :key="item.sceneryId" :label="item.sceneryName" :value="item.sceneryId">
            </el-option>
          </el-select>
        </template>
        <el-button slot='append' type='primary' icon='el-icon-search' @click='search'>搜索</el-button>
      </el-input>
    </div>
    <el-table border v-loading='loading' :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
      <el-table-column type="expand" width="50">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="景点ID">
              <span>{{ props.row.sceneryId }}</span>
            </el-form-item>
            <el-form-item label="用户ID">
              <span>{{ props.row.userId }}</span>
            </el-form-item>
            <el-form-item label="票ID">
                <span>{{ props.row.ticketId }}</span>
              </el-form-item>
            <el-form-item label="联系人姓名">
              <span> {{ props.row.touristName }}</span>
            </el-form-item>
            <el-form-item label="联系人电话">
              <span>{{ props.row.phoneNumber }}</span>
            </el-form-item>
            <el-form-item label="购买张数">
              <span>{{ props.row.ticketCount }}</span>
            </el-form-item>
            <el-form-item label="游玩日期">
              <span>{{ props.row.date }}</span>
            </el-form-item>
            <el-form-item label="取票码">
              <span>{{ props.row.checkCode }}</span>
            </el-form-item>
            <el-form-item label="取票密码">
              <span>{{ props.row.checkCodePs }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="orderNumber" label="订单号" sortable width="200">
      </el-table-column>
      <el-table-column prop="orderTime" label="订单日期" sortable width="180">
      </el-table-column>
      <el-table-column prop="price" label="总价格" sortable width='120'>
      </el-table-column>
      <el-table-column prop="state" label="订单状态" sortable>
      </el-table-column>
      <el-table-column label='操作'>
        <template slot-scope="scope">
          <el-button size="mini" type="danger" icon='el-icon-delete' @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination @current-change='currentChange' background layout="total,prev, pager, next" :total="total">
      </el-pagination>
    </div>

  </div>
</template>
<script>
  import axios from 'axios'
  import Vue from 'vue'
  export default {
    data() {
      return {
        searchKw: '', //查询关键词
        loading: true,
        total: 1,
        select: '',
        tableData: [], //表格数据
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        scenery: '' //下拉选择
      }
    },
    methods: {
      //删除
      handleDelete(index, row) {
        var _this = this;
        this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(index, row);
          var userid = row.userId;
          var params = new URLSearchParams();
          params.append("userId", row.userId);
          params.append("orderNumber",row.orderNumber)
          axios({
            url: "http://127.0.0.1:1234/deleteorder",
            method: 'post',
            data: params,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then(function (res) {
            if (res.data.res_code == 0) {
              _this.tableData.splice(index, 1);
              _this.$message({
                type: 'success',
                message: '删除成功!'
              });
            } else {
              this.$message({
                type: 'warning',
                message: '删除失败'
              });
            }
          }).catch(function (res) {

          })

        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消删除'
          });
        });
      },
      //页数改变事件
      currentChange: function (e) {
        console.log(e);
        this.getOrderData(e); //获取对应的每页数据
      },
      //搜索
      search: function () {
        this.getOrderData(1); //搜索
      },
      //请求每页的数据
      getOrderData: function (index) {
        var _this = this;
        var params = new URLSearchParams();
        params.append("keywords", this.searchKw);
        params.append("sceneryId", this.scenery == "" ? -1 : this.scenery);
        params.append("page", index);
        params.append("pageSize", 10);
        axios({
          url: "http://127.0.0.1:1234/adminqueryorder",
          method: 'post',
          data: params,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (res) {
          console.log(res);
          if (res.data.res_code == 0) {
            _this.loading = false;
            _this.tableData = res.data.data;
            _this.total = res.data.length;
          }
        }).catch(function (res) {

        })
      },
      //查询景点数据便于填充下拉选择框
      getScenery: function (index) {
        var params = new URLSearchParams();
        params.append("keyWords", this.searchKw);
        params.append("page", index);
        params.append("pageSize", 1000);
        params.append("location", "");
        var _this = this;
        axios({
          url: 'http://127.0.0.1:1234/getScenery',
          method: 'post',
          data: params,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (res) {
          console.log("景点信息", res);
          if (res.data.res_code == 0) {
            _this.options = res.data.data;
          } else {
            _this.tableData = [];
          }

        }).catch(function (res) {

        })
      }
    },
    mounted: function () {
      this.getOrderData(1); //获取第一页订单数据
      this.getScenery(1); //获取景点数据
    }
  }

</script>
<style scoped>
  .user {
    width: 100%;
  }

  .page {
    margin-top: 30px;
    text-align: right;
  }

  .user .search {
    margin-bottom: 20px;
  }

  .el-dialog .item {
    margin: 20px 0;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .el-input .el-select {
    width: 240px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff !important;
    transform: translateX(253px);
  }

</style>
