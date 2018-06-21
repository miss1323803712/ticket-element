<template>
  <div class="user">
    <div class="search">
      <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchKw">
        <template slot='prepend'>
          <el-select v-model="scenery" @change='sceneryChange' placeholder="请选择">
            <el-option v-for="item in options" :key="item.sceneryId" :label="item.sceneryName" :value="item.sceneryId">
            </el-option>
          </el-select>
        </template>
        <el-button slot='append' type='primary' icon='el-icon-search' @click='search'>搜索</el-button>
      </el-input>
    </div>
    <el-table border v-loading='loading' :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
      <el-table-column fixed="left" type="index" width="50">
      </el-table-column>
      <el-table-column prop="ticketName" label="票名称" sortable width="320" center>
      </el-table-column>
      <el-table-column prop="ticketId" label="票id" sortable width="80">
      </el-table-column>
      <el-table-column prop="price" label="票价" sortable width='100'>
      </el-table-column>
      <el-table-column prop="ticketDesc" label="说明" sortable width='400'>
      </el-table-column>
      <el-table-column label='操作' fixed="right" width='240'>
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon='el-icon-edit' @click="handEidt(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="danger" icon='el-icon-delete' @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="票类信息修改" :visible.sync="centerDialogVisible" width="60%" center>
      <div class="item">
        <el-input placeholder="票类名称" v-model.trim='editData.ticketName'>
          <!-- <template slot="prepend">票类名称</template> -->
        </el-input>
      </div>
      <div class="item">
        <el-input placeholder="票价" v-model.trim='editData.price'>
          <!-- <template slot="prepend">票    价</template> -->
        </el-input>
      </div>
      <div class="item">
        <el-input placeholder="说明" v-model='editData.ticketDesc'>
          <!-- <template slot="prepend">票类说明</template> -->
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog>
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
        editData: {},
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
        centerDialogVisible: false,
        scenery: '' //下拉选择
      }
    },
    methods: {
      //删除
      handleDelete(index, row) {
        var _this = this;
        this.$confirm('此操作将永久删除该票, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(index, row);
          var params = new URLSearchParams();
          params.append("sceneryId", row.sceneryId);
          params.append("ticketId", row.ticketId);
          axios({
            url: "http://127.0.0.1:1234/deleteticket",
            method: 'post',
            data: params,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then(function (res) {
            console.log(res);
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
      cancelEdit: function () {
        this.centerDialogVisible = false;
      },
      confirmEdit: function () {
        if (this.editData.ticketName == "") {
          this.$message({
            message: '票类名称不能为空',
            type: 'warning'
          })
          return;
        }
        if (this.editData.price == "") {
          this.$message({
            message: '票价不能为空',
            type: 'warning'
          })
          return;
        }
        if (this.editData.ticketDesc == "") {
          this.$message({
            message: '请输入说明',
            type: 'warning'
          })
          return;
        }
        this.centerDialogVisible=false;
        var params = new URLSearchParams();
        params.append("ticketName", this.editData.ticketName);
        params.append("sceneryId", this.editData.sceneryId);
        params.append("ticketId", this.editData.ticketId);
        params.append("desc", this.editData.ticketDesc);
        params.append("price", this.editData.price);
        var _this = this;
        axios({
          url: 'http://127.0.0.1:1234/modifyticket',
          method: 'post',
          data: params,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (res) {
          console.log("景点信息", res);
          if (res.data.res_code == 0) {
            _this.$message({
              message: '修改成功',
              type: 'warning'
            })
          } else {
            _this.$message({
              message: '修改失败',
              type: 'warning'
            })
          }
        }).catch(function (res) {

        })
      },
      //修改票
      handEidt: function (index, row) {
        console.log(row);
        var _this = this;
        this.editData = row;
        this.centerDialogVisible = true;
      },
      //页数改变事件
      currentChange: function (e) {
        console.log(e);
        this.getTicketData(e); //获取对应的每页数据
      },
      //切换景点位置
      sceneryChange: function (e) {
        this.getTicketData(1); //获取评论数据
      },
      //搜索
      search: function () {
        this.getTicketData(1); //搜索
      },
      //请求每页的数据
      getTicketData: function (index) {
        var _this = this;
        var params = new URLSearchParams();
        params.append("keywords", this.searchKw);
        params.append("sceneryId", this.scenery);
        params.append("page", index);
        params.append("pageSize", 10);
        axios({
          url: "http://127.0.0.1:1234/adminqueryticket",
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
            _this.scenery = _this.options[0].sceneryId;
            _this.getTicketData(1); //请求评论信息
          } else {
            _this.tableData = [];
          }

        }).catch(function (res) {

        })
      }
    },
    mounted: function () {
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
