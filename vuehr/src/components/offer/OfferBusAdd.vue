<template>
<div>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>商务价单</el-breadcrumb-item>
        <el-breadcrumb-item>添加商务价单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-main style="padding-left: 0px;padding-top: 0px;margin-top:30px;">
        <!-- 添加订单基础信息 -->
        <div v-show="nowTab==1">
          <el-tabs v-model="activeName">
   <el-tab-pane label="简单录入" name="first">
     <div style="margin-top: 20px">
     <el-steps :active="nowTab">
       <el-step title="基本信息" icon="el-icon-edit"></el-step>
       <el-step title="报价详情" icon="el-icon-document"></el-step>
     </el-steps>
     </div>
     <el-card style="margin-top:30px;">
       <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="110px" class="demo-ruleForm" style="width:40%">
         <div>
           <el-form-item label="所属项目：" prop="projectId" required>
             <el-select v-model='ruleForm.projectId'  placeholder="请选择所属项目">
               <el-option v-for="item in restaurants3" :key="item.value" :change="toSelect1()" :label="item.label" :value="item.value"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="车型：" prop="carType">
             <el-input v-model="ruleForm.carType" :disabled="true"></el-input>
           </el-form-item>
           <el-form-item label="客户单位：" prop="clientCompanyName">
             <el-input v-model="ruleForm.clientCompanyName" :disabled="true"></el-input>
           </el-form-item>
           <el-form-item label="联系人：" prop="contactPerson">
             <el-input v-model="ruleForm.contactPerson" :disabled="true"></el-input>
           </el-form-item>
           <el-form-item label="联系电话：" prop="contactPhone">
             <el-input v-model="ruleForm.contactPhone" :disabled="true"></el-input>
           </el-form-item>
           <el-form-item label="税率：" prop="tax">
             <el-input-number v-model="ruleForm.tax" controls-position="right" :min="0"></el-input-number>
           </el-form-item>
           <el-form-item label="备注：" prop="remark">
             <el-input type="textarea" v-model="ruleForm.remark"></el-input>
           </el-form-item>
         </div>

       </el-form>
       <div class="card-bottom" style="float:right;">
         <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
       </div>
     </el-card>
   </el-tab-pane>
   <el-tab-pane label="附件上传" name="second">
     <el-card style="margin-top:30px;">
       <el-form :model="fujianForm" ref="fujianForm" :rules="rules" label-width="110px" class="demo-ruleForm" style="width:40%">
         <div>
           <el-form-item label="所属项目：" prop="projectId" required>
             <el-select v-model='fujianForm.projectId'  placeholder="请选择所属项目" >
               <el-option v-for="item in restaurants3"  :change="toSelect()" :key="item.value" :label="item.label" :value="item.value"></el-option>
             </el-select>
           </el-form-item>
           <el-form-item label="车型：" prop="carType">
             <el-input v-model="fujianForm.carType" :disabled="true"></el-input>
           </el-form-item>
           <el-form-item label="客户单位：" prop="clientCompanyName">
             <el-input v-model="fujianForm.clientCompanyName" :disabled="true"></el-input>
           </el-form-item>
           <el-form-item label="联系人：" prop="contactPerson">
             <el-input v-model="fujianForm.contactPerson" :disabled="true"></el-input>
           </el-form-item>
           <el-form-item label="联系电话：" prop="contactPhone">
             <el-input v-model="fujianForm.contactPhone" :disabled="true"></el-input>
           </el-form-item>
           <el-form-item label="不含税总价：" prop="noTaxTotal"  required>
             <el-input-number v-model="fujianForm.noTaxTotal" @blur="toChange" controls-position="right" :min="0"></el-input-number>
           </el-form-item>
           <el-form-item label="税率：" prop="tax">
             <el-input-number v-model="fujianForm.tax" controls-position="right" :min="0"></el-input-number>
           </el-form-item>
           <el-form-item label="含税总价：" prop="total" required>
             <el-input-number v-model="fujianForm.total"  @blur="toChange1" controls-position="right" :min="0"></el-input-number>
           </el-form-item>
           <!-- <el-form-item label="含税总价：" prop="tax" required>
             <span><el-tag type="warning" > {{totalPrice}} 元</el-tag></span>
           </el-form-item> -->
           <el-form-item label="备注：" prop="remark">
             <el-input type="textarea" v-model="fujianForm.remark"></el-input>
           </el-form-item>
           <el-form-item label="上传文件：" >
             <div v-show="wen_jian_url !== ''">
               <p style="color: blue;">上传成功</p>
             </div>
             <div v-show="wen_jian_url === ''">
                 <vue-core-image-upload :class="['el-button', 'el-button--primary']"
                 :crop="false"
                  inputOfFile="imageFile"
                  :url="upload"
                 extensions="png,ppt,docx,txt,jpg,xlsx,pdf"
                 :max-file-size="5242880"
                 :data="wenjianData" text="上传文件"
                 :multiple="true"
                 :multiple-size="30"
                 credentials="true"
                 @imageuploaded="imageupwenjian" @errorhandle="handleError">
                 </vue-core-image-upload>
             </div>
           </el-form-item>
         </div>
       </el-form>
       <div class="card-bottom" style="float:right;">
         <el-button type="primary" @click="tiJiao('ruleForm')">提 交</el-button>
       </div>
     </el-card>
   </el-tab-pane>
 </el-tabs>
        </div>
        <!-- 产品列表 -->
        <div v-show="nowTab==2">
          <el-card class="box-card" style="margin-top:25px;" v-loading="table_loading">
            <div slot="header" class="clearfix">
              <span>产品列表</span>
              <div class="card-bottom" style="float: right;">
                <el-button type="primary" class="el-icon-plus" @click="toAadd">添加</el-button>
              </div>
            </div>
            <div>
              <el-table :data="productData" border style="width: 100%">
                <el-table-column fixed prop="productName" label="产品名称">
                </el-table-column>
                <el-table-column prop="" label="图片">
                  <template slot-scope="scope">
              <img class="image" v-bind:src="scope.row.picUrls[0]" style="height:30px;width:30px;">
            </template>
                </el-table-column>
                <el-table-column prop="wenlidaima" label="纹理代码">
                </el-table-column>
                <el-table-column prop="price" label="单价">
                </el-table-column>
                <el-table-column prop="productNum" label="数量">
                </el-table-column>
                <el-table-column prop="noTaxPrice" label="不含税总计">
                </el-table-column>
                <el-table-column prop="total" label="含税总计">
                </el-table-column>
                <el-table-column prop="area" label="面积">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="300">
                  <template slot-scope="scope">
       <el-button type="text" size="small" @click.native.prevent="toEidtor(scope.$index, productData)">编辑</el-button>
       <el-button
         @click.native.prevent="deleteRow(scope.$index, productData)"
         type="text"
         size="small">
         移除
       </el-button>
     </template>
                </el-table-column>
              </el-table>
            </div>
            <div style="margin-top:20px;margin-bottom:20px;">
              <div class="card-bottom" style="float: left;">
                <el-button type="primary" @click="nowTab = 1">上一步</el-button>
              </div>
              <div class="card-bottom" style="float: right;">
                <el-button type="primary" @click="commit">提 交</el-button>
              </div>
            </div>
          </el-card>
        </div>
        <!-- 产品明细 -->
        <div>
          <el-dialog width="60%" title="产品详情" :visible.sync="innerVisible" :close-on-click-modal="false" append-to-body>
            <el-form ref="elform" :model="elform" :rules="rules" label-width="120px" style="width:100%;">
              <el-form-item label="产品名称：" prop="productName">
                <el-input v-model="elform.productName" style="width:30%;" placeholder="请输入产品名称"></el-input>
              </el-form-item>
              <el-form-item label="纹理代码：" prop="wenlidaima">
                <el-input v-model="elform.wenlidaima" style="width:30%;" placeholder="请输入纹理代码"></el-input>
              </el-form-item>
              <el-form-item label="产品数量：" prop="productNum">
                <el-input-number v-model="elform.productNum" controls-position="right" :min="1"></el-input-number>
              </el-form-item>
              <el-form-item label="面积：" prop="area">
                <el-input-number v-model="elform.area" controls-position="right" :min="0  "></el-input-number>
              </el-form-item>
              <el-form-item label="有无动模：">
                <el-switch v-model="elform.dongMo"></el-switch>
              </el-form-item>
              <el-form-item label="系数：" prop="coefficient">
                <el-input v-model="elform.coefficient" style="width:30%;" placeholder="请输入产品系数"></el-input>
              </el-form-item>
              <el-form-item label="含税总价：" prop="total">
                <el-input-number v-model="elform.total" @blur="toChange3" controls-position="right" :min="0"></el-input-number>
              </el-form-item>
              <el-form-item label="不含税总价：" prop="noTaxPrice">
                <el-input-number v-model="elform.noTaxPrice" @blur="toChange2" controls-position="right" :min="0"></el-input-number>
              </el-form-item>
              <el-form-item label="上传图片：">
                <div>
                  <vue-core-image-upload :crop="false" inputOfFile="imageFile" :url="upload" extensions="png,gif,jpeg,jpg" :class="['el-button', 'el-button--primary']" :max-file-size="5242880" :data="imageData" text="上传图片" :multiple="true" :multiple-size="30" credentials="true"
                    @imageuploaded="imageuploaded" @errorhandle="handleError">
                  </vue-core-image-upload>
                </div>
              </el-form-item>
            </el-form>
            <div style="border: 1px dashed #d9d9d9;width:100%;min-height:358px;">
              <el-row :gutter="20" style="margin-top:10px;">
                <el-col :span="6" v-for="imageUrl in imageUrls ">
                  <el-card :body-style="{ padding: '0px' }" class="mould-card">
                    <img class="image" v-bind:src="imageUrl" style="height:320px;">
                    <div style="text-align:center;">
                      <el-button type="text" @click="delMouldImage(imageUrl)"><i class="el-icon-error" style="color:red;"></i></el-button>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" v-show="!udapteBoolean" @click="toAddProduct">确 定</el-button>
              <el-button type="primary" v-show="udapteBoolean" @click="toUpdateProduct">更 新</el-button>
              <el-button @click="chanel">取 消</el-button>
            </div>
          </el-dialog>
        </div>
      </el-main>
    </el-container>
  </div>
</div>
</template>
<script>
import VueCoreImageUpload from 'vue-core-image-upload';
import JLApiUtils from '../../utils/JLApiUtils.js';
export default {
  components: {
    VueCoreImageUpload
  },
  props: {
    title: String
  },
  data() {
    return {
      wen_jian_url:'',
      upload:'',
      noTaxPrice:"0",
      totalPrice:"0",
      fujianForm:{
        tax: 16,
        noTaxTotal:"0",
        total:"0"
      },
      udapteBoolean: false,
      activeName: 'first',
      itemIndex: '',
      wenjianData: {
          userId: '',
          imgPakage: 'yu_bao_jia'
      },
      itemRow: {},
      imageData: {
        userId: '',
        imgPakage: 'yu_bao_jia'
      },
      table_loading: false,
      imageUrls: [],
      ruleForm: {
        tax: '16',
        addUserId: '',
        addUserName: ''
      },
      elform: {
        productNum:'1',
        area:'0',
        price:'0',
        coefficient:'1',
        dongMo: false
      },
      productData: [],
      restaurants3: [],
      innerVisible: false,
      tableData: [],
      select_word: '',
      nowTab: 1,
      projectAll:[],
      rules: {
        productName: [{
            required: true,
            message: '请输入产品名称',
            trigger: 'blur'
          },
          {
            min: 0,
            max: 255,
            message: '长度在 0 到 255 个字符',
            trigger: 'blur'
          }
        ],
        projectId: [{
            required: true,
            message: '请选择项目',
            trigger: 'blur'
          }
        ],
        wenlidaima: [{
            required: true,
            message: '请输入纹理代码',
            trigger: 'blur'
          },
          {
            min: 0,
            max: 255,
            message: '长度在 0 到 255 个字符',
            trigger: 'blur'
          }
        ],
        carType: [{
            required: true,
            message: '请输入车型',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 1 到 255 个字符',
            trigger: 'blur'
          }
        ],
        clientCompanyName: [{
            required: true,
            message: '请输入客户单位',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 1 到 255 个字符',
            trigger: 'blur'
          }
        ],
        contactPerson: [{
            required: true,
            message: '请输入预报价单名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 1 到 255 个字符',
            trigger: 'blur'
          }
        ],
        contactPhone: [{
            required: true,
            message: '请输入联系人电话',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 1 到 255 个字符',
            trigger: 'blur'
          }
        ],
        paytype: [{
            required: true,
            message: '请输入付款方式',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 1 到 255 个字符',
            trigger: 'blur'
          }
        ],
        deliverytime: [{
            required: true,
            message: '请输入加工周期',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 1 到 255 个字符',
            trigger: 'blur'
          }
        ],
        remark: [{
          min: 0,
          max: 2048,
          message: '长度在 0 到 2048 个字符',
          trigger: 'blur'
        }]
      },
    }
  },
  methods: {
    toSelect1(){
      if(this.ruleForm.projectId !== 'undefined' && this.projectAll != 'undefined' ){
        for(var i=0; i<this.projectAll.length; i++){
          if(this.ruleForm.projectId == this.projectAll[i].id){
            this.ruleForm.carType = this.projectAll[i].car.name
            this.ruleForm.clientCompanyName = this.projectAll[i].processUnit.clientCompanyName
            this.ruleForm.contactPerson = this.projectAll[i].processUnit.contactPerson
            this.ruleForm.contactPhone = this.projectAll[i].processUnit.contactPhone
          }
        }
      }
    },
    toSelect(){
      if(this.fujianForm.projectId !== 'undefined' && this.projectAll != 'undefined' ){
        for(var i=0; i<this.projectAll.length; i++){
          if(this.fujianForm.projectId == this.projectAll[i].id){
            this.fujianForm.carType = this.projectAll[i].car.name
            this.fujianForm.clientCompanyName = this.projectAll[i].processUnit.clientCompanyName
            this.fujianForm.contactPerson = this.projectAll[i].processUnit.contactPerson
            this.fujianForm.contactPhone = this.projectAll[i].processUnit.contactPhone
          }
        }
      }
    },
    toChange(){
      var total = 0;
      total = this.fujianForm.noTaxTotal * (100+this.fujianForm.tax)/100;
      this.fujianForm.total = total.toFixed(2)
    },
    toChange1(){
      var total = 0;
      total = this.fujianForm.total / (100+this.fujianForm.tax) * 100;
      this.fujianForm.noTaxTotal = total.toFixed(2)
    },
    toChange2(){
      var total = 0;
      total = this.elform.noTaxPrice * (100+this.ruleForm.tax)/100;
      this.elform.total = total.toFixed(2)
    },
    toChange3(){
      var total = 0;
      total = this.elform.total / (100+this.ruleForm.tax) * 100;
      this.elform.noTaxPrice = total.toFixed(2)
    },
    tiJiao(){
      let self = this
      if(this.wen_jian_url == '' || this.wen_jian_url.length <=0){
        this.$message.error("请上传附件");
        return;
      }
      let parmas = self.fujianForm;
      parmas.addUserId = this.uid;
      parmas.addUserName = this.name;
      parmas.submitType = 1;
      parmas.fuJianUrl = this.wen_jian_url;
      let dataParam = {
        businessProductList: [],
        businessBaoJia:parmas
      }
      this.jsonPostRequest("/offer/bus/add", dataParam).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.$message.success("添加成功");
          this.$router.push('/offer/bus/list');
        } else {
          self.$message.error("添加失败");
        }
      })
    },
    imageupwenjian(data) {
      this.$message.success("上传成功");
      let urls = [];
      urls = data.url;
      if(urls != 'undefinded' && urls.length > 0 ){
        this.wen_jian_url = urls[0];
      }
    },
    toAadd(){
      this.innerVisible = true;
      this.udapteBoolean = false;
      this.elform = {
          productNum:'1',
          area:'0',
          price:'0',
          coefficient:'1',
          dongMo: false
        },
    //  this.resetForm('elform');
      this.imageUrls=[]
    },
    chanel(){
      this.innerVisible = false;
      this.udapteBoolean = false;
    },
    commit() {
      let self = this;
      let products = self.productData;
      if (products == 'undefined' || products.length <= 0) {
        this.$message.error("请添加产品详情")
        return;
      }
      self.addYuBaoJia();
    },
    addYuBaoJia() {
      let self = this;
      let parm = self.ruleForm;
      parm.addUserId = this.uid;
      parm.addUserName = this.name;
      parm.submitType = 0;

      this.table_loading = true;
      let parms_product = self.productData;
      if('undefined' == parms_product || parms_product.length <=0 ){
        this.$message.error("请录入产品详情");
        return
      }
      let data = [];
      let dataUrl = "";
      let total = 0;
      let noTaxTotal = 0;
      let products = [];
      for (var i = 0; i < parms_product.length; i++) {
        let item = parms_product[i];
        item.addUserId = this.uid;
        item.addUserName = this.name;
        total = total + item.total;
        noTaxTotal = noTaxTotal + item.noTaxPrice;
        item.picUrls = this.toPinjieUrl(item.picUrls);
        products.push(item);
      }
      parm.total = total;
      parm.noTaxTotal = noTaxTotal;
      let dataParam = {
        businessProductList: products,
        businessBaoJia:parm
      }
      this.jsonPostRequest("/offer/bus/add", dataParam).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.$message.success("添加成功");
          this.$router.push('/offer/bus/list');
        } else {
          self.$message.error(resp.data.data.message);
        }
      })
    },
    addProduct(id) {
      this.table_loading = true;
      let self = this;
      let parm = self.productData;
      let data = [];
      let dataUrl = "";
      for (var i = 0; i < parm.length; i++) {
        let item = parm[i];
        item.addUserId = this.uid;
        item.addUserName = this.name;
        item.yuBaoJiaId = id;
        item.picUrls = this.toPinjieUrl(item.picUrls);
        let pageinfoString = JSON.stringify(item);
        dataUrl = dataUrl + pageinfoString + "|";
      }
      let toParm = {
        yuBaoJiaId: id,
        yuProducts: dataUrl
      }
      this.postRequest("/offer/bus/add/product", toParm).then(resp => {
        this.table_loading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.$message.success("添加成功");
          this.$router.push('/offer/bus/list');
        } else {
          self.$message.error("添加失败");
        }
      })
    },
    deleteRow(index, rows) {
       rows.splice(index, 1);
     },
    toPinjieUrl(urls) {
      var te = this.$options.filters['imageFilter'];
      let url = te(urls);
      return url;
    },
    toEidtor(index, rows) {
      let self = this;
      self.udapteBoolean = true;
      let item = [];
      item = rows;
      self.itemRow = item[index];
      self.elform = self.itemRow;
      self.itemIndex = index;
      self.imageUrls = self.itemRow.picUrls;
      self.innerVisible = true;
    },
    toUpdateProduct(){
      let self = this;
      let taxI = self.ruleForm.tax / 100;
      let gaiL = taxI + 1;
      let total = self.elform.price * self.elform.productNum * gaiL;
      var te = this.$options.filters['toDecimal'];
      total = te(total);
      let product = {
        yuBaoJiaId: '',
        productName: self.elform.productName,
        wenlidaima: self.elform.wenlidaima,
        productNum: self.elform.productNum,
        area: self.elform.area,
        dongMo: self.elform.dongMo,
        coefficient: self.elform.coefficient + '',
        price: self.elform.price,
        picUrls: self.imageUrls,
        tax: self.ruleForm.tax,
        noTaxPrice: self.elform.price * self.elform.productNum,
        total: total,
        immutable: false,
        addUserId: this.uid,
        addUserName: this.name
      }
      let newData = [];
      for(let i = 0; i< this.productData.length; i++){
        if(i == this.itemIndex){
          newData.push(product);
        }else{
          newData.push(this.productData[i]);
        }
      }
      this.$nextTick(function() {
        this.productData = newData;
      })
      self.imageUrls = [];
      self.elform = {
          productNum:'1',
          area:'0',
          price:'0',
          coefficient:'1',
          dongMo: false
        },
      //self.resetForm('elform');
      self.innerVisible = false;
    },
    toAddProduct() {
      let self = this;
      let taxI = self.ruleForm.tax / 100;
      let gaiL = taxI + 1;
      let total = self.elform.price * self.elform.productNum * gaiL;
      var te = this.$options.filters['toDecimal'];
      total = te(total);
      let product = {
        yuBaoJiaId: '',
        productName: self.elform.productName,
        wenlidaima: self.elform.wenlidaima,
        productNum: self.elform.productNum,
        area: self.elform.area,
        dongMo: self.elform.dongMo,
        coefficient: self.elform.coefficient,
        price: self.elform.noTaxPrice,
        picUrls: self.imageUrls,
        tax: self.ruleForm.tax,
        noTaxPrice: self.elform.noTaxPrice,
        total: self.elform.total,
        immutable: false,
        addUserId: this.uid,
        addUserName: this.name
      }
      self.productData.push(product);
      self.imageUrls = [];
      self.elform = {
          productNum:'1',
          area:'0',
          price:'0',
          coefficient:'1',
          dongMo: false
        },
      //self.resetForm('elform');
      self.innerVisible = false;
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 添加预报价单基础信息
    submitForm(formName) {
      let self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.nowTab = 2;
        } else {
          self.$message.error('请检查输入信息的格式');
          return false;
        }
      });
    },
    imageuploaded(data) {
      let self = this;
      if (data.url.length !== 'undefined' && data.url.length > 0) {
        let url = data.url
        let urls = self.imageUrls;
        for (var i = 0; i < url.length; i++) {
          urls.push(url[i]);
        }
        self.imageUrls = urls;
      }
    },
    delMouldImage(url) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.todelImage(url);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    todelImage(url) {
      let self = this
      if (url == 'undefined' || url.length == "") {
        self.$message.error("删除图片不存在");
        return
      }
      this.getRequest("/config/delfile/delImage?url=" + url).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.$message.success("删除成功");
          let urls = self.imageUrls;
          let newUrls = [];
          for (var i = 0; i < urls.length; i++) {
            if (url != urls[i]) {
              newUrls.push(urls[i])
            }
          }
          self.imageUrls = newUrls;
        } else {
          self.$message.error("删除照片失败");
        }
      })

    },
    loadAllProject() {
      let self = this
      this.getRequest("/offer/bus/list/project?addUserId=" + this.uid).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {

          let item = []
          let re = resp.data.data.projectlist;
          this.projectAll = re
          if (re != 'undefined' && re.length > 0) {
            for (var i = 0; i < re.length; i++) {
              let elem = {
                label: '',
                value: ''
              }
              elem.label = re[i].projectName
              elem.value = re[i].id
              item.push(elem);
            }
            self.restaurants3 = item;
          }
        } else {
          console.log("获取列表数据失败");
        }
      });
    },
    // 上传图片失败
    handleError() {
      this.$notify.error({
        title: '上传失败',
        message: '图片上传出现异常'
      });
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.imageData.userId = this.uid = localStorage.getItem('cp_uid');
      this.wenjianData.userId = this.uid = localStorage.getItem('cp_uid');
      this.upload = JLApiUtils.upload;
    })
    this.username = localStorage.getItem('cp_username');
    this.uid = localStorage.getItem('cp_uid');
    this.name = localStorage.getItem('cp_name');
    this.loadAllProject();
  }
}
</script>
