<template>
  <div class="container">
    <div class="login-container">
      <h2>后台管理系统登录</h2>
      <div class="input-item">
        <el-input placeholder="请输入账号" v-model.trim="username" clearable>
          <template slot="prepend">账号:</template>
        </el-input>
      </div>
      <div class="input-item">
        <el-input placeholder="请输入密码" type='password' v-model.trim="password" clearable>
          <template slot="prepend">密码:</template>
        </el-input>
      </div>
      <el-button type="primary" icon="el-icon-success" :loading='loading' @click='submit'>登 &nbsp; 录</el-button>
    </div>
  </div>

</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        username: '',
        loading: false,
        password: ''
      }
    },
    methods: {
      submit: function () {
        if (this.username == '') {
          this.$message({
            message: '请输入账号',
            type: 'warning'
          });
          return;
        }
        if (this.password == '') {
          this.$message({
            message: '请输入密码',
            type: 'warning'
          });
          return;
        }
        console.log('请求');
        var _this=this;
        var params=new URLSearchParams();
        params.append("username",this.username);
        params.append("password",this.password);
        axios({
          url:"http://127.0.0.1:1234/adminlogin",
          method:'post',
          data:params,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function(res){
          console.log(res);
          if(res.data.res_code==0){
            sessionStorage.setItem("username",_this.username);
            _this.$router.push({name:'main'})
          }else{
            _this.$message({
              message:res.data.res_msg,
              type:'error'
            })
          }
        })
      }
    }
  }

</script>

<style scoped>
  .container {
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2d3a4b;
    text-align: center;
  }
  .container h2{
    margin-bottom: 20px;
  }

  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    width: 350px;
    padding: 20px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .login-container .input-item {
    margin-bottom: 20px;
  }

</style>
