<template>
<div>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>预报价单</el-breadcrumb-item>
        <el-breadcrumb-item>预报价详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <div v-if="ruleForm.audit +'' === '2'">
          <el-card style="margin-top:30px;">
            <span>驳回原因：</span>
            <div style="margin-top:20px;">
              <div v-for="item in remarks">
                <el-alert :title="item" type="warning" :closable="false">
                </el-alert>
              </div>
            </div>
          </el-card>
        </div>
        <!-- 添加订单基础信息 -->
        <div>
          <el-card style="margin-top:30px;">
            <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm" style="width:40%">
              <div>
                <el-form-item label="客户单位：" prop="clientCompanyName">
                  <el-input v-model="ruleForm.clientCompanyName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="联系人：" prop="contactPerson">
                  <el-input v-model="ruleForm.contactPerson" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="联系电话：" prop="contactPhone">
                  <el-input v-model="ruleForm.contactPhone" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="车型：" prop="carType">
                  <el-input v-model="ruleForm.carType" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="不含税价格：" prop="carType">
                  <el-input v-model="ruleForm.noTaxTotal" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="税率：" prop="tax">
                  <el-input-number v-model="ruleForm.tax" controls-position="right" :min="0" :disabled="true"></el-input-number>
                </el-form-item>
                <el-form-item label="含税价格：" prop="carType">
                  <el-input v-model="ruleForm.total" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input type="textarea" v-model="ruleForm.remark" :disabled="true"></el-input>
                </el-form-item>
              </div>
              <el-form-item v-if="ruleForm.submitType+''==='1'" label="下载原文件" prop="remark">
              <template >
                <a :href="ruleForm.fuJianUrl" download="w3logo" style="color:blue;">下载原文件</a>
          </template>
              </el-form-item>
            </el-form>
            <div class="card-bottom" style="float:right;">
            </div>
          </el-card>
        </div>
        <!-- 产品列表 -->
        <div v-if="ruleForm.submitType +'' === '0'">
          <el-card class="box-card" style="margin-top:25px;" v-loading="table_loading">
            <div slot="header" class="clearfix">
              <span>产品列表</span>
              <div class="card-bottom" style="float: right;">
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
                <el-table-column prop="total" label="含税">
                </el-table-column>
                <el-table-column prop="price" label="单价">
                </el-table-column>
                <el-table-column prop="area" label="面积">
                </el-table-column>
                <el-table-column prop="noTaxPrice" label="不含税价格">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="300">
                  <template slot-scope="scope">
     </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- <div style="margin-top:20px;margin-bottom:20px;">
              <div v-if="ruleForm.audit+'' == '0'" class="card-bottom" style="float: right;">
                <el-button type="primary" @click="toAudit(1)">通 过</el-button>
                <el-button type="danger" @click="toAudit(2)">驳 回</el-button>
              </div>
            </div> -->
          </el-card>
        </div>
        <div style="margin-top:20px;margin-bottom:20px;">
          <div v-if="ruleForm.audit+'' == '0'" class="card-bottom" style="float: right;">
            <el-button type="primary" @click="toAudit(1)">通 过</el-button>
            <el-button type="danger" @click="toAudit(2)">驳 回</el-button>
          </div>
        </div>

        <el-dialog title="驳回原因" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="">
              <el-input type="textarea" v-model="form.rejectRemark"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="toAudit2">提 交</el-button>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
          </div>
        </el-dialog>
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
      urlId: '',
      dialogFormVisible: false,
      table_loading: false,
      imageUrls: [],
      ruleForm: {
        tax: '13',
        addUserId: '',
        addUserName: ''
      },
      form: {},
      elform: {
        productNum: '0',
        area: '0',
        dongMo: false,
        price: '0',
        coefficient: ''
      },
      productData: [],
      innerVisible: false,
      tableData: [],
      select_word: '',
      nowTab: 1,
    }
  },
  methods: {
    splitUrl(item) {
      let picurl = item.picUrls;
      let urlArray = [];
      if (picurl != "undefined" && picurl != "") {
        urlArray = picurl.split('|');
      }
      return urlArray;
    },
    toAudit2() {
      let params = {
        id: this.urlId,
        audit: 2,
        addUserId: this.ruleForm.addUserId,
        auditId: this.uid,
        auditName: this.name,
        rejectRemark: this.form.rejectRemark
      }
      if(params.rejectRemark =='' || params.rejectRemark+'' =='undefined'){
        this.$message.error("请填写驳回原因");
        return
      }
      this.postRequest("/audit/per/check", params).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.$message.success("执行成功");
          this.$store.state.stomp.send("/ws/nf", {}, '');
          this.$router.push('/audit/per')
        } else {
          this.$message.error("执行失败");
        }
      })
    },
    toAudit(item) {
      let params = {
        id: this.urlId,
        audit: item,
        addUserId: this.ruleForm.addUserId,
        auditId: this.uid,
        auditName: this.name,
        rejectRemark:{}
      }
      if (item === 2) {
        this.dialogFormVisible = true;
        return;
      }
      this.postRequest("/audit/per/check", params).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.$message.success("执行成功");
          this.$store.state.stomp.send("/ws/nf", {}, '');
          this.$router.push('/audit/per')
        } else {
          this.$message.error("执行失败");
        }
      })
    },
    getInfo(id) {
      let self = this;
      this.getRequest("/audit/per/info?id=" + id).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.ruleForm = resp.data.data.yuinfo
          let product = resp.data.data.yuinfo.yuProductList
          let remarks = resp.data.data.yuinfo.rejectRemark;
          var te = this.$options.filters['splitRejectRemark'];
          this.remarks = te(remarks);
          if ('undefined' != self.product && product.length > 0) {
            let productItem = [];
            for (var i = 0; i < product.length; i++) {
              let picUrls = [];
              let item = {}
              item = product[i]
              picUrls = self.splitUrl(product[i])
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
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  mounted: function() {
    this.username = localStorage.getItem('cp_username');
    this.uid = localStorage.getItem('cp_uid');
    this.name = localStorage.getItem('cp_name');
  },
  created: function() {
    this.urlId = this.$route.params.id;
    this.getInfo(this.urlId);
  }
}
</script>
