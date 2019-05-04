<template>
<div>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>发模单审核</el-breadcrumb-item>
        <el-breadcrumb-item>经理审核记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-main style="padding-left: 0px;padding-top: 0px;margin-top:20px;">
        <div>
          <el-tabs type="border-card" @tab-click="tongGuoShenHe">
            <el-tab-pane>
              <span slot="label"><i class="el-icon-date">待审核</i></span>
              <el-table :data="tableData0"  :row-class-name="tableRowClassName">
                <el-table-column label="订单名称" prop="orderName">
                </el-table-column>

                <el-table-column label="发模类型" prop="faMoType">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.faMoType+'' === '0'" type="primary">欠款发模</el-tag>
                    <el-tag v-if="scope.row.faMoType+'' === '1'" type="info">部分到款发模</el-tag>
                    <el-tag v-if="scope.row.faMoType+'' === '2'" type="info">全款发模</el-tag>
              </template>
                </el-table-column>
                <el-table-column label="审核状态" prop="aduit">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.status+'' === '1'" type="primary">待审核</el-tag>
                    <el-tag v-if="scope.row.status+'' === '2'" type="success">通过</el-tag>
                    <el-tag v-if="scope.row.status+'' === '-2'" type="danger">未通过</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="留厂数量" prop="liuChangNum">
                </el-table-column>
                <el-table-column label="发模数量" prop="faMoNum">
                </el-table-column>
                <el-table-column label="是否等额留厂" prop="liuChang">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.liuChang+'' === 'true' && scope.row.liuChang+'' !== ''">有</el-tag>
                    <el-tag v-if="scope.row.liuChang+'' === 'false' || scope.row.liuChang+'' === ''">无</el-tag>
                  </template>
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
                @click="toAudit(scope.row)">审核</el-button>
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
              <el-table :data="tableData1"  :row-class-name="tableRowClassName1">
                <el-table-column label="订单名称" prop="orderName">
                </el-table-column>
                <el-table-column label="发模类型" prop="faMoType">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.faMoType+'' === '0'" type="primary">欠款发模</el-tag>
                    <el-tag v-if="scope.row.faMoType+'' === '1'" type="info">部分到款发模</el-tag>
                    <el-tag v-if="scope.row.faMoType+'' === '2'" type="success">全款发模</el-tag>
              </template>
                </el-table-column>
                <el-table-column label="审核状态" prop="aduit">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.status+'' === '1'" type="primary">待审核</el-tag>
                    <el-tag v-if="scope.row.status+'' === '2'" type="success">通过</el-tag>
                    <el-tag v-if="scope.row.status+'' === '-2'" type="danger">未通过</el-tag>
              </template>
                </el-table-column>
                <el-table-column label="留厂数量" prop="liuChangNum">
                </el-table-column>
                <el-table-column label="发模数量" prop="faMoNum">
                </el-table-column>
                <el-table-column label="是否等额留厂" prop="liuChang">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.liuChang+'' === 'true' && scope.row.liuChang+'' !== ''">有</el-tag>
                    <el-tag v-if="scope.row.liuChang+'' === 'false' || scope.row.liuChang+'' === ''">无</el-tag>
                  </template>
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
                <el-table-column label="订单名称" prop="orderName">
                </el-table-column>
                <el-table-column label="发模类型" prop="faMoType">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.faMoType+'' === '0'" type="primary">欠款发模</el-tag>
                    <el-tag v-if="scope.row.faMoType+'' === '1'" type="info">部分到款发模</el-tag>
                    <el-tag v-if="scope.row.faMoType+'' === '2'" type="success">全款发模</el-tag>
              </template>
                </el-table-column>
                <el-table-column label="审核状态" prop="aduit">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.status+'' === '1'" type="primary">待审核</el-tag>
                    <el-tag v-if="scope.row.status+'' === '2'" type="success">通过</el-tag>
                    <el-tag v-if="scope.row.status+'' === '-2'" type="danger">未通过</el-tag>
              </template>
                </el-table-column>

                <el-table-column label="留厂数量" prop="liuChangNum">
                </el-table-column>
                <el-table-column label="发模数量" prop="faMoNum">
                </el-table-column>
                <el-table-column label="是否等额留厂" prop="liuChang">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.liuChang+'' === 'true' && scope.row.liuChang+'' !== ''">有</el-tag>
                    <el-tag v-if="scope.row.liuChang+'' === 'false' || scope.row.liuChang+'' === ''">无</el-tag>
                  </template>
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
  <el-dialog title="正常发模申请" :visible.sync="dialogFormVisible" width='40%' v-loading="tableLoading">
    <div class="form-box">
      <el-form ref="form" :model="form" label-width="120px" >
        <el-form-item label="订单名称：">
          <el-input  v-model="form.orderName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="申请人：">
          <el-input  v-model="form.addUserName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="申请人：">
          <el-input  v-model="form.addUserName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="车牌号：">
          <el-input  v-model="form.chePai" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="发模类型：">
          <span v-if="form.faMoType+'' === '0'">欠款发模</span>
          <span v-if="form.faMoType+'' === '1'">部分到款发模</span>
          <span v-if="form.faMoType+'' === '2'">全款发模</span>
        </el-form-item>
        <el-form-item label="付款金额：">
          <!-- <el-input  v-model="form.order.financeJinE" :disabled="true"></el-input> -->
          <span>{{form.order.financeJinE}}</span>
        </el-form-item>
        <el-form-item label="付款比例：">
          <!-- <el-input  v-model="form.order." :disabled="true"></el-input> -->
          <span>{{form.order.financeBiLi}}</span>
        </el-form-item>
        <el-form-item label="欠款原因：">
          <el-input type="textarea" v-model="form.faMoRemark" :disabled="true"></el-input>
        </el-form-item>
        <!-- <el-form-item label="审核备注：">
          <el-input type="textarea" v-model="form.aduitRemark" :disabled="true"></el-input>
        </el-form-item> -->
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="tongGuo(2)">通 过</el-button>
      <el-button type="danger" @click="tongGuo(-2)">驳 回</el-button>
    </div>
  </el-dialog>
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
      dialogFormVisible: false,
      form:{
        order:{}
      },
      auditItem:"",
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
    tongGuo(status){
      let params = {
        id:this.auditItem.id,
        status:status,
        auditId: this.uid,
        auditName: this.name,
        addUserId: this.auditItem.addUserId
      }
      this.postRequest("/fa/mo/check", params).then(resp => {
        if(resp && resp.status == 200 && resp.data.code == 0) {
            this.getCollectMouldList(1,this.currentPage0, this.pagesize0);
            this.$message.success("审核成功");
            this.dialogFormVisible = false;

          }else{
            this.$message.error("审核失败");
          }
      })
    },
    toAudit(item){
      this.auditItem = item;
      this.dialogFormVisible = true;
      this.getRequest("/fa/mo/info?id=" + item.id).then(resp => {
        if(resp && resp.status == 200 && resp.data.code == 0) {
            this.form = resp.data.data.faMo
          }
      })
    },
    tongGuoShenHe(item){
      if(item.index == 0){
        this.getCollectMouldList(1, this.currentPage0, this.pagesize0)
      }else if(item.index == 1){
        this.getCollectMouldList(2, this.currentPage1, this.pagesize1)
      }else if(item.index == 2){
        this.getCollectMouldList(-2, this.currentPage2, this.pagesize2)
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
      this.getCollectMouldList(1,this.currentPage0,this.pagesize0);
    },
    handleCurrentChange0(val) {
      this.currentPage0 = val;
     this.getCollectMouldList(1,this.currentPage0,this.pagesize0);
    },

    handleSizeChange1(val) {
      this.pagesize1 = val;
      this.getCollectMouldList(2,this.currentPage1,this.pagesize1);
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
      this.getCollectMouldList(2,this.currentPage1,this.pagesize1);
    },

    handleSizeChange2(val) {
      this.pagesize2 = val;
      this.getCollectMouldList(-2,this.currentPage2,this.pagesize2);
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val;
      this.getCollectMouldList(-2,this.currentPage2,this.pagesize2);
    },

    // 获取待审核的列表
    getCollectMouldList(audit, currentPage, pagesize) {
      let _this = this
      this.getRequest("/fa/mo/listbypage?page=" + currentPage + "&size=" + pagesize + "&status=" + audit).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          if (audit == 1){
            _this.tableData0 = resp.data.data.famolist
            _this.totalnum0 = resp.data.data.count
          }else if(audit == 2){
            _this.tableData1 = resp.data.data.famolist
            _this.totalnum1 = resp.data.data.count
          }else if(audit == -2){
            _this.tableData2 = resp.data.data.famolist
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
    this.getCollectMouldList(1,1,10);
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
