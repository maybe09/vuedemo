<template>
  <el-card>
    <!-- 面包屑导航 -->
    <breadNav :navone="'商品管理'" :navtwo="'商品分类'"/>
    <!-- 按钮 -->
    <el-row class="mybtn">
      <el-button type="success" plain>添加分类</el-button>
    </el-row>
    <!-- 表格 -->
    <el-table :data="showPage" style="width: 100%" border>
      
        <!-- prop当前列显示的数据属性 -->
        <!-- label 表头的名称 -->
        <!-- treeKey当前数据的唯一标识 -->
        <!-- parentKey当前元素的父元素的标识 -->
        <!-- levelKey当前元素的级别 -->
           <el-table-tree-column 
            file-icon="icon icon-file" 
            folder-icon="icon icon-folder" 
            treeKey="cat_id"
            parentKey="cat_pid"
            levelKey="cat_level"
            prop="cat_name" label="分类名称" width="320"></el-table-tree-column>
      
      <el-table-column  label="级别" width="180">
          <template slot-scope="scope">
             {{scope.row.cat_level=='0'?'一级':(scope.row.cat_level=='1'?'二级':'三级')}}
          </template>
      </el-table-column>
      <el-table-column  label="是否有效">
          <template slot-scope="scope">{{scope.row.cat_deleted?'无效':'有效'}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain  size="mini" ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentpage"
      :page-sizes="pagesizes"
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
  data(){
      return{
          tableData:[],
          showPage:[],
          currentpage:1,
          pagesize:5,
          pagesizes:[5,10,15],
          total:0,
      }
  },
  methods:{
    //   封装一个方法,获取数据
  async  getCategory(){
       let res=await this.$http.get('categories?type=3');
      //  console.log(res.data);
       let {meta,data}=res.data;
       if(meta.status==200){
          this.tableData=data;
          this.total=data.length;
          this.getPage();
       }else{
           this.$message.error(meta.msg)
       }
       
    },
    // 得到分页数据源的方法
    getPage(){
       let start=(this.currentpage-1)*this.pagesize;
       let end=this.currentpage*this.pagesize;
         //  应该显示的数据
         this.showPage=this.tableData.slice(start,end)
    },
    // 每页显示数量的方法
    handleSizeChange(val){
       this.pagesize=val;
       this.getPage();
    },
    // 当前页变化的方法
    handleCurrentChange(val){
       this.currentpage=val;
       this.getPage();
    }
  },
  mounted(){
      this.getCategory();
  }
};
</script>

<style scoped>
.mybtn {
  margin-top: 20px;
}
</style>
