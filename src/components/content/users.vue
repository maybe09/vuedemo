<template>
  <el-card class="box-card">
    <!-- 面包屑导航栏 -->
    <breadNav :navone="'用户管理'" :navtwo="'用户列表'"/>
    <!-- input输入框 -->
    <el-row class="myrow">
      <el-col :span="8">
        <div class="grid-content bg-purple-dark">
          <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
          </el-input>
        </div>
      </el-col>
      <!-- 添加按钮 -->
      <el-col :span="16">
        &nbsp;
        <el-button type="success" plain @click="showAdd">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格区域 -->
    <el-table :border="true" :data="tableData" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeSta(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
            @click="showEdit(scope.row.id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="mini"
            @click="delData(scope.row.id)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            plain
            size="mini"
            @click="showSet(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增对话框 -->
    <el-dialog title="添加用户" :visible.sync="addVisible">
      <el-form :model="formObj" :rules="rules" ref="addForm">
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="formObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="formObj.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="formObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="formObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="postData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="修改用户" :visible.sync="editVisible">
      <el-form :model="formObj" :rules="rules" ref="addForm">
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input :disabled="true" v-model="formObj.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="formObj.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="formObj.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 设置角色页面 -->
    <el-dialog title="分配角色" :visible.sync="rolesVisible">
      <el-form :model="formObj" ref="addForm">
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">{{formObj.username}}</el-form-item>
        <!-- 下拉选择框 -->
        <el-form-item label="请选择角色" :label-width="formLabelWidth">
          <el-select v-model="formObj.rid" placeholder="请选择">
            <el-option :value="-1" label="请选择"></el-option>
            <!--:label 下拉框中的文本内容,  :value设置下拉框的value属性 -->
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="postRoles">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import breadNav from "../layout/breadnav.vue";
export default {
  data() {
    return {
      search: "",
      tableData: [],
      pagenum: 1,
      pagesize: 10,
      formObj: {},
      options: [],
      addVisible: false, //新增弹框
      editVisible: false, //编辑弹框
      rolesVisible: false, //设置角色弹框
      formLabelWidth: "150px", //对话框里文本内容的宽度
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 封装一个获取数据的方法
    getData() {
      //  获取token,发送get请求数据
      let token = window.localStorage.getItem("token");
      this.$http
        .get("users", {
          // headers: {
          //   Authorization: token
          // },
          params: {
            pagenum: this.pagenum,
            pagesize: this.pagesize,
            query: this.search
          }
        })
        .then(res => {
          // console.log(res);
          let { data, meta } = res.data;
          if (meta.status === 200) {
            this.tableData = data.users;
          }
        });
    },
    showAdd() {
      this.addVisible = true;
    },
    // 新增用户
    postData() {
      //  验证用户名和密码
      this.$refs.addForm.validate(valid => {
        if (valid) {
          // 如果合法,将数据提交到服务器
          // 需要带上token去请求
          let token = window.localStorage.getItem("token");
          this.$http
            .post(
              "users",
              {
                username: this.formObj.username,
                password: this.formObj.password,
                email: this.formObj.email,
                mobile: this.formObj.mobile
              }
              // {
              //   headers: {
              //     // 请求头中的内容
              //     Authorization: token
              //   }
              // }
            )
            .then(res => {
              // console.log(res);
              let { meta } = res.data;
              if (meta.status === 201) {
                //    新增成功
                this.$message({
                  message: meta.msg,
                  type: "success"
                });
                //  清空输入框
                this.formObj.username = "";
                this.formObj.password = "";
                this.formObj.email = "";
                this.formObj.mobile = "";
                // 关闭新增面板
                this.addVisible = false;
                this.getData();
              }
            });
        } else {
          this.$message.error("用户名和密码不合法");
          return false;
        }
      });
    },
    // 搜索数据
    searchData() {
      this.getData();
    },
    // 给操作按钮注册点击事件
    showEdit(id) {
      this.editVisible = true;
      // 根据id去数据库中请求数据
      this.$http
        .get(`users/${id}`, {
          // headers: {
          //   Authorization: localStorage.getItem("token")
          // }
        })
        .then(res => {
          // console.log(res.data);
          let { data, meta } = res.data;
          if (meta.status == 200) {
            this.formObj = data;
          } else {
            this.$message.error(meta.msg);
            return false;
          }
        });
    },
    editData() {
      this.$http
        .put(`users/${this.formObj.id}`, {
          email: this.formObj.email,
          mobile: this.formObj.mobile
        })
        .then(res => {
          // console.log(res.data);
          let { meta } = res.data;
          if (meta.status == 200) {
            this.$message({
              message: meta.msg,
              type: "success"
            });
            this.editVisible = false;
            this.getData();
          } else {
            this.$message.error(meta.msg);
            return false;
          }
        });
    },
    // 删除数据
    delData(id) {
      this.$confirm("您确定要删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.delete(`users/${id}`).then(res => {
            // console.log(res.data);
            let { meta } = res.data;
            if (meta.status == 200) {
              this.$message({
                message: meta.msg,
                type: "success"
              });
              //  重新渲染页面
              this.getData();
            } else {
              this.$message.error(meta.msg);
              return false;
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 改变用户状态
    changeSta(id, type) {
      this.$http.put(`users/${id}/state/${type}`).then(res => {
        //  console.log(res.data);
        let { meta } = res.data;
        if (meta.status == 200) {
          this.$message({
            message: meta.msg,
            type: "success"
          });
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    // 获取设置觉得列表的思路:
    // 1设置角色列表的弹框一打开,需要动态渲染下拉框中的数据(角色列表),通过get roles去获取
    // 将获取到的数据渲染到下拉框中
    // 2,根据id去请求当前id对应的数据,渲染到页面上,如果是新添加的数据则会显示为-1
    // 那么就写一个固定的下拉框,绑定value为-1,给-1绑定固定的文本为请选择

    // 获取角色列表
    getOption() {
      this.$http.get("roles").then(res => {
        this.options = res.data.data;
      });
    },
    // 设置角色
    showSet(id) {
      this.rolesVisible = true;
      // 根据id去请求当前的这条数据,并渲染到页面上
      this.$http.get(`users/${id}`).then(res => {
        let { data, meta } = res.data;
        if (meta.status == 200) {
          this.formObj = data;
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    // 提交设置角色的数据
    postRoles() {
      this.$http
        .put(`users/${this.formObj.id}/role`, {
          rid: this.formObj.rid
        })
        .then(res => {
          let { meta } = res.data;
          if (meta.status == 200) {
            this.$message({
              message: meta.msg,
              type: "success"
            });
            this.rolesVisible = false;
            this.getData();
          } else {
            this.$message.error(meta.msg);
          }
        });
    }
  },
  mounted() {
    this.getData();
    this.getOption();
  },
  components: {
    breadNav
  }
};
</script>
 
<style scoped>
.myrow {
  margin-top: 20px;
}
</style>
