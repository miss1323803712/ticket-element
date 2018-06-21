<template>
  <el-container>
    <el-col :span='16' :offset="4">
      <h1 class="title">添加票类信息</h1>
      <div class="item">
        <span>景点名称</span>
        <el-select v-model="scenery" placeholder="请选择">
          <el-option v-for="item in options" :key="item.sceneryId" :label="item.sceneryName" :value="item.sceneryId">
          </el-option>
        </el-select>
      </div>
      <div class="item">
        <span>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
        <el-input-number v-model="price" @change="handleChange" :min="1" label="描述文字"></el-input-number>
      </div>
      <div class="item">
        <el-input v-model.trim='ticketName' placeholder="票类名称">
          <template slot='prepend'>票类名称</template>
        </el-input>
      </div>
      <div class="item">
        <el-input placeholder="说明" v-model.trim='ticketDesc'>
          <template slot='prepend'>说明</template>
        </el-input>
      </div>
      <div class="item">
        <el-button type='primary' icon="el-icon-check" plain @click='submit'>提交</el-button>
      </div>
    </el-col>
  </el-container>
</template>
<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        scenery: '',
        price: 100,
        ticketName: '',
        ticketDesc: "需要在游玩当天的16:00前预订条件退使用日期开始前1天23:30前可申请退款 不支持部分退款",
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
    mounted: function () {
      this.getScenery(1);
    },
    methods: {
      handleChange(val) {
        console.log(val);
      },
      //下拉选择框数据
      getScenery: function (index) {
        var params = new URLSearchParams();
        params.append("keyWords", "");
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
          }

        }).catch(function (res) {

        })
      },
      submit: function () {
        console.log("提交");
        if (this.ticketName == '') {
          this.$message({
            message: '请输入票类名称',
            type: 'warning'
          })
          return;
        }

        var params = new URLSearchParams();
        params.append("sceneryId", this.scenery);
        params.append("price", this.price);
        params.append("ticketName", this.ticketName);
        params.append("ticketDesc", this.ticketDesc);
        var _this = this;
        axios({
          url: 'http://127.0.0.1:1234/addticket',
          method: 'post',
          data: params,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (res) {
          console.log("景点信息", res);
          if (res.data.res_code == 0) {
            _this.$message({
              message: '添加成功',
              type: 'warning'
            })
          } else {
            _this.$message({
              message: '添加失败',
              type: 'warning'
            })
          }

        }).catch(function (res) {

        })

      }
    }
  }

</script>
<style scoped>
  .el-container {
    min-height: 60vh;
  }

  .title {
    padding: 20px;
    font-weight: bold;
  }

  .item {
    margin: 20px;
  }

  .item span {
    margin-right: 40px;
  }

</style>
