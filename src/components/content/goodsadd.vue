<template>
  <el-card>
    <!-- 面包屑导航栏 -->
    <breadNav :navone="'商品管理'" :navtwo="'商品列表'"/>
    <!-- 消息提示 -->
    <el-alert class="myalert" title="添加商品信息" type="info" center show-icon></el-alert>
    <!-- 
        步骤条
    -->
    <el-steps class="mysteps" :active="active" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tab标签页 -->
    <el-tabs tabPosition="left" class="mytbs" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first">
        <el-form :label-position="'top'" label-width="80px" :model="addObj" :rules="rules">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addObj.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addObj.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addObj.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addObj.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            {{cateList}}
            <el-cascader v-model="cateList" :options="options" :props="props"></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="second">
        <div v-for="(item1,index1) in manyparams" :key="index1">
          <h4>{{item1.attr_name}}</h4>
          <div>
            <el-checkbox
              v-for="(item2,index2) in item1.attr_vals.split(',')"
              :key="index2"
              v-model="checked"
              border
            >{{item2}}</el-checkbox>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name="third">
        <div v-for="(item1,index1) in onlyparams" :key="index1">
          <h4>{{item1.attr_name}}</h4>
          <el-input v-model="item1.attr_vals" placeholder="请输入内容"></el-input>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="fourth">
        <el-upload
        :on-success="Success"
        :on-remove="remove"
        :on-preview="preview"
        :headers="uploadHeader"
        :file-list="fileList"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        {{fileList}}
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="fifth">
          <el-button @click="addGoods">添加商品</el-button>
          <quill-editor v-model="content"></quill-editor>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="图片预览" :visible.sync="imgVisible">
     <img ref="myimg">
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="imgVisible = false">确 定</el-button>
      </div>
</el-dialog>
  </el-card>
</template>

<script>
import breadNav from "../layout/breadnav.vue";
export default {
  data() {
    return {
      active: 0,
      addObj: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: ""
      },
      options: [], //下拉框中的数据源
      cateList: [], //当前级联选择框中选中的数据数组
      props: {
        value: "cat_id",
        label: "cat_name",
        expandTrigger: "hover"
      },
      checked: true, //选择框默认选中
      onlyparams: [],
      manyparams: [],
      fileList:[],//文件上传的列表集合
      uploadHeader:{
          Authorization:localStorage.getItem('token')
      },
      imgVisible:false,//图片预览
      content:'默认内容',
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品分类", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleClick(tab, event) {
      //  console.log(tab.index);
      this.active = +tab.index;
      //   判断是否点击了商品参数和商品分类
      if (tab.index === "1" || tab.index === "2") {
        //    如果点击了,需要再判断是否选择了商品分类
        if (this.cateList.length == 0) {
          this.$message.error("请选择商品分类");
          return;
        }
        this.getcateParams(tab.index);
      }
    },
    // 封装一个获取商品参数和商品分类页面数据的方法
    async getcateParams(index) {
      let id = this.cateList[this.cateList.length - 1];
      let sel = index === "1" ? "many" : "only";
      let res = await this.$http.get(`categories/${id}/attributes?sel=${sel}`);
      console.log(res.data);
      let { meta, data } = res.data;
      if (meta.status == 200) {
        if (index === "1") {
          this.manyparams = data;
        } else {
          this.onlyparams = data;
        }
      }
    },
    // 图片上传成功后,将图片的name和url保存到数组中
    Success(res, file,fileList){
        // console.log(res);
        // console.log(file);
        // console.log(fileList);
        this.fileList.push({
           name:res.data.tmp_path,
           url:res.data.url 
        })
        
        
    },
    //   删除上传的文件,需要将文件的数据从fileList中移出
    remove(file,fileList){
      console.log(file);
      for(var i = 0;i<this.fileList.length;i++){
        if(file.name==this.fileList[i].name){
           this.fileList.splice(i,1)
        }
      }
      
    },
    // 图片预览
    preview(file){
       this.imgVisible=true;
       this.$nextTick(function () {
       this.$refs.myimg.src=file.url;
       })
       
    },
    // 提交新增数据
   async addGoods(){
      let postObj={
        goods_name:this.addObj.goods_name,
        goods_cat:this.cateList.join(','),
        goods_price:this.addObj.goods_price,
        goods_number:this.addObj.goods_number,
        goods_weight:this.addObj.goods_weight,
        goods_introduce:this.content,
      }
     let res=await this.$http.post('goods',postObj);
     console.log(res.data);
     
     let {meta}=res.data;
    if(meta.status===201){
        this.$message({
                message: meta.msg,
                type: "success"
              });
              // 跳转到goods页面
              this.$router.push('/goods')
    }else{
      this.$message.error(meta.msg);
    }
    },
    // 请求下拉框中数据的方法
    async getSelect() {
      let res = await this.$http.get("categories?type=3");
      console.log(res.data);
      let { meta, data } = res.data;
      if (meta.status == 200) {
        this.options = data;
      }
    }
  },

  mounted() {
    this.getSelect();
  },
  components: {
    breadNav
  }
};
</script>

<style>
.myalert,
.mysteps,
.mytbs {
  margin-top: 20px;
}
.el-step__title {
  font-size: 12px !important;
}
.ql-container {
  height: 300px;
}
h4 {
    font-weight: 400;
    font-size: 14px;
  }
</style>
