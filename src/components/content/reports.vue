<template>
    <div>
      <div id="main" style="width:800px;height:500px"></div>
    </div>
</template>

<script>
// 引入echarts
import echarts from 'echarts';
export default {
async mounted(){
   var myChart = echarts.init(document.getElementById('main'));
   let res=await this.$http.get(`reports/type/1`);
  //  console.log(res.data);
   let {meta,data}=res.data;
   
   var option={
      title: {
        text: '用户来源'
    },
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    }
   }
   option={...data,...option}
   option.xAxis[0].type='category';
   option.xAxis[0].boundaryGap=false;
   myChart.setOption(option)
 }
}
</script>

<style>

</style>
