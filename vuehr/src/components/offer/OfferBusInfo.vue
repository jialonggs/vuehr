<template>
<div>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>商务价单</el-breadcrumb-item>
        <el-breadcrumb-item>商务报价详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <!-- <div  style="margin-top:10px;">
          <el-button type="primary" @click="toback">设置最终优惠价格</el-button>
        </div> -->
        <!-- 添加订单基础信息 -->
        <div v-if="ruleForm.audit+''==='2'">
          <el-card style="margin-top:30px;">
            <span>驳回原因:</span>
            <div style="margin-top:20px;">
              <div v-for="item in remarks">
                <el-alert :title="item" type="warning" :closable="false">
                </el-alert>
              </div>
            </div>
          </el-card>
        </div>
        <div>
          <el-card style="margin-top:30px;">
            <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm" style="width:40%">
              <div>
                <el-form-item label="客户单位：" prop="clientCompanyName">
                  <el-input v-model="ruleForm.clientCompanyName" :disabled="ruleForm.audit+''!=='2'"></el-input>
                </el-form-item>
                <el-form-item label="联系人：" prop="contactPerson">
                  <el-input v-model="ruleForm.contactPerson" :disabled="ruleForm.audit+''!=='2'"></el-input>
                </el-form-item>
                <el-form-item label="联系电话：" prop="contactPhone">
                  <el-input v-model="ruleForm.contactPhone" :disabled="ruleForm.audit+''!=='2'"></el-input>
                </el-form-item>
                <el-form-item label="车型：" prop="carType">
                  <el-input v-model="ruleForm.carType" :disabled="ruleForm.audit+''!=='2'"></el-input>
                </el-form-item>
                <el-form-item v-if="ruleForm.submitType+''==='1'" label="不含税总价：" prop="tax">
                  <el-input-number v-model="ruleForm.noTaxTotal" controls-position="right" :min="0" :disabled="ruleForm.audit+''!=='2'"></el-input-number>
                </el-form-item>
                <el-form-item label="税率：" prop="tax">
                  <el-input-number v-model="ruleForm.tax" controls-position="right" :min="0" :disabled="ruleForm.audit+''!=='2'"></el-input-number>
                </el-form-item>
                <el-form-item v-if="ruleForm.submitType+''==='1'" label="含税总价：" prop="tax">
                  <el-input-number v-model="ruleForm.total" controls-position="right" :min="0" :disabled="ruleForm.audit+''!=='2'"></el-input-number>
                </el-form-item>
                <el-form-item  label="最终优惠价格：" prop="finalBaoJia">
                  <el-input-number v-model="ruleForm.finalBaoJia" controls-position="right" :min="0" :disabled="true"></el-input-number>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input type="textarea" v-model="ruleForm.remark" :disabled="ruleForm.audit+''!=='2'"></el-input>
                </el-form-item>
                <el-form-item v-if="ruleForm.submitType+''==='1'" label="下载原文件" prop="remark">
                <template >
                  <a :href="ruleForm.fuJianUrl" download="w3logo" style="color:blue;">下载原文件</a>
            </template>
                </el-form-item>
                <el-form-item   v-if="ruleForm.submitType+''==='1' && ruleForm.audit+''==='2'" label="重新上传文件：" >
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
                      :data="wenjianData" text="重新上传文件"
                      :multiple="true"
                      :multiple-size="30"
                      credentials="true"
                      @imageuploaded="toimageupwenjian" @errorhandle="handleError">
                      </vue-core-image-upload>
                  </div>
                </el-form-item>
              </div>
            </el-form>
          </el-card>
        </div>
        <!-- 产品列表 -->
        <div v-if="ruleForm.submitType+''==='0'">
          <el-card class="box-card" style="margin-top:25px;" v-loading="table_loading">
            <div slot="header" class="clearfix">
              <span>产品列表</span>
              <div class="card-bottom" style="float: right;">
                <el-button v-if="ruleForm.audit+''==='2'" type="primary" class="el-icon-plus" @click="toadd">添加</el-button>
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
                <el-table-column prop="" label="图片地址">
                  <template slot-scope="scope">
                <a :href="scope.row.picUrls[0]" target="_blank">点击查看</a>
            </template>
                </el-table-column>
                <el-table-column prop="wenlidaima" label="纹理代码">
                </el-table-column>
                <el-table-column prop="productNum" label="数量">
                </el-table-column>
                <el-table-column prop="price" label="含税">
                </el-table-column>
                <el-table-column prop="price" label="单价">
                </el-table-column>
                <el-table-column prop="area" label="面积">
                </el-table-column>
                <el-table-column prop="price" label="不含税价格">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="300">
                  <template slot-scope="scope">
                    <el-button v-if="ruleForm.audit+''==='2'" type="text" size="small" @click.native.prevent="toEidtor(scope.$index, productData)">编辑</el-button>
                    <el-button v-if="ruleForm.audit+''==='2'"
                      @click.native.prevent="deleteRow(scope.$index, productData)"
                      type="text"
                      size="small">
                      移除
                    </el-button>
     </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </div>
        <div class="card-bottom" style="float: left;margin-top:10px;">
          <el-button type="primary" @click="toback">返回列表</el-button>
        </div>
        <div v-if="ruleForm.audit+''==='2'" style="margin-top:20px;margin-bottom:20px;">
          <div class="card-bottom" style="float: right;">
            <el-button type="danger" @click="toAgain">重新提交</el-button>
          </div>
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
              <el-form-item label="单价：" prop="price">
                <el-input-number v-model="elform.price" controls-position="right" :min="0"></el-input-number>
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
      remarks:[],
      wen_jian_url:'',
      wenjianData: {
          userId: '',
          imgPakage: 'yu_bao_jia'
      },
      imageData: {
        userId:'',
        imgPakage: 'order_pm'
      },
      itemRow:{},
      upload:'',
      itemIndex:'',
      innerVisible:false,
      udapteBoolean:false,
      urlId: '',
      table_loading: false,
      imageUrls: [],
      ruleForm: {
        tax: '16',
        addUserId: '',
        addUserName: ''
      },
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
      elform: {},
      productData: [],
      innerVisible: false,
      tableData: [],
      select_word: '',
      nowTab: 1,
    }
  },
  methods: {
    toback(){
      this.$router.push('/offer/bus/list')
    },
    toDownLoad(url){
      window.open(url);
    },
    toimageupwenjian(data){
      this.$confirm('此操作将覆盖原上传文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.imageupwenjian(data);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消上传'
        });
      });
    },
    imageupwenjian(data) {
      let urls = [];
      urls = data.url;
      this.wen_jian_url = urls[0];
      this.ruleForm.fileUrl = this.wen_jian_url;
      this.$message.success("上传成功");
    },
    toAgain(){
      this.postRequest("/offer/bus/again/audit", this.ruleForm).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.$message.success("重新提交成功");
          this.$router.push('/offer/bus/list/')
        } else {
          this.$message.error("重新提交失败");
        }
      })
    },
    toadd(){
      this.innerVisible = true;
      this.elform={
        productNum:'1',
        area:'0',
        price:'0',
        coefficient:'1',
        dongMo: false
      };
      this.imageUrls = [];
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
      this.postRequest("/offer/bus/add", parm).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          let id = resp.data.data.id;
          if (id > 0) {
            this.addProduct(id);
          } else {
            self.$message.error("添加基础信息失败");
          }
        } else {
          self.$message.error("添加基础信息失败");
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
       let id = rows[index].id
       this.delProduct(id,index,rows);
     },
     toAadd(){
       this.innerVisible = true;
       this.udapteBoolean = false;
       this.resetForm('elform');
     },
    toEidtor(index, rows) {
      let self = this;
      self.udapteBoolean = true;
      let item = [];
      item = rows;
      self.itemRow = item[index];
      self.elform = self.itemRow;
      self.imageUrls = self.itemRow.picUrls;
      self.itemIndex = index;
      self.innerVisible = true;
    },
    todelProduct(id,index,rows){
      let parms = rows[index]
      this.postRequest("/offer/bus/del?product=", parms).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.$message.success("删除成功");
          rows.splice(index, 1);
        } else {
          self.$message.error("删除失败");
        }
      })
    },
    delProduct(id,index,rows) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.todelProduct(id,index,rows);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
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
    splitUrl(item) {
      let picurl = item.picUrls;
      let urlArray = [];
      if (picurl != "undefined" && picurl != "") {
        urlArray = picurl.split('|');
      }
      return urlArray;
    },
    toAudit(item) {
      let params = {
        id:this.urlId,
        audit:item,
        addUserId:this.ruleForm.addUserId,
        auditId:this.uid,
        auditName: this.name
      }
      this.postRequest("/audit/bus/check", params).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.$message.success("执行成功");
          this.$store.state.stomp.send("/ws/nf", {}, '');
          this.$router.push('/audit/bus')
        } else {
          this.$message.error("执行失败");
        }
      })
    },
    // 上传图片失败
    handleError() {
      this.$notify.error({
        title: '上传失败',
        message: '图片上传出现异常'
      });
    },
    toAddProduct() {
      let self = this;
      let total = self.elform.price * self.elform.productNum * (self.ruleForm.tax / 100 + 1);
      var te = this.$options.filters['imageFilter'];
      let url = te(self.imageUrls)
      let product = {
        yuBaoJiaId: self.ruleForm.id,
        productName: self.elform.productName,
        wenlidaima: self.elform.wenlidaima,
        productNum: self.elform.productNum,
        area: self.elform.area,
        dongMo: self.elform.dongMo,
        coefficient: self.elform.coefficient,
        price: self.elform.price,
        picUrls: url,
        tax: self.ruleForm.tax,
        noTaxPrice: self.elform.price * self.elform.productNum,
        total: total,
        immutable: false,
        addUserId: this.uid,
        addUserName: this.name
      }
      this.postRequest("/offer/bus/add/new/product", product).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
            self.$message.success("新增成功");
            product.picUrls = self.imageUrls
            self.productData.push(product);
            self.imageUrls = [];
            self.resetForm('elform');
            self.innerVisible = false;
        } else {
          self.$message.error("新增失败");
        }
      })
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
    getInfo(id) {
      let self = this;
      this.getRequest("/offer/bus/info?id=" + id).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.ruleForm = resp.data.data.businfo
          let product = resp.data.data.businfo.businessProductList
          let remarks = resp.data.data.businfo.rejectRemark;
          var te = this.$options.filters['splitRejectRemark'];
          this.remarks = te(remarks);
          if ('undefined' != self.product && product.length > 0) {
            let productItem = [];
            for (var i = 0; i < product.length; i++) {
              let picUrls = [];
              let item = {}
              item = product[i]
              var te = this.$options.filters['splitUrl'];
              picUrls = te(product[i].picUrls)
              item.picUrls = picUrls;
              productItem.push(item);
            }
            self.productData = productItem
          }

        } else {
          self.$message.error("获取失败");
        }
      })
    },
    toUpdateProduct(){
      let self = this;
      let total = self.elform.price * self.elform.productNum * (self.ruleForm.tax / 100 + 1);
      var te = this.$options.filters['imageFilter'];
      let url = te(self.imageUrls)
      let product = {
        yuBaoJiaId:self.ruleForm.id,
        id:self.elform.id,
        productName: self.elform.productName,
        wenlidaima: self.elform.wenlidaima,
        productNum: self.elform.productNum,
        area: self.elform.area,
        dongMo: self.elform.dongMo,
        coefficient: self.elform.coefficient,
        price: self.elform.price,
        picUrls: url,
        tax: self.ruleForm.tax,
        noTaxPrice: self.elform.price * self.elform.productNum,
        total: total,
        immutable: false,
        addUserId: this.uid,
        addUserName: this.name
      }
      this.postRequest("/offer/bus/update/product", product).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
            self.$message.success("更新成功");
            let newData = [];
            product.picUrls = self.imageUrls
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
            self.resetForm('elform');
            self.innerVisible = false;
        } else {
          self.$message.error("更新失败");
        }
      })
    },
    chanel(){
      this.innerVisible = false;
      this.udapteBoolean = false;
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
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
    this.upload = JLApiUtils.upload;
  },
  created: function() {
    this.urlId = this.$route.params.id;
    this.getInfo(this.urlId);
  }
}
</script>
