<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo mymenu"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :router="true"
    :unique-opened="true"
  >
    <el-submenu :index="item1.path" v-for="(item1,index1) in menusList" :key="index1">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>{{item1.authName}}</span>
      </template>
      <el-menu-item :index="'/'+ item2.path" v-for="(item2,index2) in item1.children" :key="index2">
        <i class="el-icon-menu"></i>
        <span>{{item2.authName}}</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      menusList: []
    };
  },
  methods: {
    async getMenus() {
      let res = await this.$http.get('menus');
      // console.log(res.data);
      
      let { meta, data } = res.data;
      if (meta.status == 200) {
        this.menusList = data;
        // console.log(this.menusList);
      }else{
        this.$message.error(meta.msg);
      }
    }
  },
  mounted(){
    this.getMenus();
  }
};
</script>

<style>
</style>
