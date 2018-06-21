<template>
  <div>
    <h1 class="title">添加景点信息</h1>
    <div class="item">
      <el-input placeholder="景点名称" v-model.trim='sceneryName'>
        <template slot='prepend'>景点名称</template>
      </el-input>
    </div>
    <div class="item">
      <el-input placeholder="景点位置" v-model.trim='location'>
        <template slot='prepend'>景点位置</template>
      </el-input>
    </div>
    <div class="item">
      <el-select v-model="areas" placeholder="请选择地区">
        <el-option v-for="item in area" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="item">
      <el-input type='textarea' placeholder="说明或者描述" v-model.trim='desc'>
      </el-input>
    </div>
    <div class="item">
      <div class="el-upload el-upload--picture-card" v-for='item in imageInfo'>
        <img :src="item" alt="">
      </div>
      <div class="el-upload el-upload--picture-card" v-if='imageInfo.length==0'>
        <input type="file" name='file' @change="fileUpload($event)">
      </div>
    </div>
    <div class="item">
      <el-button type='primary' @click='onSubmit()'>提交数据</el-button>
    </div>
  </div>


  </div>
</template>
<script>
  import axios from 'axios'
  import Vue from 'vue';
  export default {
    data() {
      return {
        area: [{
            value: '南沙区',
            label: '南沙区'
          },
          {
            value: '番禺区',
            label: '番禺区'
          },
          {
            value: '天河区',
            label: '天河区'
          },
          {
            value: '海珠区',
            label: '海珠区'
          },
          {
            value: '越秀区',
            label: '越秀区'
          },
          {
            value: '增城区',
            label: '增城区'
          },
          {
            value: '白云区',
            label: '白云区'
          },
          {
            value: '从化区',
            label: '从化区'
          },
          {
            value: '荔湾区',
            label: '荔湾区'
          },
          {
            value: '黄浦区',
            label: '黄浦区'
          },
          {
            value: '花都区',
            label: '花都区'
          }
        ],
        sceneryName: '',
        location: '',
        areas: '',
        desc: '',
        imageInfo: [], //图片数据
        formData: new FormData()
      }
    },
    mounted() {},
    computed: {},
    methods: {
      fileUpload(e) {
        console.log(e);
        //创建读取文件的对象  
        var reader = new FileReader();
        var _this = this;




        var formData = new FormData();
        for (let i = 0; i < e.target.files.length; i++) {
          formData.append("file", e.target.files[i]);

          //正式读取文件  
          reader.readAsDataURL(e.target.files[i]);
          //为文件读取成功设置事件  
          reader.onload = function (res) {
            // console.log(res.target.result);
            // console.log(this);
            _this.imageInfo.push(res.target.result);
          };
        }
        // formData.append("file[]",e.target.files[0]);
        this.formData = formData;
      },
      onSubmit: function () {

        if (this.sceneryName == "" || this.location == "" || this.areas == "" || this.desc == "") {
          this.$message({
            message: '请填写表单完整内容',
            type: 'warning'
          })
          return;
        }
        if (this.imageInfo.length == 0) {
          this.$message({
            message: '请选择一张图片',
            type: 'warning'
          })
          return;
        }
        var _this = this;
        this.formData.append("sceneryName", this.sceneryName);
        this.formData.append("location", this.location);
        this.formData.append("areas", this.areas);
        this.formData.append("desc", this.desc);
        // return;
        axios({
          url: "http://127.0.0.1:1234/addscenery",
          method: 'post',
          data: this.formData,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (res) {
          console.log(res);
          if (res.data.res_code == 0) {
            // _this.$message({
            //   message: '信息上传成功',
            //   type: 'success'
            // })
            this.$alert('信息添加成功', '温馨提示', {
              confirmButtonText: '确定',
              callback: action => {
                
              }
            });
          } else {
            this.$alert('信息添加失败，请稍后重试', '温馨提示', {
              confirmButtonText: '确定',
              callback: action => {
                
              }
            });
          }
        })
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    }
  }

</script>
<style scoped>
  .item {
    margin-top: 20px;
  }

  h1.title {
    font-weight: bold;
    font-size: 36px;
    color: #336699;
    margin-bottom: 20px;
  }

  .item span {
    margin-right: 25px;
  }

  .el-upload--picture-card {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    line-height: 146px;
    vertical-align: top;

  }

  .el-upload {
    display: inline-block;
    text-align: center;
    cursor: pointer;
    outline: 0;
    position: relative;
  }

  .el-upload.el-upload--picture-card img {
    width: 100%;
    height: 100%;
  }

  .el-upload input[type=file] {
    position: absolute;
    width: 148px;
    height: 148px;
    font-size: 100px;
    left: 0;
    top: 0;
    opacity: 0;
    filter: alpha(opacity=0);
    cursor: pointer
  }

</style>
