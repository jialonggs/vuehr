<template>
<div>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>预报价单</el-breadcrumb-item>
        <el-breadcrumb-item>添加预报价单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-header style="align-items: center;margin-top:40px;">
        <el-steps :active="nowTab">
          <el-step title="基本信息" icon="el-icon-edit"></el-step>
          <el-step title="报价详情" icon="el-icon-document"></el-step>
        </el-steps>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <!-- 添加订单基础信息 -->
        <div v-show="nowTab==1">
          <el-card style="margin-top:30px;">
            <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="110px" class="demo-ruleForm" style="width:40%">
              <div>
                <el-form-item label="客户单位：" prop="clientCompanyName">
                  <el-input v-model="ruleForm.clientCompanyName"></el-input>
                </el-form-item>
                <el-form-item label="联系人：" prop="contactPerson">
                  <el-input v-model="ruleForm.contactPerson"></el-input>
                </el-form-item>
                <el-form-item label="联系电话：" prop="contactPhone">
                  <el-input v-model="ruleForm.contactPhone"></el-input>
                </el-form-item>
                <el-form-item label="车型：" prop="carType">
                  <el-input v-model="ruleForm.carType"></el-input>
                </el-form-item>
                <el-form-item label="税率：" prop="tax">
                  <el-input-number v-model="ruleForm.tax" controls-position="right" :min="0"></el-input-number>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input type="textarea" v-model="ruleForm.remark"></el-input>
                </el-form-item>
              </div>
            </el-form>
            <div class="card-bottom" style="float:left;">
              <el-button type="primary" @click="showTab =1">返回列表</el-button>
            </div>
            <div class="card-bottom" style="float:right;">
              <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
            </div>
          </el-card>
        </div>
        <!-- 产品列表 -->
        <div v-show="nowTab==2">
          <el-card class="box-card" style="margin-top:25px;">
            <div slot="header" class="clearfix">
              <span>产品列表</span>
              <div class="card-bottom" style="float: right;">
                <el-button type="primary" class="el-icon-plus" @click="innerVisible=true">添加</el-button>
              </div>
            </div>
            <div>
              <el-table :data="productData" border style="width: 100%">
                <el-table-column type="index" width="50" label="序号">
                </el-table-column>
                <el-table-column fixed prop="productName" label="产品名称">
                </el-table-column>
                <el-table-column prop="" label="图片">
                  <template slot-scope="scope">
              <img class="image" v-bind:src="scope.row.picUrls[0]" style="height:30px;width:30px;">
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
                <el-table-column prop="price" label="不含系数价格">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="300">
                  <template slot-scope="scope">
       <el-button type="text" size="small" @click="toEidtor(scope.row)">编辑</el-button>
       <el-button type="text" size="small" @click="toDel(scope.row)">删除</el-button>
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
                <el-input v-model="elform.wenlidaima"  style="width:30%;" placeholder="请输入纹理代码"></el-input>
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
              <el-button type="primary" @click="toAddProduct">确 定</el-button>
              <el-button @click="innerVisible = false">取 消</el-button>
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
      upload:'',
      //upload: 'http://localhost:8885/config/upload/image',
      imageData: {
        userId: '',
        imgPakage: 'order_pm'
      },
      imageUrls: [],
      ruleForm: {
        tax: '13',
        addUserId: '',
        addUserName: ''
      },
      elform: {
        productNum: '0',
        area: '0',
        dongMo:false,
        price: '0'
      },
      productData: [],
      innerVisible: false,
      tableData: [],
      select_word: '',
      nowTab: 1,
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
    commit(){

    },
    toDel(index) {
      console.log(index);
      alert(index);
    },
    toEidtor(item){

    },
    toAddProduct() {
      let self = this;
      let product = {
        yuBaoJiaId: '',
        productName: self.elform.productName,
        wenlidaima: self.elform.wenlidaima,
        productNum: self.elform.productNum,
        area: self.elform.area,
        dongMo: self.elform.dongMo,
        coefficient: self.elform.coefficient,
        price: self.elform.price,
        picUrls: self.imageUrls,
        immutable: false,
        addUserId: this.uid,
        addUserName: this.name
      }
      self.productData.push(product);
      self.imageUrls = [];
      self.resetForm('elform');
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
      this.upload = JLApiUtils.upload;
    })
    this.username = localStorage.getItem('cp_username');
    this.uid = localStorage.getItem('cp_uid');
    this.name = localStorage.getItem('cp_name');
  }
}
</script>
