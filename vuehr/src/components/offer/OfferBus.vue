<template>
<div>
  <div v-show="showTab ==1">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>商务报价</el-breadcrumb-item>
        <el-breadcrumb-item>商务报价列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center;margin-top:30px;">
        <div class="handle-box">
          <el-button type="primary" icon="plus" class="mr10" @click="toadd">增添商务价单</el-button>
          <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" icon="search"></el-input>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px;margin-top:20px;">
        <div>
          <el-table :data="tableData" stripe v-loading="tableLoading" style="width: 100%">
            <el-table-column label="客户单位" prop="clientCompanyName">
            </el-table-column>
            <el-table-column label="车型" prop="carType">
            </el-table-column>
            <el-table-column label="审核状态" prop="aduit">
              <template slot-scope="scope">
            <el-tag v-if="scope.row.audit+'' === '0'" type="info">审核中</el-tag>
            <el-tag v-if="scope.row.audit+'' === '1'" type="success">通过</el-tag>
            <el-tag v-if="scope.row.audit+'' === '2'" type="danger">驳回</el-tag>
          </template>
            </el-table-column>
            <!-- <el-table-column label="最终价格(含税)" prop="finalBaoJia">
            </el-table-column> -->
            <el-table-column label="最终价格(含税)" prop="finalBaoJia">
              <template slot-scope="scope">
            <el-popover trigger="hover" placement="top" >
              <p >不含税价: {{ scope.row.noTaxfinalBaoJia}}</p>
              <div slot="reference" class="name-wrapper">
                <span size="medium">{{ scope.row.finalBaoJia}}</span>
              </div>
            </el-popover>
          </template>
            </el-table-column>
            <el-table-column label="税率" prop="tax">
            </el-table-column>
            <!-- <el-table-column label="税前合计" prop="noTaxTotal">
            </el-table-column> -->


            <el-table-column label="初次报价(含税)" prop="total">
              <template slot-scope="scope">
            <el-popover trigger="hover" placement="top" >
              <p >不含税价: {{ scope.row.noTaxTotal }}</p>
              <div slot="reference" class="name-wrapper">
                <span size="medium">{{ scope.row.total }}</span>
              </div>
            </el-popover>
          </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime">
              <template slot-scope="scope">
            <span>{{scope.row.createTime | formatDateTime}}</span>
          </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="280">
              <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="toinfo(scope.row.id)">详情</el-button>
            <el-button v-if="scope.row.submitType+'' === '0'"
              size="mini"
              type="warning"
              @click="dayin(scope.row)">打印</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="toYouHui(scope.row)">优惠价</el-button>
        </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-container>
    <div class="block" style="float:right;margin-top:15px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 30, 80, 100]" :page-size="pagesize" layout="total,sizes, prev, pager, next, jumper" :total="totalnum">
      </el-pagination>
    </div>

  <el-dialog title="设置最终优惠价格" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="最终优惠价格：" >
      <el-input-number v-model="form.finalBaoJia" :min="0"></el-input-number>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="toAddYouHui">确 定</el-button>
  </div>
</el-dialog>
  </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      username: '',
      name: '',
      uid: '',
      showTab: 1,
      tableLoading: false,
      currentPage: 1,
      totalnum: 0,
      pagesize: 10,
      select_word: '',
      tableData: [],
      form:{
        finalBaoJia: 0
      },
      itemYouHui:{}
    }
  },
  methods: {
    toYouHui(item){
      this.itemYouHui = item
      this.dialogFormVisible = true
      this.form.finalBaoJia=0;
    },
    toAddYouHui(){
      let _this = this
      let params = {
        id: this.itemYouHui.id,
        tax: this.itemYouHui.tax,
        finalBaoJia: this.form.finalBaoJia
      }
      this.postRequest("/offer/bus/update/final/baojia", params).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
           this.$message.success("设置成功");
           this.getCollectMouldList()
           this.dialogFormVisible = false;
        }else{
          this.$message.error("设置失败");
          this.dialogFormVisible = false;
        }
      })
    },
    dayin(item) {
      let id = item.id;
      this.$router.push('/print/bus/' + id)
    },
    toinfo(id) {
      this.$router.push('/offer/bus/info/' + id)
    },
    toadd() {
      this.$router.push('/offer/bus/add')
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
      this.getRequest("/offer/bus/listbypage?page=" + this.currentPage + "&size=" + this.pagesize + "&addUserId=" + this.uid).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          _this.tableData = resp.data.data.busbaojialist
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
    <div class="crumbs" >
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>报价管理</el-breadcrumb-item>
        <el-breadcrumb-item>商务报价单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center;margin-top:30px;">
        <div class="handle-box">
          <el-button type="primary" icon="plus" class="mr10" @click="">增添商务报价</el-button>
          <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" icon="search"></el-input>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px;margin-top:20px;">
        <div>
          <el-table :data="tableData" stripe  v-loading="tableLoading" style="width: 100%">
            <el-table-column label="客户单位" prop="clientCompanyName">
            </el-table-column>
            <el-table-column label="车型" prop="carType">
            </el-table-column>
            <el-table-column label="审核状态" prop="aduit">
              <template slot-scope="scope">
            <el-tag v-if="scope.row.audit+'' === '0'" type="info">审核中</el-tag>
            <el-tag v-if="scope.row.audit+'' === '1'" type="success">通过</el-tag>
            <el-tag v-if="scope.row.audit+'' === '2'" type="danger">驳回</el-tag>
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
              @click="mojuInfo(scope.row)">打印</el-button>
        </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-container>
    <div class="block" style="float:right;margin-top:15px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 30, 80, 100]" :page-size="pagesize" layout="total,sizes, prev, pager, next, jumper" :total="totalnum">
      </el-pagination>
    </div>
  </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      username: '',
      name: '',
      uid: '',
      showTab: 1,
      tableLoading: false,
      currentPage: 1,
      totalnum: 0,
      pagesize: 10,
      select_word: '',
      tableData: []
    }
  },
  methods: {
    toadd() {
      this.$router.push('/offer/per/add')
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
      this.getRequest("/offer/bus/listbypage?page=" + this.currentPage + "&size=" + this.pagesize + "&addUserId=" + this.uid).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          _this.tableData = resp.data.data.busbaojialist
          console.log(_this.tableData);
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
