<template>
  <el-card>
    <!-- 面包屑导航栏 -->
     <breadNav :navone="'权限管理'" :navtwo="'权限列表'" />
    <!-- 表格 -->
    <el-table :data="rightList" style="width: 100%" border >
      <el-table-column type="index" ></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column  label="层级" width="180">
         <template slot-scope="scope"> 
           {{scope.row.level==='0'?'一级':(scope.row.level==='1'?'二级':'三级')}}
         </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import breadNav from '../layout/breadnav.vue'
export default {
    data(){
       return {
           rightList:[]
       }
    },
    // 封装一个获取数据的方法
    methods:{
     async getRights(){
        let res= await this.$http.get('rights/list');
        // console.log(res.data);
        let {data,meta}=res.data;
        this.rightList=data;
        
      }
    },
    mounted(){
      this.getRights()
    },
     components:{
      breadNav
  }
};
</script>

<style>
</style>
