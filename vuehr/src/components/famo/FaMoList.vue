
<template>
<div>
  <div v-show="nowTab === 1">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>发模管理</el-breadcrumb-item>
        <el-breadcrumb-item>申请发模</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center;margin-top:20px;">
        <div class="handle-box">
          <!-- <el-button type="primary" icon="plus" class="mr10" @click="toadd">创建订单</el-button> -->
          <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" icon="search"></el-input>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <el-table :data="tableData" stripe style="width: 100%" v-loading="tableLoading">
          <el-table-column label="产品名称" prop="orderName">
          </el-table-column>
          <el-table-column label="所属项目">
            <template slot-scope="scope">
              <span>{{scope.row.project.projectName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="订单状态">
            <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.storageStatus+'' === '2'" >可申请发模</el-tag>
            <el-tag type="warning" v-if="scope.row.storageStatus+'' === '4'" >发模待审核</el-tag>
        </template>
          </el-table-column>
          <el-table-column label="付款状态">
            <template slot-scope="scope">
        <el-tag v-if="scope.row.project.financeStatus+'' === '0'" >待财务审查</el-tag>
        <el-tag v-if="scope.row.project.financeStatus+'' === '1'" type="danger">未付款</el-tag>
        <el-tag v-if="scope.row.project.financeStatus+'' === '2'" type="info">部分付款</el-tag>
        <el-tag v-if="scope.row.project.financeStatus+'' === '3'" type="success">已全款</el-tag>
      </template>
          </el-table-column>
          <el-table-column label="已付款比例">
            <template slot-scope="scope">
            <el-tag>{{scope.row.project.financeBiLi}} %</el-tag>
          </template>
          </el-table-column>
          <el-table-column label="已付款金额" prop="financeJinE">
            <template slot-scope="scope">
            <el-tag>{{scope.row.project.financeJinE}}</el-tag>
          </template>
          </el-table-column>
          <el-table-column label="开票状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.project.kaiPiaoStatus+'' === '0'" >未开票</el-tag>
              <el-tag v-if="scope.row.project.kaiPiaoStatus+'' === '1'" type="info">待审核</el-tag>
              <el-tag v-if="scope.row.project.kaiPiaoStatus+'' === '2'" type="danger">驳回</el-tag>
              <el-tag v-if="scope.row.project.kaiPiaoStatus+'' === '3'" type="success">已通过</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime">
            <template slot-scope="scope">{{ scope.row.createTime | formatDateTime}}</template>
          </el-table-column>
          <el-table-column label="操作" width="280">
            <template slot-scope="scope">
            <el-button v-if="scope.row.project.financeStatus+'' === '3'"
              size="mini"
              type="primary"
              @click="tofaMo(scope.row)">发模</el-button>
              <el-button
                size="mini"
                type="danger"
                v-if="scope.row.project.financeStatus+'' !== '3'"
                @click="toqianKuan(scope.row)" >发模</el-button>
                <!-- <el-button
                  v-if="scope.row.project.kaiPiaoStatus +'' ==='0'"
                  size="mini"
                  type="primary"
                  @click="toKaiPiao(scope.row)">开票</el-button> -->
              <el-button
                size="mini"
                type="primary"
                @click="toOrderinfo(scope.row)">详情</el-button>
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
  <!-- 发模申请 -->
  <el-dialog title="欠款发模申请" :visible.sync="dialogFormVisible" width='40%' v-loading="tableLoading">
    <div class="form-box">
      <div style="margin-top:5px;">
        到款比例 :<el-tag  type="warning">{{itemProject.financeBiLi}}</el-tag>
      </div>
      <div style="margin-top:5px;">
        到款金额 :<el-tag  type="default">{{itemProject.financeJinE}}</el-tag>
      </div>
      <div style="margin-top:5px;">
        最终优惠价:<el-tag  type="default">{{itemProject.businessBaoJia.finalBaoJia}}</el-tag>
      </div>
      <div style="width:100%;height:1px;border-top:1px solid;margin-bottom:15px;"></div>
      <el-form ref="form" :model="form" label-width="120px" >
        <el-form-item label="车牌号:" prop="chePai">
          <el-input v-model="form.chePai" ></el-input>
        </el-form-item>
        <el-form-item label="驾驶员手机号:" prop="driverPhone">
          <el-input v-model="form.driverPhone" ></el-input>
        </el-form-item>
        <el-form-item label="留厂等额模具：" prop="liuChang">
          <el-switch v-model="form.liuChang"></el-switch>
        </el-form-item>
        <el-form-item label="发模数量：" prop="faMoNum">
           <el-input-number v-model="form.faMoNum" @change="handleChange" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="留厂数量：" prop="liuChangNum">
           <el-input-number v-model="form.liuChangNum" @change="handleChange" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="欠款原因：" prop="faMoRemark" required>
          <el-input type="textarea" v-model="form.faMoRemark"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="qianKuan">提 交</el-button>
      <el-button  @click="quxiao">取 消</el-button>
    </div>
  </el-dialog>
  <el-dialog title="全款发模申请" :visible.sync="dialogFormVisible1" width='40%' v-loading="tableLoading">
    <div class="form-box">
      <el-form ref="form" :model="form1" label-width="120px" >
        <el-form-item label="车牌号:" prop="chePai">
          <el-input v-model="form1.chePai" ></el-input>
        </el-form-item>
        <el-form-item label="驾驶员手机号:" prop="driverPhone">
          <el-input v-model="form1.driverPhone" ></el-input>
        </el-form-item>
        <el-form-item label="是否有等额模具留厂：" prop="liuChang">
          <el-switch v-model="form1.liuChang"></el-switch>
        </el-form-item>
        <el-form-item label="发模数量：" prop="faMoNum">
           <el-input-number v-model="form1.faMoNum" @change="handleChange" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="留厂数量：" prop="liuChangNum">
           <el-input-number v-model="form1.liuChangNum" @change="handleChange" :min="0"></el-input-number>
        </el-form-item>
        <!-- <el-form-item label="欠款原因：" prop="faMoRemark" required>
          <el-input type="textarea" v-model="form1.faMoRemark"></el-input>
        </el-form-item> -->
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="zhengchang">提 交</el-button>
      <el-button  @click="quxiao1">取 消</el-button>
    </div>
  </el-dialog>

  <!-- <el-dialog title="开票申请" :visible.sync="dialogFormVisible2" width='80%' v-loading="tableLoading2">
    <div class="form-box">
      <el-form ref="form" :model="kaiPiao" label-width="120px" >
        <el-row :gutter="20">
       <el-col :span="12"><div class="grid-content bg-purple">
         <el-form-item label="合同页：" prop="heTongYe">
           <el-input v-model="kaiPiao.heTongYe" ></el-input>
         </el-form-item>
         <el-form-item label="名 称：" prop="unitName">
           <el-input v-model="kaiPiao.unitName" ></el-input>
         </el-form-item>
         <el-form-item label="地 址：" prop="unitDiZhi">
            <el-input v-model="kaiPiao.unitDiZhi" ></el-input>
         </el-form-item>
         <el-form-item label="开户银行：" prop="unitYinHang">
            <el-input v-model="kaiPiao.unitYinHang" ></el-input>
         </el-form-item>
       </div></el-col>
       <el-col :span="12"><div class="grid-content bg-purple">
         <el-form-item label="税 号：" prop="unitShuiHao">
           <el-input v-model="kaiPiao.unitShuiHao" ></el-input>
         </el-form-item>
         <el-form-item label="电 话：" prop="unitTel">
            <el-input v-model="kaiPiao.unitTel" ></el-input>
         </el-form-item>
         <el-form-item label="账 号：" prop="unitZhangHao">
            <el-input v-model="kaiPiao.unitZhangHao" ></el-input>
         </el-form-item>
       </div>
       </el-col>
        </el-row>
        <div style="width:100%;height:1px;border-top:1px solid;margin-bottom:15px;"></div>
        <el-row :gutter="20">
       <el-col :span="12"><div class="grid-content bg-purple">
         <el-form-item label="货物或应税劳务名称：" prop="laoWuMingCheng" label-width="160px">
           <el-input v-model="kaiPiao.laoWuMingCheng" ></el-input >
         </el-form-item>
         <el-form-item label="规格型号：" prop="guiGeXingHao">
            <el-input v-model="kaiPiao.guiGeXingHao" ></el-input>
         </el-form-item>
         <el-form-item label="单 位：" prop="danWei">
            <el-input v-model="kaiPiao.danWei" ></el-input>
         </el-form-item>
       </div></el-col>
       <el-col :span="12"><div class="grid-content bg-purple">
         <el-form-item label="数 量：" prop="shuLiang">
           <el-input v-model="kaiPiao.shuLiang" ></el-input>
         </el-form-item>
         <el-form-item label="含税金额：" prop="jinE">
            <el-input v-model="kaiPiao.jinE" ></el-input>
         </el-form-item>
       </div>
       </el-col>
        </el-row>
        <div style="width:100%;height:1px;border-top:1px solid;margin-bottom:15px;"></div>
        <el-row :gutter="20">
       <el-col :span="12"><div class="grid-content bg-purple">
         <el-form-item label="发票号码：" prop="faPiaoNum" label-width="160px">
           <el-input v-model="kaiPiao.faPiaoNum" ></el-input >
         </el-form-item>
         <el-form-item label="备 注：" prop="remark">
            <el-input v-model="kaiPiao.remark" ></el-input>
         </el-form-item>
       </div></el-col>
       <el-col :span="12"><div class="grid-content bg-purple">
         <el-form-item label="是否付清：" prop="isFuQing">
           <el-switch v-model="kaiPiao.isFuQing"></el-switch>
         </el-form-item>
         <el-form-item label="付款方式：" prop="fuKuanType">
           <el-radio-group v-model="kaiPiao.fuKuanType">
               <el-radio  label="现金"  value="0"></el-radio>
               <el-radio  label="汇票"  value="1"></el-radio>
               <el-radio  label="汇款"  value="2"></el-radio>
               <el-radio  label="支票"  value="3"></el-radio>
           </el-radio-group>
         </el-form-item>
       </div>
       </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addKaiPiao">提 交</el-button>
      <el-button  @click="quxiaoKai">取 消</el-button>
    </div>
  </el-dialog> -->
</div>
</template>
<script>
export default {
  data() {
    return {
      itemQianKuan:{},
      kaiPiao:{
        projectId:'',
        projectName:''
      },
      form:{},
      form1:{},
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
      itemRuKu:{},
      tableLoading: false,
      itemKaiPiao:{},
      itemProject:{
        businessBaoJia:{
          finalBaoJia:0
        }
      },
    }
  },
  methods: {
    toOrderinfo(data) {
      this.$router.push('/plant/order/info/' + data.id)
    },
    toKaiPiao(item){
      let self = this;
      self.dialogFormVisible2 = true;
      self.kaiPiao = {};
      self.itemKaiPiao = item;
    },
    quxiaoKai(){
      let self = this;
      self.dialogFormVisible2 = false;
      self.kaiPiao = {};
    },
    addKaiPiao(){
      let self = this;
      let parmas = self.kaiPiao;
      parmas.projectId = self.itemKaiPiao.projectId;
      parmas.projectName = self.itemKaiPiao.projectName;
      params.addUserId = this.uid;
      params.addUserName = this.name;
      self.tableLoading2 = true;
      this.postRequest("/kai/piao/add", parmas).then(resp => {
        self.tableLoading2 = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.$message.success("执行成功")
          this.dialogFormVisible2 = false;
        }else {
          this.$message.error("执行失败")
        }
      })
    },
    quxiao(){
      this.dialogFormVisible = false;
    },
    quxiao1(){
      this.dialogFormVisible1 = false;
    },
    toqianKuan(item){
      this.itemProject = item.project
      this.itemQianKuan = item;
      this.dialogFormVisible = true;
      this.form = {
        addUserId:"",
        addUserName:"",
        orderId:"",
        orderName:"",
        faMoRemark:"",
        faMoType:'0',
        liuChangNum: 0,
        faMoNum: 1,
        liuChang: false,
      };
    },
    tofaMo(item){
      this.itemQianKuan = item;
      this.dialogFormVisible1 = true;
      this.form1 = {
        addUserId:"",
        addUserName:"",
        orderId:"",
        orderName:"",
        faMoRemark:"",
        faMoType:'0',
        liuChangNum: 0,
        faMoNum: 1,
        liuChang: false,
      };
    },
    zhengchang(){
      let self = this;
      self.form1.addUserId = this.uid;
      self.form1.addUserName = this.name;
      self.form1.orderId = this.itemQianKuan.id;
      self.form1.orderName = this.itemQianKuan.orderName;
      self.form1.faMoType = '2';
      self.tableLoading = true;
      this.postRequest("/fa/mo/add", self.form1).then(resp => {
        self.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.$message.success("执行成功")
          this.dialogFormVisible1 = false;
          this.getCollectMouldList()
        }else {
          this.$message.error("执行失败")
        }
      })
    },
    qianKuan(){
      let self = this;
      if(self.form.faMoRemark === ''){
        self.$message.error("请填写欠款原因")
        return;
      }
      self.form.addUserId = this.uid;
      self.form.addUserName = this.name;
      self.form.orderId = this.itemQianKuan.id;
      self.form.orderName = this.itemQianKuan.orderName;
      self.form.faMoType = '0';
      self.tableLoading = true;
      this.postRequest("/fa/mo/add", self.form).then(resp => {
        self.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.$message.success("执行成功")
          this.dialogFormVisible = false;
          this.getCollectMouldList()
        }else {
          this.$message.error("执行失败")
        }
      })
    },
    toShenHe(item){
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
      this.getRequest("/fa/mo/need/listbypage?page=" + this.currentPage + "&size=" + this.pagesize +"&addUserId=" +this.uid +
    "&storageStatus=2" +"&faMoStatus=0" ).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          console.log(resp.data.data.needfamolist);
          _this.tableData = resp.data.data.needfamolist
          _this.totalnum = resp.data.data.count
        }
      })
    }
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
  computed: {
  }
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
