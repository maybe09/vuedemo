<template>
    <el-card>
        <!-- 面包屑导航 -->
        <breadNav :navone="'商品管理'" :navtwo="'商品参数'"/>
    </el-card>
</template>

<script>
import breadNav from "../layout/breadnav.vue";
export default {
  components: {
    breadNav
  },
}
</script>

<style>

</style>
