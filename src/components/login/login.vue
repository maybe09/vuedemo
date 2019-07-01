<template>
  <div class="loginbox">
    <el-form
      label-position="top"
      :rules="rules"
      :model="ruleForm"
      status-icon
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button class="btn" type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods:{
    login(){
      // 判断form中的元素是否满足条件判断
       this.$refs.ruleForm.validate((valid) => {
        //  valid是一个布尔值,验证通过返回true,否则返回false
          if (valid) {
            //验证通过,将数据提交到数据库中验证用户和密码是否正确
            this.$http.post('login',this.ruleForm)
            .then(res=>{
              let {data,meta}=res.data;
              if(meta.status===200){
                   this.$message({
                      message: '登录成功',
                      type: 'success'
                       });
                       window.localStorage.setItem('token',res.data.data.token)
                      //  跳转到首页
                      this.$router.push('/home')
                      // console.log(res.data.data.token);
                      
              }else{
                this.$message.error(meta.msg);
              }
            })
          } else {
            this.$message.error('请输入正确的用户名和密码');
            return false;
          }
        });
    }
  }
};
</script>
<style scoped>
.loginbox {
  width: 500px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 40px;
  border-radius: 10px;
  background-color: #fff;
}
.btn {
  width: 100%;
}
</style>
