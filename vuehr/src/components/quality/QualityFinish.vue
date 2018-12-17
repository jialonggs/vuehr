<template>
<div>
  <div>
    <div class="crumbs" >
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>质量管理</el-breadcrumb-item>
        <el-breadcrumb-item>完成的订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center;margin-top:30px;">
        <div class="handle-box">
          <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" icon="search"></el-input>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px;margin-top:20px;">
        <div>
          <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="orderName" label="产品名称">
              </el-table-column>
              <el-table-column label="下单日期">
                  <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.createTime | formatDate }}</span>
            </template>
              </el-table-column>
              <el-table-column label="加工完成">
                  <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.finishTime | formatDate }}</span>
            </template>
              </el-table-column>
              <el-table-column label="审核负责人">
                  <template slot-scope="scope">
                    <el-tag v-for="itemUser in scope.row.qualityOrderUsers" type="success">{{itemUser.userName}}</el-tag>
            </template>
              </el-table-column>
              <el-table-column  label="紧急程度">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.urgency+'' === '0'" type="primary">一般</el-tag>
                  <el-tag v-if="scope.row.urgency+'' === '1'" type="danger">紧急</el-tag>
            </template>
              </el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="toXiangqing">查看详情</el-button>
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
  <!-- 审核步骤 -->
  <el-dialog title="步骤审核" :visible.sync="dialogFormVisible" width='40%'>
      <div class="form-box">
          <el-form ref="form" :model="form" label-width="120px">
              <el-form-item label="当前步骤：">
                  <el-input></el-input>
              </el-form-item>
              <el-form-item label="加工负责人：">
                  <el-input></el-input>
              </el-form-item>
              <el-form-item label="开始时间：">
                  <el-col :span="11">
                      <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
                  </el-col>
                  <el-col class="line" :span="2">-</el-col>
                  <el-col :span="11">
                      <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
                  </el-col>
              </el-form-item>
              <el-form-item label="备注：">
                  <el-input type="textarea" v-model="form.desc"></el-input>
              </el-form-item>
              <el-form-item label="上传照片：">
                  <el-upload class="upload-demo" drag action="/api/posts/" multiple>
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                      <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
                  </el-upload>
              </el-form-item>
          </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogFormVisible = false">通 过</el-button>
          <el-button type="danger" @click="">驳 回</el-button>
      </div>
  </el-dialog>
</div>
</template>
<script>
export default {
  data() {
    return {
      username: '',
      name: '',
      uid: '',
      dialogFormVisible: false,
      select_word: '',
      form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
      },
      currentPage: 1,
      totalnum: 0,
      pagesize: 10,
      select_word: '',
      tableData: []
    }
  },
  methods: {

    handleSizeChange(val) {
      this.pagesize = val;
      this.getCollectMouldList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCollectMouldList();
    },
    // 获取待审核的列表
    getCollectMouldList() {
      let _this = this
      this.getRequest("/quality/over/listbypage?page=" + this.currentPage + "&size=" + this.pagesize).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {

          this.tableData = resp.data.data.overorderlist
          this.totalnum = resp.data.data.count
        }
      })
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableLoading = true;
    })
    this.username = localStorage.getItem('cp_username');
    this.uid = localStorage.getItem('cp_uid');
    this.name = localStorage.getItem('cp_name');
    this.getCollectMouldList();
  },
  computed: {
    data() {
      const self = this;
      return self.tableData.filter(function(d) {
        if (d.wuLiaoName.indexOf(self.select_word) > -1 ||
            d.orderName.indexOf(self.select_word) > -1
        ) {
          return d;
        }
      });
    }
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
