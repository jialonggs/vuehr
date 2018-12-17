
<template>
<div>
  <div v-show="nowTab === 1">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>发模管理</el-breadcrumb-item>
        <el-breadcrumb-item>已提交列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center;margin-top:20px;">
        <div class="handle-box">
          <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" icon="search"></el-input>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <el-table :data="tableData" stripe style="width: 100%" v-loading="tableLoading">
          <el-table-column label="产品名称" prop="orderName">
          </el-table-column>
          <el-table-column label="发模类型">
            <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.faMoType+'' === '0'" >欠款发模</el-tag>
            <el-tag type="success" v-if="scope.row.faMoType+'' === '1'" >部分付款发模</el-tag>
            <el-tag type="warning" v-if="scope.row.faMoType+'' === '2'" >全款发模</el-tag>
        </template>
          </el-table-column>
          <el-table-column label="审核状态">
            <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.status+'' === '0'" >待审核</el-tag>
            <el-tag type="success" v-if="scope.row.status+'' === '1'" >商务审核通过</el-tag>
            <el-tag type="warning" v-if="scope.row.status+'' === '-1'" >商务审核未通过</el-tag>
            <el-tag type="success" v-if="scope.row.status+'' === '2'" >经理审核通过</el-tag>
            <el-tag type="danger" v-if="scope.row.status+'' === '-2'" >经理审核未通过</el-tag>
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
            <el-button v-if="scope.row.status+'' == '-1' ||scope.row.status+'' == '-2' "
              size="mini"
              type="primary"
              @click="toupdate(scope.row)">重新提交</el-button>
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
  <el-dialog title="发模申请" :visible.sync="dialogFormVisible" width='40%' v-loading="tableLoading">
    <div class="form-box">
      <el-form ref="form" :model="form" label-width="120px" >
        <el-form-item label="是否有等额模具留厂：" prop="liuChang">
          <el-switch v-model="form.liuChang"></el-switch>
        </el-form-item>
        <el-form-item label="发模数量：" prop="faMoNum">
           <el-input-number v-model="form.faMoNum" @change="handleChange" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="留厂数量：" prop="liuChangNum">
           <el-input-number v-model="form.liuChangNum" @change="handleChange" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item v-if="this.itemQianKuan.faMoType+ '' != '2'" label="欠款原因：" prop="faMoRemark" required>
          <el-input type="textarea" v-model="form.faMoRemark"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="updateFaMo">重新提交</el-button>
      <el-button  @click="quxiao">取 消</el-button>
    </div>
  </el-dialog>
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
    }
  },
  methods: {
    quxiao(){
      this.dialogFormVisible = false;
    },
    toupdate(item){
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
    updateFaMo(){
      let self = this;
      if( self.itemQianKuan.faMoType+'' !=='2' && self.form.faMoRemark === ''){
        self.$message.error("请填写欠款原因")
        return;
      }
      self.itemQianKuan.faMoNum = this.form.faMoNum;
      self.itemQianKuan.liuChang = this.form.liuChang;
      self.itemQianKuan.liuChangNum = this.form.liuChangNum;
      self.tableLoading = true;
      this.postRequest("/fa/mo/update", self.itemQianKuan).then(resp => {
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
      this.getRequest("/fa/mo/wait/listbypage?page=" + this.currentPage + "&size=" + this.pagesize +"&addUserId=" +this.uid).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          _this.tableData = resp.data.data.waitfamolist
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
