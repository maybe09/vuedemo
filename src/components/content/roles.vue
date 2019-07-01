<template>
  <el-card>
    <!-- 面包屑导航栏 -->
    <breadNav :navone="'权限管理'" :navtwo="'角色列表'"/>
    <!-- 按钮 -->
    <el-row class="myrow">
      <el-button @click="roleShow">添加角色</el-button>
    </el-row>
    <!-- 角色列表 -->
    <el-table :data="listData" style="width: 100%" border>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="(item1,index1) in scope.row.children" :key="index1">
            <el-col :span="4">
              <el-tag
                @close="myclose(scope.row.id,item1.id,scope)"
                type="primary"
                closable
              >{{ item1.authName }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2,index2) in item1.children" :key="index2">
                <el-col :span="5">
                  <el-tag
                    @close="myclose(scope.row.id,item2.id,scope)"
                    type="success"
                    closable
                  >{{ item2.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="19">
                  <el-tag
                    type="warning"
                    closable
                    v-for="(item3,index3) in item2.children"
                    :key="index3"
                    @close="myclose(scope.row.id,item3.id,scope)"
                  >{{ item3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- slot-scope: 可以用来获取当前行的数据 -->
          <!-- 两个按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
            @click="rolesEdit(scope.row.id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="mini"
            @click="rolesdelete(scope.row.id)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            plain
            size="mini"
            @click="rolescheck(scope)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增角色的弹框 -->
    <el-dialog title="添加角色" :visible.sync="showAddroles">
      <el-form :model="rolesObj" :rules="rules" ref="addRoles">
        <el-form-item label="角色名称" prop="roleName" :label-width="formLabelWidth">
          <el-input v-model="rolesObj.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" :label-width="formLabelWidth">
          <el-input v-model="rolesObj.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddroles = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改弹框 -->
    <el-dialog title="修改角色" :visible.sync="showEditroles">
      <el-form :model="rolesObj" :rules="rules" ref="addRoles">
        <el-form-item label="角色名称" prop="roleName" :label-width="formLabelWidth">
          <el-input v-model="rolesObj.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" :label-width="formLabelWidth">
          <el-input v-model="rolesObj.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditroles = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 权限分配弹框 -->
    <el-dialog title="权限分配" :visible.sync="showDivid">
      <!-- data表示数据源, -->
      <!-- show-checkbox显示多选框 -->
      <!-- default-expand-all 默认展示所有节点 -->
      <!-- node-key设置当前接节点的唯一标识 -->
      <!-- props指定数据源中绑定文本的属性和子选项的属性 -->
      <el-tree
        :data="rightList"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        :props="props"
        :default-checked-keys="defaultCheck"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDivid = false">取 消</el-button>
        <el-button type="primary" @click="addRights">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import breadNav from "../layout/breadnav.vue";
export default {
  data() {
    return {
      listData: [],
      rolesObj: {},
      rightList:[],
      props:{
        label:'authName',
        children:'children'
      },
      defaultCheck:[],//默认选中的数组
      showAddroles: false, //新增弹框
      showEditroles: false, //编辑弹框
      showDivid: false, //分配角色弹框
      formLabelWidth: "150px", //设置文本的宽度
      rid:'',
      rules: {
        roleName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        roleDesc: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 封装一个方法,roles页面一打开,动态获取数据并渲染到页面
    getAllRole() {
      this.$http.get("roles").then(res => {
        // console.log(res.data);
        let { meta, data } = res.data;
        if (meta.status === 200) {
          this.listData = data;
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    roleShow() {
      this.showAddroles = true;
    },
    addRoles() {
      // 判断参数的合法性
      this.$refs.addRoles.validate(valid => {
        if (valid) {
          this.$http
            .post("roles", {
              roleName: this.rolesObj.roleName,
              roleDesc: this.rolesObj.roleDesc
            })
            .then(res => {
              //  console.log(res.data);
              let { meta } = res.data;
              if (meta.status == 201) {
                this.$message({
                  message: meta.msg,
                  type: "success"
                });
                this.getAllRole();
                // 清空输入框
                this.rolesObj.roleName = "";
                this.rolesObj.roleDesc = "";
                this.showAddroles = false;
              } else {
                this.$message.error(meta.msg);
              }
            });
        } else {
          this.$message.error("角色名称和描述不合法");
          return false;
        }
      });
    },
    // 编辑角色
    async rolesEdit(id) {
      this.showEditroles = true;
      let res = await this.$http.get(`roles/${id}`);
      // console.log(res);
      let { meta, data } = res.data;
      if (meta.status == 200) {
        this.rolesObj = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 提交编辑后的数据
    editRoles() {
      this.$refs.addRoles.validate(valid => {
        if (valid) {
          this.$http
            .put(`roles/${this.rolesObj.roleId}`, {
              roleName: this.rolesObj.roleName,
              roleDesc: this.rolesObj.roleDesc
            })
            .then(res => {
              let { meta } = res.data;
              if (meta.status == 200) {
                this.$message({
                  message: meta.msg,
                  type: "success"
                });
                this.getAllRole();
                // 清空输入框
                this.rolesObj.roleName = "";
                this.rolesObj.roleDesc = "";
                this.showEditroles = false;
              } else {
                this.$message.error(meta.msg);
              }
            });
        } else {
          this.$message.error("角色名称和描述不合法");
          return false;
        }
      });
    },
    // 删除角色
    rolesdelete(id) {
      this.$confirm("您确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.delete(`roles/${id}`).then(res => {
            let { meta } = res.data;
            if (meta.status == 200) {
              this.$message({
                message: meta.msg,
                type: "success"
              });
              this.getAllRole();
            } else {
              this.$message.error(meta.msg);
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
    // 删除权限
    async myclose(roleId, rigthId, scope) {
      let res = await this.$http.delete(`roles/${roleId}/rights/${rigthId}`);
      // console.log(res.data);
      let { meta, data } = res.data;
      if (meta.status == 200) {
        this.$message({
          message: meta.msg,
          type: "success"
        });
        scope.row.children = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 显示分配权限弹框
   async rolescheck(scope) {
    this.rid=scope.row.id;
    // 前清空之前默认选中的
    this.defaultCheck=[];
    this.showDivid = true;
    let res=await this.$http.get('rights/tree')
    let {meta,data}=res.data;
    if(meta.status==200){
      this.rightList=data;
      // 得到所有选中的三级权限,三级权限被选中,那么对应的二级和一级也会处于半选中状态
      // 获得默认选中已有权限的原理
      // 点击编辑的时候,此时可以通过scope获得当前行的所有数据,包括当前的这个角色拥有的权限
      // 三级权限被选中,对应的一级和二级也可以获取到,所以只需要管第三级权限是什么,然后给它
      // 设置默认选中,默认选中会是一个数组,获取第三级权限的id组成这个数组
      scope.row.children.forEach(item1 => {
           item1.children.forEach(item2=>{
           item2.children.forEach(item3=>{
             this.defaultCheck.push(item3.id)
           })
        })
      });
      console.log(this.defaultCheck);
      
    }else{
      this.$message.error(meta.msg);
    }

  },
  async addRights(){
    let rigthId=this.$refs.tree.getCheckedKeys()
    let roleId=this.$refs.tree.getHalfCheckedKeys();
    // console.log(rigthId,roleId);
    let arr=[...rigthId,...roleId];
    let rids=arr.join(',');
    // console.log(rids);
    let res=await this.$http.post(`roles/${this.rid}/rights`,{
      rids:rids
    })
    let {meta}=res.data;
    if(meta.status==200){
        this.$message({
                message: meta.msg,
                type: "success"
              });
              this.getAllRole();
              this.showDivid=false;
    }else{
      this.$message.error(meta.msg);
    }
    
    
  }

  },
  
  mounted() {
    this.getAllRole();
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
