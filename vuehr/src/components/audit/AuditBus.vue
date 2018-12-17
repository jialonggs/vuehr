<template>
<div>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>商务报价审核</el-breadcrumb-item>
        <el-breadcrumb-item>审核记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-main style="padding-left: 0px;padding-top: 0px;margin-top:20px;">
        <div>
          <el-tabs type="border-card" @tab-click="tongGuoShenHe">
            <el-tab-pane>
              <span slot="label"><i class="el-icon-date">待审核</i></span>
              <el-table  :data="tableData0" :row-class-name="tableRowClassName">
                <el-table-column label="客户单位" prop="clientCompanyName">
                </el-table-column>
                <el-table-column label="车型" prop="carType">
                </el-table-column>
                <el-table-column label="审核状态" prop="aduit">
                  <template slot-scope="scope">
                <el-tag v-if="scope.row.audit+'' === '0'" type="primary">待审核</el-tag>
                <el-tag v-if="scope.row.audit+'' === '1'" type="info">审核通过</el-tag>
                <el-tag v-if="scope.row.audit+'' === '2'" type="danger">驳回</el-tag>
              </template>
                </el-table-column>
                <el-table-column label="费用合计" prop="total">
                </el-table-column>
                <el-table-column label="创建时间" prop="createTime">
                  <template slot-scope="scope">
                <span>{{scope.row.createTime | formatDateTime}}</span>
              </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="toinfo(scope.row.id)">详情</el-button>
                <!-- <el-button
                  size="mini"
                  type="warning"
                  @click="">打印</el-button> -->
            </template>
                </el-table-column>
              </el-table>
              <div class="block" style="float:right;margin-top:15px;">
                <el-pagination @size-change="handleSizeChange0" @current-change="handleCurrentChange0" :current-page="currentPage0" :page-sizes="[10, 30, 80, 100]" :page-size="pagesize0" layout="total,sizes, prev, pager, next, jumper" :total="totalnum0">
                </el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label"><i class="el-icon-date">已通过</i></span>
              <el-table :data="tableData1" :row-class-name="tableRowClassName1" >
                <el-table-column label="客户单位" prop="clientCompanyName">
                </el-table-column>
                <el-table-column label="车型" prop="carType">
                </el-table-column>
                <el-table-column label="审核状态" prop="aduit">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.audit+'' === '0'" type="primary">待审核</el-tag>
                    <el-tag v-if="scope.row.audit+'' === '1'" type="success">审核通过</el-tag>
                    <el-tag v-if="scope.row.audit+'' === '2'" type="danger">驳回</el-tag>
              </template>
                </el-table-column>
                <el-table-column label="费用合计" prop="total">
                </el-table-column>
                <el-table-column label="创建时间" prop="createTime">
                  <template slot-scope="scope">
                <span>{{scope.row.createTime | formatDateTime}}</span>
              </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="toinfo(scope.row.id)">详情</el-button>
                <!-- <el-button
                  size="mini"
                  type="warning"
                  @click="">打印</el-button> -->
            </template>
                </el-table-column>
              </el-table>
              <div class="block" style="float:right;margin-top:15px;">
                <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="currentPage1" :page-sizes="[10, 30, 80, 100]" :page-size="pagesize1" layout="total,sizes, prev, pager, next, jumper" :total="totalnum1">
                </el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label"><i class="el-icon-date">未通过</i></span>
              <el-table :data="tableData2"  :row-class-name="tableRowClassName2">
                <el-table-column label="客户单位" prop="clientCompanyName">
                </el-table-column>
                <el-table-column label="车型" prop="carType">
                </el-table-column>
                <el-table-column label="审核状态" prop="aduit">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.audit+'' === '0'" type="primary">待审核</el-tag>
                    <el-tag v-if="scope.row.audit+'' === '1'" type="info">审核通过</el-tag>
                    <el-tag v-if="scope.row.audit+'' === '2'" type="danger">驳回</el-tag>
              </template>
                </el-table-column>
                <el-table-column label="费用合计" prop="total">
                </el-table-column>
                <el-table-column label="创建时间" prop="createTime">
                  <template slot-scope="scope">
                <span>{{scope.row.createTime | formatDateTime}}</span>
              </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="toinfo(scope.row.id)">详情</el-button>
                <!-- <el-button
                  size="mini"
                  type="warning"
                  @click="">打印</el-button> -->
            </template>
                </el-table-column>
              </el-table>
              <div class="block" style="float:right;margin-top:15px;">
                <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="currentPage2" :page-sizes="[10, 30, 80, 100]" :page-size="pagesize2" layout="total,sizes, prev, pager, next, jumper" :total="totalnum2">
                </el-pagination>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-main>
    </el-container>
  </div>
</div>
</template>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.el-table .error-row {
  background: #efbdc6;
}
</style>
<script>
export default {
  data() {
    return {
      activeName: 'first',
      username: '',
      name: '',
      uid: '',
      tableLoading: false,

      currentPage0: 1,
      totalnum0: 0,
      pagesize0: 10,

      currentPage1: 1,
      totalnum1: 0,
      pagesize1: 10,

      currentPage2: 1,
      totalnum2: 0,
      pagesize2: 10,

      tableData0: [],
      tableData1: [],
      tableData2: []
    }
  },
  methods: {
    toinfo(id) {
      this.$router.push('/bus/offer/info/' + id)
    },
    tongGuoShenHe(item){

      if(item.index == 0){
        this.getCollectMouldList(0, this.currentPage0, this.pagesize0)
      }else if(item.index == 1){
        this.getCollectMouldList(1, this.currentPage1, this.pagesize1)
      }else if(item.index == 2){
        this.getCollectMouldList(2, this.currentPage2, this.pagesize2)
      }

    },
    tableRowClassName({
      row,
      rowIndex
    }) {
      return 'warning-row';
    },
    tableRowClassName1({
      row,
      rowIndex
    }) {
      return 'success-row';
    },
    tableRowClassName2({
      row,
      rowIndex
    }) {
      return 'error-row';
    },

    handleSizeChange0(val) {
      this.pagesize0 = val;
      this.getCollectMouldList(0,this.currentPage0,this.pagesize0);
    },
    handleCurrentChange0(val) {
      this.currentPage0 = val;
     this.getCollectMouldList(0,this.currentPage0,this.pagesize0);
    },

    handleSizeChange1(val) {
      this.pagesize1 = val;
      this.getCollectMouldList(1,this.currentPage1,this.pagesize1);
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
      this.getCollectMouldList(1,this.currentPage1,this.pagesize1);
    },

    handleSizeChange2(val) {
      this.pagesize2 = val;
      this.getCollectMouldList(2,this.currentPage2,this.pagesize2);
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val;
      this.getCollectMouldList(2,this.currentPage2,this.pagesize2);
    },

    getCollectMouldList1(audit, currentPage, pagesize) {
      let _this = this
      this.getRequest("/audit/bus/listbypage?page=" + currentPage + "&size=" + pagesize + "&audit=1").then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          alert("dsd")
            _this.tableData1 = resp.data.data.auditbusbaojialist
            _this.totalnum1 = resp.data.data.count
        }
      })
    },

    // 获取订单列表
    getCollectMouldList(audit, currentPage, pagesize) {
      let _this = this
      this.getRequest("/audit/bus/listbypage?page=" + currentPage + "&size=" + pagesize + "&audit=" + audit).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          if (audit == 0){
            _this.tableData0 = resp.data.data.auditbusbaojialist
            _this.totalnum0 = resp.data.data.count
          }else if(audit == 1){
            _this.tableData1 = resp.data.data.auditbusbaojialist
            _this.totalnum1 = resp.data.data.count
          }else if(audit == 2){
            _this.tableData2 = resp.data.data.auditbusbaojialist
            _this.totalnum1 = resp.data.data.count
          }
        }
      })
    }
  },
  mounted: function() {
    this.username = localStorage.getItem('cp_username');
    this.uid = localStorage.getItem('cp_uid');
    this.name = localStorage.getItem('cp_name');
    this.getCollectMouldList(0,1,10);
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



<!-- <template>
<div>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>商务报价审核</el-breadcrumb-item>
        <el-breadcrumb-item>审核记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-main style="padding-left: 0px;padding-top: 0px;margin-top:20px;">
        <div>
          <el-tabs type="border-card">
            <el-tab-pane>
              <span slot="label"><i class="el-icon-date">待审核</i></span>
              <el-table @tab-click="daiShenHe" :data="tableData0" :row-class-name="tableRowClassName">
                <el-table-column label="客户单位" prop="clientCompanyName">
                </el-table-column>
                <el-table-column label="车型" prop="carType">
                </el-table-column>
                <el-table-column label="审核状态" prop="aduit">
                  <template slot-scope="scope">
                <el-tag v-if="scope.row.audit+'' === '0'" type="info">待审核</el-tag>
              </template>
                </el-table-column>
                <el-table-column label="有无预报价" prop="yuBaoJiaId">
                  <template slot-scope="scope">
                <el-tag v-if="scope.row.yuBaoJiaId+'' === 'null' || scope.row.yuBaoJiaId+'' === ''" type="info">无</el-tag>
                <el-tag v-if="scope.row.yuBaoJiaId+'' !== 'null' && scope.row.yuBaoJiaId+'' !== ''" type="success">有</el-tag>
              </template>
                </el-table-column>
                <el-table-column label="费用合计" prop="total">
                </el-table-column>
                <el-table-column label="创建时间" prop="createTime">
                  <template slot-scope="scope">
                <span>{{scope.row.createTime | formatDateTime}}</span>
              </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="">详情</el-button>
                <el-button
                  size="mini"
                  type="warning"
                  @click="">打印</el-button>
            </template>
                </el-table-column>
              </el-table>
              <div class="block" style="float:right;margin-top:15px;">
                <el-pagination @size-change="handleSizeChange0" @current-change="handleCurrentChange0" :current-page="currentPage0" :page-sizes="[10, 30, 80, 100]" :page-size="pagesize0" layout="total,sizes, prev, pager, next, jumper" :total="totalnum0">
                </el-pagination>
              </div>
            </el-tab-pane>


            <el-tab-pane>
              <span slot="label"><i class="el-icon-date">已通过</i></span>
              <el-table :data="tableData1" @tab-click="tongGuoShenHe" :row-class-name="tableRowClassName1">
                <el-table-column label="客户单位" prop="clientCompanyName">
                </el-table-column>
                <el-table-column label="车型" prop="carType">
                </el-table-column>
                <el-table-column label="审核状态" prop="aduit">
                  <template slot-scope="scope">
                <el-tag v-if="scope.row.audit+'' === '0'" type="info">待审核</el-tag>
              </template>
                </el-table-column>
                <el-table-column label="有无预报价" prop="yuBaoJiaId">
                  <template slot-scope="scope">
                <el-tag v-if="scope.row.yuBaoJiaId+'' === 'null' || scope.row.yuBaoJiaId+'' === ''" type="info">无</el-tag>
                <el-tag v-if="scope.row.yuBaoJiaId+'' !== 'null' && scope.row.yuBaoJiaId+'' !== ''" type="success">有</el-tag>
              </template>
                </el-table-column>
                <el-table-column label="费用合计" prop="total">
                </el-table-column>
                <el-table-column label="创建时间" prop="createTime">
                  <template slot-scope="scope">
                <span>{{scope.row.createTime | formatDateTime}}</span>
              </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="">详情</el-button>
                <el-button
                  size="mini"
                  type="warning"
                  @click="">打印</el-button>
            </template>
                </el-table-column>
              </el-table>
              <div class="block" style="float:right;margin-top:15px;">
                <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="currentPage1" :page-sizes="[10, 30, 80, 100]" :page-size="pagesize1" layout="total,sizes, prev, pager, next, jumper" :total="totalnum1">
                </el-pagination>
              </div>
            </el-tab-pane>


            <el-tab-pane>
              <span slot="label"><i class="el-icon-date">未通过</i></span>
              <el-table :data="tableData2" @tab-click="weiTongGuoShenHe" :row-class-name="tableRowClassName2">
                <el-table-column label="客户单位" prop="clientCompanyName">
                </el-table-column>
                <el-table-column label="车型" prop="carType">
                </el-table-column>
                <el-table-column label="审核状态" prop="aduit">
                  <template slot-scope="scope">
                <el-tag v-if="scope.row.audit+'' === '0'" type="info">待审核</el-tag>
              </template>
                </el-table-column>
                <el-table-column label="有无预报价" prop="yuBaoJiaId">
                  <template slot-scope="scope">
                <el-tag v-if="scope.row.yuBaoJiaId+'' === 'null' || scope.row.yuBaoJiaId+'' === ''" type="info">无</el-tag>
                <el-tag v-if="scope.row.yuBaoJiaId+'' !== 'null' && scope.row.yuBaoJiaId+'' !== ''" type="success">有</el-tag>
              </template>
                </el-table-column>
                <el-table-column label="费用合计" prop="total">
                </el-table-column>
                <el-table-column label="创建时间" prop="createTime">
                  <template slot-scope="scope">
                <span>{{scope.row.createTime | formatDateTime}}</span>
              </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="">详情</el-button>
                <el-button
                  size="mini"
                  type="warning"
                  @click="">打印</el-button>
            </template>
                </el-table-column>
              </el-table>
              <div class="block" style="float:right;margin-top:15px;">
                <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="currentPage2" :page-sizes="[10, 30, 80, 100]" :page-size="pagesize2" layout="total,sizes, prev, pager, next, jumper" :total="totalnum2">
                </el-pagination>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-main>
    </el-container>
  </div>
</div>
</template>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.el-table .error-row {
  background: #efbdc6;
}
</style>
<script>
export default {
  data() {
    return {
      activeName: 'first',
      username: '',
      name: '',
      uid: '',
      tableLoading: false,

      currentPage0: 1,
      totalnum0: 0,
      pagesize0: 10,

      currentPage1: 1,
      totalnum1: 0,
      pagesize1: 10,

      currentPage2: 1,
      totalnum2: 0,
      pagesize2: 10,

      tableData0: [],
      tableData1: [],
      tableData2: []
    }
  },
  methods: {
    daiShenHe(){
      getCollectMouldList(0, this.currentPage0, this.pagesize0)
    },
    tongGuoShenHe(){
      getCollectMouldList(1, this.currentPage1, this.pagesize1)
    },
    weiTongGuoShenHe(){
      getCollectMouldList(2, this.currentPage2, this.pagesize2)
    },
    tableRowClassName({
      row,
      rowIndex
    }) {
      return 'warning-row';
    },
    tableRowClassName1({
      row,
      rowIndex
    }) {
      return 'success-row';
    },
    tableRowClassName2({
      row,
      rowIndex
    }) {
      return 'error-row';
    },

    handleSizeChange0(val) {
      this.pagesize0 = val;
      this.getCollectMouldList(0,this.currentPage0,this.pagesize0);
    },
    handleCurrentChange0(val) {
      this.currentPage0 = val;
     this.getCollectMouldList(0,this.currentPage0,this.pagesize0);
    },

    handleSizeChange1(val) {
      this.pagesize1 = val;
      this.getCollectMouldList(1,this.currentPage1,this.pagesize1);
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
      this.getCollectMouldList(1,this.currentPage1,this.pagesize1);
    },

    handleSizeChange2(val) {
      this.pagesize2 = val;
      this.getCollectMouldList(2,this.currentPage2,this.pagesize2);
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val;
      this.getCollectMouldList(2,this.currentPage2,this.pagesize2);
    },

    // 获取订单列表
    getCollectMouldList(audit, currentPage, pagesize) {
      let _this = this
      this.getRequest("/audit/bus/listbypage?page=" + currentPage + "&size=" + pagesize + "&audit=" + audit).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          if (audit == 0){
            _this.tableData0 = resp.data.data.auditbusbaojialist
            _this.totalnum0 = resp.data.data.count
          }else if(audit == 1){
            _this.tableData1 = resp.data.data.auditbusbaojialist
            _this.totalnum1 = resp.data.data.count
          }else if(audit == 2){
            _this.tableData2 = resp.data.data.auditbusbaojialist
            _this.totalnum1 = resp.data.data.count
          }
        }
      })
    }
  },
  mounted: function() {
    this.username = localStorage.getItem('cp_username');
    this.uid = localStorage.getItem('cp_uid');
    this.name = localStorage.getItem('cp_name');
    this.getCollectMouldList(0,1,10);
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
</style> -->
