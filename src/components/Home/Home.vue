<template>
  <el-container>
    <el-aside class="aside">
      <el-row class="tac">
        <el-col :span="24">
          <h1>后台管理系统</h1>
          <el-menu default-active="1" router unique-opened class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#545c64"
            text-color="#fff" active-text-color="#409EFF">
            <el-menu-item index='/'>
              <i class="el-icon-view"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu index="User">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>数据管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="User">用户数据</el-menu-item>
                <el-menu-item index="Scenery">景点数据</el-menu-item>
                <el-menu-item index="Order">订单数据</el-menu-item>
                <el-menu-item index="Comment">评论数据</el-menu-item>
                <el-menu-item index="Ticket">票类数据</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>添加数据</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="addscenery">添加景点信息</el-menu-item>
                <el-menu-item index="addticket">添加票类信息</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-row>
    </el-aside>
    <el-container>
      <el-header>
        <el-breadcrumb separator="/">
          <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>
            <a href="/">活动管理</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>活动列表</el-breadcrumb-item>
          <el-breadcrumb-item>活动详情</el-breadcrumb-item> -->
          <el-button class="exit" type='primary' round icon='el-icon-error' @click='exit'>退出</el-button>
        </el-breadcrumb>

      </el-header>
      <div class="router-view">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </el-container>
  </el-container>
</template>
<script>
  export default {
    data() {
      return {

      }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      //退出
      exit: function () {
        sessionStorage.clear("username");
        this.$router.push({
          name: 'Login'
        });
      }
    }
  }

</script>
<style scoped>
  .el-container {
    min-height: 100vh;
  }

  .el-aside {
    background: #545c64;
    /* border-right:  */
  }

  .el-aside .el-menu {
    border-right: 0 none;
  }

  .el-col>h1 {
    line-height: 100px;
    text-align: center;
    font-size: 30px;
    color: white;
  }

  .el-header {
    height: 60px !important;
    background: #eff2f7;
    position: relative;
  }

  .el-header .el-breadcrumb {
    line-height: 60px;
  }

  .el-header .el-breadcrumb .exit {
    float: right;
    margin-top: 10px;
  }

  .router-view {
    padding: 20px;
    box-sizing: border-box;
  }

</style>
