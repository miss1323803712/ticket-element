<template>
  <div class="user">
    <div class="search">
      <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchKw">
        <template slot="prepend">按用户名搜索</template>
        <el-button slot='append' type='primary' icon='el-icon-search' @click='search'>搜索</el-button>
      </el-input>
    </div>
    <el-table height='400' border v-loading='loading' :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="userId" label="用户ID" sortable width="100">
      </el-table-column>
      <el-table-column prop="nickName" label="昵称" sortable width="150">
      </el-table-column>
      <el-table-column prop="userName" label="用户名" sortable width="150">
      </el-table-column>
      <el-table-column prop="password" label="密码" sortable width='150'>
      </el-table-column>
      <el-table-column prop="regTime" label="注册时间" sortable>
      </el-table-column>
      <el-table-column label='操作'>
        <template slot-scope="scope">
          <el-button size='mini' type='primary' icon='el-icon-edit' @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="danger" icon='el-icon-delete' @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="用户信息修改" :visible.sync="centerDialogVisible" width="30%" center>
      <div class="item">
        <el-input placeholder="请输入昵称" v-model.trim='editData.nickName'>
          <template slot="prepend">昵称</template>
        </el-input>
      </div>
      <div class="item">
        <el-input placeholder="请输入密码" v-model.trim='editData.password'>
          <template slot="prepend">密码</template>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
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
        centerDialogVisible: false, //修改用户信息弹窗
        total: 1,
        index: -1, //当前行
        row: {}, //修改的当前行
        editData: {
          nickName: '',
          password: ''
        }, //用户修改信息
        tableData: []
      }
    },
    methods: {
      //修改
      handleEdit(index, row) {
        console.log(index, row);
        this.row = row;
        this.index = index;
        this.editData.nickName = row.nickName;
        this.editData.password = row.password;
        this.centerDialogVisible = true;
      },
      //确认修改
      confirmEdit: function () {
        if (this.editData.nickName == "") {
          this.$message({
            message: '昵称不能为空',
            type: 'warning'
          })
          return
        }
        if (this.editData.password == "") {
          this.$message({
            message: '密码不能为空',
            type: 'warning'
          })
          return
        }
        var _this = this;
        var params = new URLSearchParams();
        params.append("userId", _this.row.userId);
        params.append("nickName", this.editData.nickName);
        params.append("password", this.editData.password);

        axios({
          url: 'http://127.0.0.1:1234/modifyps',
          method: 'post',
          data: params,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (res) {
          console.log(res.data.res_code);
          if (res.data.res_code === 0) {
            _this.$message({
              message: '修改成功',
              type: 'success'
            })
            _this.centerDialogVisible = false;
            _this.tableData[_this.index] = res.data.data;
            _this.row=res.data.data;
            
          } else {
            _this.$message({
              message: '修改失败',
              type: 'success'
            })
          }
        }).catch(function () {

        })
      },
      //删除
      handleDelete(index, row) {
        var _this = this;
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(index, row);
          var userid = row.userId;
          var params = new URLSearchParams();
          params.append("userId", userid);
          axios({
            url: "http://127.0.0.1:1234/deleteuser",
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
        this.getUserData(e); //获取对应的每页数据
      },
      //搜索
      search: function () {
        this.getUserData(1); //搜索
      },
      //请求每页的数据
      getUserData: function (index) {
        var _this = this;
        var params = new URLSearchParams();
        params.append("keyWords", this.searchKw);
        params.append("page", index);
        params.append("pageSize", 10);
        axios({
          url: "http://127.0.0.1:1234/adminqueryuser",
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
            console.log(res.data.length);
          }
        }).catch(function (res) {

        })
      }
    },
    mounted: function () {
      this.getUserData(1); //获取第一页数据
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

</style>
