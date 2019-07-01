<template>
    <el-row>
          <el-col class="mycol" :span="4">
            <div class="grid-content bg-purple">
              <img src="../../assets/logo.1.png" alt>
            </div>
          </el-col>
          <el-col class="mycol" :span="16">
            <div class="grid-content bg-purple-light">
              <h1>电商后台管理</h1>
            </div>
          </el-col>
          <el-col class="mycol loginout" :span="4">
            <div class="grid-content bg-purple">
              <a href="#" @click.prevent="logout">退出</a>
            </div>
          </el-col>
        </el-row>
</template>

<script>
export default {
    methods:{
        logout(){
            this.$confirm('您确定要退出吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!'
          });
        })
            // 先移出token,然后跳转到login页面
            window.localStorage.removeItem('token');
            this.$router.push('/login');
        }
    }
}
</script>

<style scoped>
.mycol {
  height: 60px;
}
.loginout {
  text-align: right;
}
.loginout a {
  text-decoration: none;
  color: red;
}
</style>
