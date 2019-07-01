<template>
  <el-card>
    <!-- 面包屑导航 -->
    <breadNav :navone="'商品管理'" :navtwo="'商品列表'"/>
    <!-- 搜索框 -->
    <el-row class="myrow">
      <el-col :span="8">
        <div class="grid-content bg-purple-dark">
          <el-input placeholder="请输入内容" v-model="goods" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="serchGoods"></el-button>
          </el-input>
        </div>
      </el-col>
      <!-- 添加按钮 -->
      <el-col :span="16">
        &nbsp;
        <el-button type="success" plain @click="showAdd">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="goodsList" style="width: 100%" border height="400">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="500"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="120"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="100"></el-table-column>
      <el-table-column  label="创建时间">
        <!-- prop="add_time"  -->
        <template slot-scope="scope">{{scope.row.add_time | formate}}</template>
      </el-table-column>
      <el-table-column  label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
           
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="mini" @click="delGoods(scope.row.goods_id)"></el-button>
         
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
import breadNav from "../layout/breadnav.vue";
export default {
  components: {
    breadNav
  },
  data() {
    return {
      goods: "",
      pagenum:1,//当前页
      pagesize:10,//每页显示条数
      query:'',
      goodsList:[],
      total:0,//总条数
    };
  },
  methods: {
    //   封装一个获取数据的方法
     getGoods(){
         this.$http.get('goods',{
             params: {
            pagenum: this.pagenum,
            pagesize: this.pagesize,
            query: this.goods
          }
         }).then(res=>{
             let {meta,data}=res.data;
             if(meta.status==200){
                this.goodsList=data.goods;
                this.total=data.total
             }
             
         })
     },
    //  每页显示的数量变化的函数
     handleSizeChange(num){
        this.pagenum=1;
        this.pagesize=num;
        this.getGoods();
     },
    //  当前页变化的函数
    handleCurrentChange(page){
       this.pagenum=page;
       this.getGoods();
    },
    //   搜索数据
     serchGoods(){
      this.getGoods()
   },
   //  删除数据
   delGoods(id){
        this.$confirm('您确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`goods/${id}`)
      .then(res=>{
        //   console.log(res.data);
        let {meta}=res.data;
        if(meta.status===200){
            this.$message({
                message: meta.msg,
                type: "success"
              });
            //   调用方法重新渲染页面
            this.getGoods()
        }else{
            this.$message.error(meta.msg);
        }
      })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      
   },
   showAdd(){
     this.$router.push('/goods/add')
   }  
   
  },

   mounted(){
     this.getGoods()
   }
};
</script>

<style scoped>
.myrow {
  margin-top: 20px;
}
</style>
