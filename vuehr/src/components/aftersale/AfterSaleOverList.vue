<template>
<div>
  <div>
    <div class="crumbs" >
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>已分配售后</el-breadcrumb-item>
        <el-breadcrumb-item>已分配记录</el-breadcrumb-item>
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
              <el-table-column prop="orderName" label="订单名称">
                <template slot-scope="scope">
                  <span>{{scope.row.order.orderName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="addUserName" label="项目负责人">
                <template slot-scope="scope">
                  <span>{{scope.row.order.addUserName}}</span>
                </template>
                </el-table-column>
              <el-table-column label="下单日期">
                  <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.order.createTime | formatDate }}</span>
            </template>
          </el-table-column>
              <el-table-column prop="urgency" label="紧急程度">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.order.urgency+'' === '0'" type="primary">不急</el-tag>
                  <el-tag v-if="scope.row.order.urgency+'' === '1'" type="danger">正常</el-tag>
                  <el-tag v-if="scope.row.order.urgency+'' === '2'" type="primary">急C</el-tag>
                  <el-tag v-if="scope.row.order.urgency+'' === '3'" type="danger">急B</el-tag>
                  <el-tag v-if="scope.row.order.urgency+'' === '4'" type="primary">急A</el-tag>
                  <el-tag v-if="scope.row.order.urgency+'' === '5'" type="danger">紧急C</el-tag>
                  <el-tag v-if="scope.row.order.urgency+'' === '6'" type="primary">紧急B</el-tag>
                  <el-tag v-if="scope.row.order.urgency+'' === '7'" type="danger">紧急A</el-tag>
                  <el-tag v-if="scope.row.order.urgency+'' === '8'" type="danger">特急</el-tag>
            </template>
              </el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="toChaKan(scope.row)">售后回执单</el-button>
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
  <el-dialog title="分配销售人员" :visible.sync="dialogFormVisible" width='40%'>
      <div class="form-box">
          <el-form ref="form" :model="form" label-width="120px">
              <el-form-item label="备注：">
                  <el-input type="textarea" v-model="form.remark"></el-input>
              </el-form-item>
              <el-form-item label="下载原文件" prop="remark">
              <template >
                <a :href="wen_jian_url" download="w3logo" style="color:blue;">下载原文件</a>
          </template>
              </el-form-item>
          </el-form>
      </div>
      <div style="border: 1px dashed #d9d9d9;width:100%;min-height:358px;">
        <el-row :gutter="20" style="margin-top:10px;">
          <el-col :span="6" v-for="imageUrl in imageUrls ">
            <el-card :body-style="{ padding: '0px' }" class="mould-card">
              <img class="image" v-bind:src="imageUrl" style="height:320px;">
              <div style="text-align:center;">
                <el-button type="text" @click="delMouldImage(imageUrl)"><i class="el-icon-error" style="color:red;"></i></el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
  </el-dialog>
</div>
</template>
<script>
export default {
  data() {
    return {
      wen_jian_url:[],
      imageUrls:[],
      restaurants4:[],
      username: '',
      itemYga:[],
      name: '',
      uid: '',
      fenPei:'',
      dialogFormVisible: false,
      select_word: '',
      form: {
          remark: '',
      },
      currentPage: 1,
      totalnum: 0,
      pagesize: 10,
      select_word: '',
      tableData: []
    }
  },
  methods: {
    toChaKan(item){
      let remark = item.shBaoGao.remark;
      let fileUrl = item.shBaoGao.fileUrl;
      let picUrls = item.shBaoGao.picUrls;
      this.form.remark = remark;
      this.wen_jian_url = fileUrl;
      this.imageUrls = this.splitUrl(picUrls);
      this.dialogFormVisible = true;
    },
    splitUrl(item) {
      let picurl = item;
      let urlArray = [];
      if (picurl != "undefined" && picurl != "") {
        urlArray = picurl.split('|');
      }
      return urlArray;
    },
    quxiao(){
      this.wen_jian_url = '';
      this.imageUrls = [];
      this.form.remark='';
      this.dialogFormVisible = false;
    },
    toAdd(){
     let shouhou = {
          remark: this.form.remark,
          orderId: this.fenPei.id,
          userId: this.itemYag.id,
          userName: this.itemYga.value,
          addUserId:this.uid,
          addUserName:this.name
      }

      this.jsonPostRequest("/after/sale/wait/add", shouhou).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.$message.success("分配成功");
          this.dialogFormVisible = false;
          this.getCollectMouldList();
        } else {
          this.$message.error("分配失败");
        }
      })
    },
    loadAllYuanGongA() {
      let self = this
      this.getRequest("/config/mangers?role=ROLE_shouhou").then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          let item = []
          let re = resp.data.data;
          if (re != 'undefined' && re.length > 0) {
            for (var i = 0; i < re.length; i++) {
              let elem = {
                label: '',
                value: ''
              }
              elem.label = re[i].name
              elem.value = re[i].id
              item.push(elem);
            }
            self.restaurants4 = item;
          }
        } else {
          console.log("获取列表数据失败");
        }
      });
    },
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
      this.getRequest("/after/sale/job/list?page=" + this.currentPage + "&size=" + this.pagesize +
    "&userId=" + this.uid + "&status=2" ).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {

          this.tableData = resp.data.data.shouhoulist
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
