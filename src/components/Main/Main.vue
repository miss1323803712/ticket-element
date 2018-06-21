<template>
  <div class="ecahrs">
    <div id="order" style="width: 1000px;height:500px;"></div>
    <div id="comment" style="width: 1000px;height:500px;"></div>
    <div id="price" style="width: 1000px;height:600px;"></div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  import axios from 'axios'
  export default {
    data() {
      return {
        order: {
          title: {
            text: '订单数量'
          },
          tooltip: {},
          legend: {
            data: ['销量']
          },
          xAxis: {
            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        },
        comment: {
          title: {
            text: '评论数量'
          },
          tooltip: {},
          legend: {
            data: ['数量']
          },
          xAxis: {
            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
          },
          yAxis: {},
          series: [{
            name: '数量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        },
        option:{
          title: {
            text: '折线图堆叠'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['订单数量', '评论数量', '平均价格', '评分']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
              name: '订单数量',
              type: 'line',
              stack: '总量',
              data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              name: '评论数量',
              type: 'line',
              stack: '总量',
              data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
              name: '平均价格',
              type: 'line',
              stack: '总量',
              data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
              name: '评分',
              type: 'line',
              stack: '总量',
              data: [320, 332, 301, 334, 390, 330, 320]
            }
          ]
        }
      }
    },
    mounted() {
      console.log(echarts);

      var params = new URLSearchParams();
      params.append("keyWords", "");
      params.append("page", 1);
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
          var sceneryName = [];
          var comment = [];
          var order = [];
          var ratings = [];
          var avgPrice = [];
          for (let i = 0; i < res.data.data.length; i++) {
            sceneryName.push(res.data.data[i].sceneryName.substr(0, 3));
            comment.push(res.data.data[i].commentNumber);
            order.push(res.data.data[i].orderCount);
            ratings.push(res.data.data[i].ratings);
            avgPrice.push(res.data.data[i].avgPrice);
          }
          _this.comment.xAxis.data = sceneryName;
          _this.order.xAxis.data = sceneryName;
          _this.order.series[0].data = order;
          _this.comment.series[0].data = comment

          _this.option.xAxis.data=sceneryName;

          _this.option.series[0].data=order;
          _this.option.series[1].data=comment;
          _this.option.series[2].data=avgPrice;
          _this.option.series[3].data=ratings;


          var myChart = echarts.init(document.getElementById('order'));
          var myChartComment = echarts.init(document.getElementById('comment'));
          var myChartprice = echarts.init(document.getElementById('price'));
          // 指定图表的配置项和数据


          // 使用刚指定的配置项和数据显示图表。
          myChart.setOption(_this.order);
          myChartComment.setOption(_this.comment);
          myChartprice.setOption(_this.option);
        }

      }).catch(function (res) {

      })


    }
  }

</script>

<style scoped>
  .echars {
    width: 600px;
    height: 400px;
  }

</style>
