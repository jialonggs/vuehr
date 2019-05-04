
<template>
<div>
  <div v-show="nowTab === 1">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>发模管理</el-breadcrumb-item>
        <el-breadcrumb-item>已通过列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center;margin-top:20px;">
        <div class="handle-box">
          <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" icon="search"></el-input>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <el-table :data="tableData" border stripe @selection-change="handleSelectionChange" stripe style="width: 100%" v-loading="tableLoading">
          <el-table-column type="selection" align="left" width="30">
          </el-table-column>
          <el-table-column label="产品名称" prop="orderName">
          </el-table-column>
          <el-table-column label="发模类型">
            <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.faMoType+'' === '0'" >欠款发模</el-tag>
            <el-tag type="success" v-if="scope.row.faMoType+'' === '1'" >部分付款发模</el-tag>
            <el-tag type="warning" v-if="scope.row.faMoType+'' === '2'" >全款发模</el-tag>
        </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.status+'' === '0'" >待审核</el-tag>
            <el-tag type="success" v-if="scope.row.status+'' === '1'" >商务审核通过</el-tag>
            <el-tag type="warning" v-if="scope.row.status+'' === '-1'" >商务审核未通过</el-tag>
            <el-tag type="success" v-if="scope.row.status+'' === '2'" >经理审核通过</el-tag>
            <el-tag type="danger" v-if="scope.row.status+'' === '-2'" >经理审核未通过</el-tag>
            <el-tag type="success" v-if="scope.row.status+'' === '3'" >发模完成</el-tag>
        </template>
          </el-table-column>
          <el-table-column label="发模数量">
            <template slot-scope="scope">
            <el-tag>{{scope.row.faMoNum}}</el-tag>
          </template>
          </el-table-column>
          <el-table-column label="留厂数量">
            <template slot-scope="scope">
            <el-tag>{{scope.row.liuChangNum}}</el-tag>
          </template>
          </el-table-column>
          <el-table-column label="等额模具留厂">
            <template slot-scope="scope">
            <el-tag v-if="scope.row.liuChang+'' === 'true' && scope.row.liuChang+'' !== ''">有</el-tag>
            <el-tag v-if="scope.row.liuChang+'' === 'false' || scope.row.liuChang+'' === ''">无</el-tag>
          </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime">
            <template slot-scope="scope">{{ scope.row.createTime | formatDateTime}}</template>
          </el-table-column>
          <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="toAddFaMoInfo(scope.row)">发模</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="toSeeShouMo(scope.row)">查看</el-button>
        </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <div class="block" style="float:right;margin-top:15px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 30, 80, 100]" :page-size="pagesize" layout="total,sizes, prev, pager, next, jumper" :total="totalnum">
      </el-pagination>
    </div>
  </div>
  <el-button type="danger" size="mini" v-if="tableData.length>0" :disabled="multipleSelection.length==0" @click="deleteManyEmps">批量发模
  </el-button>
  <!-- 发模申请 -->
  <el-dialog title="发模单" :visible.sync="dialogFormVisible" width='60%' v-loading="tableLoading">
    <div class="form-box">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="车牌号：" prop="chePai">
            <el-input v-model="form.chePai" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="驾驶员手机号：" prop="jiaShiYuan">
          <el-input v-model="form.jiaShiYuan" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="运输情况：">
          <el-checkbox-group v-model="form.kuaiDi">
            <el-checkbox label="快递" name="kuaiDi"></el-checkbox>
          </el-checkbox-group>
          <el-checkbox-group v-model="form.muXiang">
            <el-checkbox label="木箱" name="type"></el-checkbox>
          </el-checkbox-group>
          <el-checkbox-group v-model="form.zhuanChe">
            <el-checkbox label="专车" name="type"></el-checkbox>
          </el-checkbox-group>
          <el-checkbox-group v-model="form.huoYun">
            <el-checkbox label="货运" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注：" prop="remark" >
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
        <el-form-item label="上传图片：">
          <div>
            <vue-core-image-upload :crop="false" inputOfFile="imageFile" :url="upload" extensions="png,gif,jpeg,jpg" :class="['el-button', 'el-button--primary']" :max-file-size="5242880" :data="imageData" text="上传图片" :multiple="true" :multiple-size="30" credentials="true"
              @imageuploaded="imageuploaded" @errorhandle="handleError">
            </vue-core-image-upload>
          </div>
        </el-form-item>
        <div style="border: 1px dashed #d9d9d9;width:100%;min-height:358px;">
          <el-row :gutter="20" style="margin-top:10px;">
            <el-col :span="6" v-for="imageUrl in imageUrls ">
              <el-card :body-style="{ padding: '0px' }" class="mould-card">
                <img class="image" v-bind:src="imageUrl" style="height:420px;">
                <div style="text-align:center;">
                  <el-button type="text" @click="delMouldImage(imageUrl)"><i class="el-icon-error" style="color:red;"></i></el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addFaMoInfo">提交</el-button>
      <el-button @click="quxiao">取 消</el-button>
    </div>
  </el-dialog>
  <el-dialog title="模具详情" :visible.sync="dialogFormVisible3" width='80%' v-loading="tableLoading">
  <el-card class="box-card" :index="index" v-for="(list, index) in this.mouldData" style="margin-top:25px;">
    <div slot="header" class="clearfix">
      <span>{{list.mouldName}}---模具信息</span>
    </div>
    <div class="form-box">
        <div>
          <span>数量：{{list.mouldNum}}</span>
        </div>
        <div>
          <span>备注：{{list.remark}}</span>
        </div>
    </div>
    <div style="border: 1px dashed #d9d9d9;width:100%;min-height:358px;">
      <el-row :gutter="20" style="margin-top:10px;">
        <el-col :span="6" v-for="item1 in list.picUrls ">
          <el-card :body-style="{ padding: '0px' }" class="mould-card">
            <img class="image" v-bind:src="item1" style="height:420px;">
          </el-card>
        </el-col>
      </el-row>
    </div>
  </el-card>
  </el-dialog>
</div>
</template>
<script>
import VueCoreImageUpload from 'vue-core-image-upload';
import JLApiUtils from '../../utils/JLApiUtils.js';
export default {
  components: {
    VueCoreImageUpload
  },
  data() {
    return {
      imageUrls:[],
      multipleSelection: [],
      itemQianKuan: {},
      kaiPiao: {
        projectId: '',
        projectName: ''
      },
      form: {},
      form1: {},
      dialogFormVisible3:false,
      dialogFormVisible1: false,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      tableLoading2: false,
      nowTab: 1,
      username: '',
      name: '',
      uid: '',
      tableLoading: false,
      currentPage: 1,
      totalnum: 0,
      pagesize: 10,
      select_word: '',
      tableData: [],
      itemRuKu: {},
      tableLoading: false,
      itemKaiPiao: {},
      itemId:'',
      mouldData:[],
      imageData:[],
      upload:'',
    }
  },
  methods: {
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
    // 上传图片失败
    handleError() {
      this.$notify.error({
        title: '上传失败',
        message: '图片上传出现异常'
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    quxiao() {
      this.dialogFormVisible = false;
    },
    deleteManyEmps() {
      this.$confirm('此操作将[' + this.multipleSelection.length + ']条订单一并发模, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var ids = '';
        for (var i = 0; i < this.multipleSelection.length; i++) {
          ids += this.multipleSelection[i].id + ",";
        }
        this.itemId = ids;
        this.toAddFaMoInfo();
      }).catch(() => {});
    },
    toSeeShouMo(item){
      let orderId = item.orderId;
      this.getRequest("/fa/mo/order/famo?orderId=" + orderId).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          //this.$message.success("执行成功")
          let mouldInfos = resp.data.data;
          let productItem = [];
          if ('undefined' != mouldInfos && mouldInfos.length > 0) {
            for (var i = 0; i < mouldInfos.length; i++) {
                let picUrls = [];
                let item = {}
                item = mouldInfos[i]
                var te = this.$options.filters['splitUrl'];
                picUrls = te(mouldInfos[i].picUrls)
                item.picUrls = picUrls;
                productItem.push(item);
              }
            }
            this.mouldData = productItem;
            this.dialogFormVisible3 = true;
        } else {
          this.$message.error("获取收模信息失败")
        }
      })

    },
    toAddFaMoInfo(item) {
      if(item != null && item !== '' && item !== 'undefined'){
        this.itemId = item.id;
      }
      this.dialogFormVisible = true;
      this.form = {};
      this.form.chePai = item.chePai;
      this.form.jiaShiYuan = item.driverPhone;
    },
    addFaMoInfo() {
      let self = this;
      let ids = ''
      if(ids === '' || ids === 'undefined' || ids === null){
        if(this.itemId === '' || this.itemId === 'undefined'){
          this.$message.error("请选择订单")
          return;
        }else {
          ids = this.itemId;
        }
      }
      self.form.ids=ids;
      self.form.addUserName=this.name;
      self.form.addUserId = this.uid;

      let url = "";
      for (var i = 0; i < self.imageUrls.length; i++) {
        if (i == self.imageUrls.length - 1) {
          url = url + self.imageUrls[i]
        } else {
          url = self.imageUrls[i] + "|" + url
        }
      }
      self.form.picUrls = url;
      this.postRequest("/fa/mo/add/info", self.form).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.$message.success("执行成功")
          this.dialogFormVisible = false;
          this.getCollectMouldList()
        } else {
          this.$message.error("执行失败")
        }
      })
    },
    toShenHe(item) {
      this.dialogFormVisible = true;
      this.itemRuKu = item;
      this.form.kuFangRemark = "";
    },
    handleChange(value) {},
    toinfo(id) {
      this.$router.push('/order/info/' + id)
    },
    toadd() {
      this.$router.push('/order/add')
    },
    // 重置
    handleSizeChange(val) {
      this.pagesize = val;
      this.getCollectMouldList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCollectMouldList();
    },
    // 获取订单列表
    getCollectMouldList() {
      let _this = this
      this.getRequest("/fa/mo/by/status?page=" + this.currentPage + "&size=" + this.pagesize + "&status=2").then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          _this.tableData = resp.data.data.needfamolist
          _this.totalnum = resp.data.data.count
        }
      })
    }
  },
  created: function(){
    this.upload = JLApiUtils.upload;
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableLoading = true;
      this.getCollectMouldList();
    })
    this.username = localStorage.getItem('cp_username');
    this.uid = localStorage.getItem('cp_uid');
    this.name = localStorage.getItem('cp_name');
  },
  computed: {}
}
</script>
<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.el-select .el-input {
  width: 130px;
}

.card-bottom {
  padding: 18px 20px;
  border-top: 1px solid #e6ebf5;
  box-sizing: border-box;
  text-align: right;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.card-bottom-left {
  padding: 18px 20px;
  border-top: 1px solid #e6ebf5;
  box-sizing: border-box;
  text-align: left;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.mould-card {
  margin-bottom: 15px;
}

.mould-card:hover {
  transform: translateY(-2%);
  box-shadow: 1px 4px 10px 2px #CCC;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.pre-img {
  width: 250px;
  height: 250px;
  margin-bottom: 20px;
}
</style>
