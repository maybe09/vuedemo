<template>
  <div class="box">
    <el-container>
      <el-header>
        <!-- 顶部通栏 -->
        <Head></Head>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- 侧边栏 -->
         <Aside></Aside>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import Head from '../layout/header.vue'
import Aside from '../layout/aside.vue'
export default {
  mounted() {
    // let token = window.localStorage.getItem("token");
    // if (!token) {
    //   //    跳转到登录页面
    //   this.$router.push("/login");
    // }
  },
  components:{
     Head,
     Aside
  }
};
</script>
<style scoped>
.box {
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}

.el-container {
  height: 100%;
}

.mymenu{
  height: 100%;
}
</style>


