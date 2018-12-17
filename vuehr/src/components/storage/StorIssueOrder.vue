
<template>
<div>
  <div v-show="nowTab === 1">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>库房管理</el-breadcrumb-item>
        <el-breadcrumb-item>不合格列表</el-breadcrumb-item>
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
          <el-table-column label="订单状态">
            <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.storageStatus+'' === '3'" >待处理</el-tag>
          <!-- <el-tag type="success">{{scope.row.storageStatus}}</el-tag> -->
        </template>
          </el-table-column>
          <el-table-column label="工艺类型" prop="machiningType">
          </el-table-column>
          <el-table-column label="备忘">
            <template slot-scope="scope">
        <el-tag v-if="scope.row.hasRemark+'' === 'true'" >有</el-tag>
        <el-tag v-if="scope.row.hasRemark+'' === 'false'" type="info">无</el-tag>
      </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime">
            <template slot-scope="scope">{{ scope.row.createTime | formatDateTime}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
            <!-- <el-button
                size="mini"
                type="warning"
                @click="toShenHe(scope.row)">检查</el-button> -->
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
  <!-- 审核步骤 -->
  <el-dialog title="入库审核" :visible.sync="dialogFormVisible" width='40%' v-loading="tableLoading">
    <div class="form-box">
      <el-form ref="form" :model="form" label-width="120px" >
        <!-- <el-form-item prop="presentStepName" label="当前步骤：">
          <el-input :disabled="true" v-model="form.presentStepName">44</el-input>
        </el-form-item> -->
        <el-form-item label="审核备注：">
          <el-input type="textarea" v-model="form.kuFangRemark"></el-input>
        </el-form-item>
        <!-- <el-form-item label="上传文件：" >
          <div v-show="wen_jian_url !== ''">
            <p style="color: blue;">上传成功</p>
          </div>
          <div v-show="wen_jian_url === ''">
              <vue-core-image-upload :class="['el-button', 'el-button-primary']"
              :crop="false"
               inputOfFile="imageFile"
               :url="upload"
              extensions="png,ppt,doc,txt,jpg"
              :max-file-size="5242880"
              :data="wenjianData" text="上传文件"
              :multiple="true"
              :multiple-size="30"
              credentials="true"
              @imageuploaded="imageupwenjian" @errorhandle="handleError">
              </vue-core-image-upload>
          </div>
        </el-form-item> -->
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="shenhe(2)">通 过</el-button>
      <el-button type="danger" @click="shenhe(3)">驳 回</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
export default {
  data() {
    return {
      form:{},
      dialogFormVisible: false,
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
    }
  },
  methods: {
    toOrderinfo(data) {
      this.$router.push('/plant/order/info/' + data.id)
    },
    toShenHe(item){
      this.dialogFormVisible = true;
      this.itemRuKu = item;
      this.form.kuFangRemark = "";
    },
    shenhe(status){
      let _this = this;
      let params = {
        kuFangRemark: this.form.kuFangRemark,
        orderId:this.itemRuKu.id,
        storageStatus:status
      }
      _this.tableLoading = true;
      this.postRequest("/storage/put/check", params).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.$message.success("执行成功")
          this.dialogFormVisible = false;
          this.getCollectMouldList()
        }else {
          this.$message.error("执行失败")
        }
      })
    },
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
      this.getRequest("/storage/put/listbypage?page=" + this.currentPage + "&size=" + this.pagesize +"&storageStatus=" +'3').then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          _this.tableData = resp.data.data.putorderlist
          _this.totalnum = resp.data.data.count
        }
      })
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableLoading = true;
      // this.getCollectMouldList();
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
