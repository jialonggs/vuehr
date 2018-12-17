<template>
<div>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>开票审核</el-breadcrumb-item>
        <el-breadcrumb-item>经理审核记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-main style="padding-left: 0px;padding-top: 0px;margin-top:20px;">
        <div>
          <el-tabs type="border-card" @tab-click="tongGuoShenHe">
            <el-tab-pane>
              <span slot="label"><i class="el-icon-date">待审核</i></span>
              <el-table :data="tableData0" :row-class-name="tableRowClassName">
                <el-table-column label="项目名称" prop="projectName">
                </el-table-column>
                <el-table-column label="单位" prop="danWei">
                </el-table-column>
                <el-table-column label="审核状态">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.status+'' === '0'" type="info">待审核</el-tag>
                    <el-tag v-if="scope.row.status+'' === '1'" type="primary">商务通过</el-tag>
                    <el-tag v-if="scope.row.status+'' === '-1'" type="warning">商务未通过</el-tag>
                    <el-tag v-if="scope.row.status+'' === '2'" type="primary">经理通过</el-tag>
                    <el-tag v-if="scope.row.status+'' === '-2'" type="danger">经理未通过</el-tag>
                    <el-tag v-if="scope.row.status+'' === '3'" type="danger">经理通过</el-tag>
                    <el-tag v-if="scope.row.status+'' === '-3'" type="primary">经理未通过</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="付款方式" prop="fuKuanType">
                  <template slot-scope="scope">
                  <el-tag v-if="scope.row.fuKuanType+'' === '0'" type="info">现金</el-tag>
                  <el-tag v-if="scope.row.fuKuanType+'' === '1'" type="primary">汇票</el-tag>
                  <el-tag v-if="scope.row.fuKuanType+'' === '2'" type="warning">汇款</el-tag>
                  <el-tag v-if="scope.row.fuKuanType+'' === '3'" type="primary">支票</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="是否付清" prop="fuQing">
                  <template slot-scope="scope">
                  <el-tag v-if="scope.row.fuQing+'' ==='false' || scope.row.fuQing+'' ==='' " type="info">是</el-tag>
                  <el-tag v-if="scope.row.fuQing+'' ==='true' && scope.row.fuQing+'' !==''" type="primary">否</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="含税金额" prop="jinE">
                </el-table-column>
                <el-table-column label="申请时间" prop="createTime">
                  <template slot-scope="scope">
                <span>{{scope.row.createTime | formatDateTime}}</span>
              </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="toShenHe(scope.row)">审核</el-button>
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
              <el-table :data="tableData1" :row-class-name="tableRowClassName1">
                <el-table-column label="项目名称" prop="projectName">
                </el-table-column>
                <el-table-column label="单位" prop="danWei">
                </el-table-column>
                <el-table-column label="审核状态">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.status+'' === '0'" type="info">待审核</el-tag>
                    <el-tag v-if="scope.row.status+'' === '1'" type="primary">商务通过</el-tag>
                    <el-tag v-if="scope.row.status+'' === '-1'" type="warning">商务未通过</el-tag>
                    <el-tag v-if="scope.row.status+'' === '2'" type="primary">经理通过</el-tag>
                    <el-tag v-if="scope.row.status+'' === '-2'" type="danger">经理未通过</el-tag>
                    <el-tag v-if="scope.row.status+'' === '3'" type="danger">经理通过</el-tag>
                    <el-tag v-if="scope.row.status+'' === '-3'" type="primary">经理未通过</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="付款方式" prop="fuKuanType">
                  <template slot-scope="scope">
                  <el-tag v-if="scope.row.fuKuanType+'' === '0'" type="info">现金</el-tag>
                  <el-tag v-if="scope.row.fuKuanType+'' === '1'" type="primary">汇票</el-tag>
                  <el-tag v-if="scope.row.fuKuanType+'' === '2'" type="warning">汇款</el-tag>
                  <el-tag v-if="scope.row.fuKuanType+'' === '3'" type="primary">支票</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="是否付清" prop="fuQing">
                  <template slot-scope="scope">
                  <el-tag v-if="scope.row.fuQing+'' ==='false' || scope.row.fuQing+'' ==='' " type="info">是</el-tag>
                  <el-tag v-if="scope.row.fuQing+'' ==='true' && scope.row.fuQing+'' !==''" type="primary">否</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="含税金额" prop="jinE">
                </el-table-column>
                <el-table-column label="申请时间" prop="createTime">
                  <template slot-scope="scope">
                <span>{{scope.row.createTime | formatDateTime}}</span>
              </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
              <!-- <el-button
                size="mini"
                type="primary"
                @click="toShenHe(scope.row)">审核</el-button> -->
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
              <el-table :data="tableData2" :row-class-name="tableRowClassName2">
                <el-table-column label="项目名称" prop="projectName">
                </el-table-column>
                <el-table-column label="单位" prop="danWei">
                </el-table-column>
                <el-table-column label="审核状态">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.status+'' === '0'" type="info">待审核</el-tag>
                    <el-tag v-if="scope.row.status+'' === '1'" type="primary">商务通过</el-tag>
                    <el-tag v-if="scope.row.status+'' === '-1'" type="warning">商务未通过</el-tag>
                    <el-tag v-if="scope.row.status+'' === '2'" type="primary">经理通过</el-tag>
                    <el-tag v-if="scope.row.status+'' === '-2'" type="danger">经理未通过</el-tag>
                    <el-tag v-if="scope.row.status+'' === '3'" type="danger">经理通过</el-tag>
                    <el-tag v-if="scope.row.status+'' === '-3'" type="primary">经理未通过</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="付款方式" prop="fuKuanType">
                  <template slot-scope="scope">
                  <el-tag v-if="scope.row.fuKuanType+'' === '0'" type="info">现金</el-tag>
                  <el-tag v-if="scope.row.fuKuanType+'' === '1'" type="primary">汇票</el-tag>
                  <el-tag v-if="scope.row.fuKuanType+'' === '2'" type="warning">汇款</el-tag>
                  <el-tag v-if="scope.row.fuKuanType+'' === '3'" type="primary">支票</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="是否付清" prop="fuQing">
                  <template slot-scope="scope">
                  <el-tag v-if="scope.row.fuQing+'' ==='false' || scope.row.fuQing+'' ==='' " type="info">是</el-tag>
                  <el-tag v-if="scope.row.fuQing+'' ==='true' && scope.row.fuQing+'' !==''" type="primary">否</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="含税金额" prop="jinE">
                </el-table-column>
                <el-table-column label="申请时间" prop="createTime">
                  <template slot-scope="scope">
                <span>{{scope.row.createTime | formatDateTime}}</span>
              </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
              <!-- <el-button
                size="mini"
                type="primary"
                @click="toShenHe(scope.row)">审核</el-button> -->
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
  <el-dialog title="审核开票申请" :visible.sync="dialogFormVisible2" width='80%' v-loading="tableLoading2">
    <div class="form-box">
      <el-form ref="form" :model="kaiPiao" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple">
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
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
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
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="货物或应税劳务名称：" prop="laoWuMingCheng" label-width="160px">
                <el-input v-model="kaiPiao.laoWuMingCheng" ></el-input>
              </el-form-item>
              <el-form-item label="规格型号：" prop="guiGeXingHao">
                <el-input v-model="kaiPiao.guiGeXingHao" ></el-input>
              </el-form-item>
              <el-form-item label="单 位：" prop="danWei">
                <el-input v-model="kaiPiao.danWei" ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
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
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="发票号码：" prop="faPiaoNum" label-width="160px">
                <el-input v-model="kaiPiao.faPiaoNum" ></el-input>
              </el-form-item>
              <el-form-item label="备 注：" prop="remark">
                <el-input v-model="kaiPiao.remark" ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="是否付清：" prop="fuQing">
                <el-switch v-model="kaiPiao.fuQing" ></el-switch>
              </el-form-item>
              <el-form-item label="付款方式：" prop="fuKuanType">
                <el-radio-group v-model="kaiPiao.fuKuanType" >
                  <el-radio label="现金" value="0"></el-radio>
                  <el-radio label="汇票" value="1"></el-radio>
                  <el-radio label="汇款" value="2"></el-radio>
                  <el-radio label="支票" value="3"></el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="tongGuo(2)">通 过</el-button>
      <el-button type="danger" @click="innerVisible = true">驳 回</el-button>
    </div>
    <el-dialog width="30%" title="驳回原因" :visible.sync="innerVisible" append-to-body>
      <el-form :model="form">
        <el-form-item label="原因" :label-width="formLabelWidth">
          <el-input type="textarea"  placeholder="请输入内容" v-model="form.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="tijiao(-2)">提 交</el-button>
      </div>
    </el-dialog>
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
      innerVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible: false,
      form: {},
      kaiPiao: {},
      tableLoading2: false,
      auditItem: "",
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
      tableData2: [],

    }
  },
  methods: {
    toShenHe(item) {
      this.dialogFormVisible2 = true;
      this.kaiPiao = item;
    },
    tijiao(status){
      // let params = {
      //   id: this.kaiPiao.id,
      //   status: status,
      //   auditId: this.uid,
      //   auditName: this.name,
      //   addUserId: this.auditItem.addUserId,
      //   auditRemark: this.form.remark
      // }
      this.kaiPiao.auditJingName = this.name;
      this.kaiPiao.auditJingId = this.uid;
      this.kaiPiao.status = status;
      this.kaiPiao.jingLiRemark=this.form.remark
      this.postRequest("/kai/piao/check", this.kaiPiao).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.$message.success("审核成功");
          this.dialogFormVisible2 = false;
          this.innerVisible=false;
          this.getCollectMouldList(1, this.currentPage0, this.pagesize0)
        } else {
          this.$message.error("审核失败");
        }
      })
    },
    tongGuo(status) {
      // let params = {
      //   id: this.kaiPiao.id,
      //   status: status,
      //   auditId: this.uid,
      //   auditName: this.name,
      //   addUserId: this.auditItem.addUserId
      // }
      this.kaiPiao.auditJingName = this.name;
      this.kaiPiao.auditJingId = this.uid;
      this.kaiPiao.status = status;
      this.postRequest("/kai/piao/check", this.kaiPiao).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.$message.success("审核成功");
          this.dialogFormVisible2 = false;
          this.getCollectMouldList(1, this.currentPage1, this.pagesize1)
        } else {
          this.$message.error("审核失败");
        }
      })
    },
    toAudit(item) {
      this.auditItem = item;
      this.dialogFormVisible = true;
      this.getRequest("/fa/mo/info?id=" + item.id).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.form = resp.data.data.faMo
        }
      })
    },
    tongGuoShenHe(item) {
      if (item.index == 0) {
        this.getCollectMouldList(1, this.currentPage0, this.pagesize0)
      } else if (item.index == 1) {
        this.getCollectMouldList(2, this.currentPage1, this.pagesize1)
      } else if (item.index == 2) {
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
      this.getCollectMouldList(1, this.currentPage0, this.pagesize0);
    },
    handleCurrentChange0(val) {
      this.currentPage0 = val;
      this.getCollectMouldList(1, this.currentPage0, this.pagesize0);
    },

    handleSizeChange1(val) {
      this.pagesize1 = val;
      this.getCollectMouldList(2, this.currentPage1, this.pagesize1);
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
      this.getCollectMouldList(2, this.currentPage1, this.pagesize1);
    },

    handleSizeChange2(val) {
      this.pagesize2 = val;
      this.getCollectMouldList(-2, this.currentPage2, this.pagesize2);
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val;
      this.getCollectMouldList(-2, this.currentPage2, this.pagesize2);
    },

    // 获取待审核的列表
    getCollectMouldList(audit, currentPage, pagesize) {
      let _this = this
      this.getRequest("/kai/piao/listbypage?page=" + currentPage + "&size=" + pagesize + "&status=" + audit).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          if (audit == 1) {
            _this.tableData0 = resp.data.data.famolist
            _this.totalnum0 = resp.data.data.count
          } else if (audit == 2) {
            _this.tableData1 = resp.data.data.famolist
            _this.totalnum1 = resp.data.data.count
          } else if (audit == -2) {
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
    this.getCollectMouldList(1, 1, 10);
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
