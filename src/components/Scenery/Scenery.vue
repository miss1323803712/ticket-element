<template>
  <div class="user">
    <div class="search">
      <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchKw">
        <template slot="prepend">按景点名称搜索</template>
        <el-button slot='append' type='primary' icon='el-icon-search' @click='search'>搜索</el-button>
      </el-input>
    </div>
    <el-table border v-loading='loading' :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
      <el-table-column type="expand" width="50">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="景点名称">
              <span>{{ props.row.sceneryName }}</span>
            </el-form-item>
            <el-form-item label="景点ID">
              <span>{{ props.row.sceneryId }}</span>
            </el-form-item>
            <el-form-item label="所属区域">
              <span>{{ props.row.area }}</span>
            </el-form-item>
            <el-form-item label="平均价格">
              <span> ￥{{ props.row.avgPrice }} 元</span>
            </el-form-item>
            <el-form-item label="景点地址">
              <span>{{ props.row.location }}</span>
            </el-form-item>
            <el-form-item label="评分">
              <span>{{ props.row.ratings }}</span>
            </el-form-item>
            <el-form-item label="评论数量">
              <span>{{ props.row.commentNumber }}</span>
            </el-form-item>
            <el-form-item label="订单数量">
              <span>{{ props.row.orderCount }}</span>
            </el-form-item>
            <el-form-item label="票类总数">
              <span>{{ props.row.ticketCount }}</span>
            </el-form-item>
            <el-form-item label="描述">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="sceneryId" label="景点ID" sortable width='100'>
      </el-table-column>
      <el-table-column prop="sceneryName" label="景点名称" sortable width='180'>
      </el-table-column>
      <el-table-column prop="location" label="地址" sortable width='380'>
      </el-table-column>
      <el-table-column prop="ratings" label="评分" sortable width='80'>
      </el-table-column>
      <el-table-column label='操作'>
        <template slot-scope="scope">
          <el-button size='mini' type='primary' icon='el-icon-edit' @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="success" icon='el-icon-circle-plus' @click="handleAddComment(scope.$index, scope.row)">添加票类</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="景点信息修改" :visible.sync="centerDialogVisible" width="60%" center>
      <div class="item">
        <el-input placeholder="景点名称" v-model.trim='editData.sceneryName'>
          <template slot="prepend">景点名称</template>
        </el-input>
      </div>
      <div class="item">
        <el-input placeholder="景点地址" v-model.trim='editData.location'>
          <template slot="prepend">景点地址</template>
        </el-input>
      </div>
      <div class="item">
        <span style="margin-right:20px">景点所在区</span>
        <el-select v-model="editData.area" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="item">
        <el-input autosize type='textarea' placeholder="景点描述" v-model='editData.desc'>
          <template slot="prepend">景点描述</template>
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
        centerDialogVisible: false, //修改用户信息弹窗
        total: 1,
        editData: {}, //修改数据
        tableData: [],
        options: [{
          value: '南沙区',
          label: '南沙区'
        }, {
          value: '番禺区',
          label: '番禺区'
        }, {
          value: '白云区',
          label: '白云区'
        }, {
          value: '从化区',
          label: '从化区'
        }, {
          value: '增城区',
          label: '增城区'
        }],
      }
    },
    methods: {
        //取消修改
      cancelEdit: function () {
          this.centerDialogVisible=false;
          this.$message({
              message:'未修改数据',
              type:'info'
          })
      },
      //修改
      handleEdit(index, row) {
        console.log(index, row);
        this.centerDialogVisible = true;
        this.editData = row;
      },
      //确认修改
      confirmEdit: function () {
        if (this.editData.sceneryName == "") {
          this.$message({
            message: '景点名不能为空',
            type: 'warning'
          })
          return
        }
        if (this.editData.location == "") {
          this.$message({
            message: '景点位置不能为空',
            type: 'warning'
          })
          return
        }
        var _this = this;
        var params = new URLSearchParams();
        params.append("sceneryId", _this.editData.sceneryId);
        params.append("sceneryName", this.editData.sceneryName);
        params.append("location",this.editData.location);
        params.append("area", this.editData.area);
        params.append("desc",this.editData.desc)
        axios({
          url: 'http://127.0.0.1:1234/modifyscenery',
          method: 'post',
          data: params,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (res) {
          console.log(res.data.res_code);
          if (res.data.res_code === 0) {
            _this.$message({
              message: '信息修改成功',
              type: 'success'
            })
            _this.centerDialogVisible = false;
          } else {
            _this.$message({
              message: '信息修改失败',
              type: 'success'
            })
          }
        }).catch(function () {

        })
      },
      //删除
      handleAddComment(index, row) {
        console.log(index, row);
      },
      //页数改变事件
      currentChange: function (e) {
        console.log(e);
        this.getScenery(e); //获取信息
      },
      //搜索
      search: function () {
        this.getScenery(1); //获取信息
      },
      /**
       * 
       * 获取景点信息
       */
      getScenery: function (index) {
        var params = new URLSearchParams();
        params.append("keyWords", this.searchKw);
        params.append("page", index);
        params.append("pageSize", 10);
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
            _this.loading = false;
            _this.tableData = res.data.data;
            _this.total = res.data.length;
          }else{
              _this.tableData=[];
          }

        }).catch(function (res) {

        })
      }

    },
    mounted: function () {
      this.getScenery(1); //获取第一页数据
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

</style>
