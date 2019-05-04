<template>
<div>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>药检管理</el-breadcrumb-item>
        <el-breadcrumb-item>药检记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-main style="padding-left: 0px;padding-top: 0px;margin-top:20px;">
        <div>
          <el-tabs type="border-card" @tab-click="tongGuoShenHe">
            <el-tab-pane>
              <span slot="label"><i class="el-icon-date">待提交</i></span>
              <el-table :data="tableData0" :row-class-name="tableRowClassName">
                <el-table-column label="订单名称" prop="orderName">
                </el-table-column>
                <el-table-column label="负责人" prop="addUserName">
                </el-table-column>
                <el-table-column label="紧急程度" prop="aduit">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.urgency+'' === '0'" type="primary">不急</el-tag>
                    <el-tag v-if="scope.row.urgency+'' === '1'" type="danger">正常</el-tag>
                    <el-tag v-if="scope.row.urgency+'' === '2'" type="primary">急C</el-tag>
                    <el-tag v-if="scope.row.urgency+'' === '3'" type="danger">急B</el-tag>
                    <el-tag v-if="scope.row.urgency+'' === '4'" type="primary">急A</el-tag>
                    <el-tag v-if="scope.row.urgency+'' === '5'" type="danger">紧急C</el-tag>
                    <el-tag v-if="scope.row.urgency+'' === '6'" type="primary">紧急B</el-tag>
                    <el-tag v-if="scope.row.urgency+'' === '7'" type="danger">紧急A</el-tag>
                    <el-tag v-if="scope.row.urgency+'' === '8'" type="danger">特急</el-tag>
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
                type="danger"
                @click="toAdd(scope.row)">提交药检报告</el-button>
            </template>
                </el-table-column>
              </el-table>
              <div class="block" style="float:right;margin-top:15px;">
                <el-pagination @size-change="handleSizeChange0" @current-change="handleCurrentChange0" :current-page="currentPage0" :page-sizes="[10, 30, 80, 100]" :page-size="pagesize0" layout="total,sizes, prev, pager, next, jumper" :total="totalnum0">
                </el-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label"><i class="el-icon-date">已提交</i></span>
              <el-table :data="tableData1" :row-class-name="tableRowClassName1">
                <el-table-column label="订单名称" prop="orderName">
                </el-table-column>
                <el-table-column label="负责人" prop="addUserName">
                </el-table-column>
                <el-table-column label="紧急程度" prop="aduit">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.urgency+'' === '0'" type="primary">不急</el-tag>
                    <el-tag v-if="scope.row.urgency+'' === '1'" type="danger">正常</el-tag>
                    <el-tag v-if="scope.row.urgency+'' === '2'" type="primary">急C</el-tag>
                    <el-tag v-if="scope.row.urgency+'' === '3'" type="danger">急B</el-tag>
                    <el-tag v-if="scope.row.urgency+'' === '4'" type="primary">急A</el-tag>
                    <el-tag v-if="scope.row.urgency+'' === '5'" type="danger">紧急C</el-tag>
                    <el-tag v-if="scope.row.urgency+'' === '6'" type="primary">紧急B</el-tag>
                    <el-tag v-if="scope.row.urgency+'' === '7'" type="danger">紧急A</el-tag>
                    <el-tag v-if="scope.row.urgency+'' === '8'" type="danger">特急</el-tag>
            </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="createTime">
                  <template slot-scope="scope">
                <span>{{scope.row.createTime | formatDateTime}}</span>
              </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                  <a :href="scope.row.fileUrl" download="" style="color:blue;">下载文件</a>
            </template>
                </el-table-column>
              </el-table>
              <div class="block" style="float:right;margin-top:15px;">
                <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="currentPage1" :page-sizes="[10, 30, 80, 100]" :page-size="pagesize1" layout="total,sizes, prev, pager, next, jumper" :total="totalnum1">
                </el-pagination>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
          <!-- 添加药检信息 -->
          <el-dialog title="药检信息" :visible.sync="dialogFormVisible" width='50%' v-loading="add_yaojian_loading">
              <div class="form-box">
                  <el-form ref="form" :model="form" label-width="120px">
                      <el-form-item label="上传文件：" >
                        <div v-show="wen_jian_url !== ''">
                          <p style="color: blue;">上传成功</p>
                        </div>
                        <div v-show="wen_jian_url === ''">
                            <vue-core-image-upload :class="['el-button', 'el-button--primary']"
                            :crop="false"
                             inputOfFile="imageFile"
                             :url="upload"
                            extensions="png,ppt,docx,txt,xlsx,pdf"
                            :max-file-size="5242880"
                            :data="imageData" text="上传文件"
                            :multiple="true"
                            :multiple-size="30"
                            credentials="true"
                            @imageuploaded="imageuploaded" @errorhandle="handleError">
                            </vue-core-image-upload>
                        </div>
                      </el-form-item>
                      <el-form-item label="备注：">
                          <el-input type="textarea" v-model="form.remark"></el-input>
                      </el-form-item>
                  </el-form>
              </div>
              <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="addYaoJian()">提 交</el-button>
                  <el-button @click="dialogFormVisible = false">取 消</el-button>
              </div>
          </el-dialog>
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
import VueCoreImageUpload from 'vue-core-image-upload';
import JLApiUtils from '../../utils/JLApiUtils.js';
export default {
  components: {
      VueCoreImageUpload
  },
  data() {
    return {
      ceshi: '1222',
      ceshi2: 'ewew',
      upload: '',
      //upload: 'http://localhost:8885/config/upload/image',
      dialogFormVisible: false,
      add_yaojian_loading: false,
      imageData: {
          userId: '123',
          imgPakage: 'yao_jian'
      },
      wen_jian_url:'',
      form: {
        fileUrl:'',
        orderId:'',
        remark:'',
        addUserId:'',
        addUserName:''
      },
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
    tongGuoShenHe(data){
      if(data.index == 0){
        this.getCollectMouldList(false, this.currentPage0, this.pagesize0)
      }else{
        this.getAdded(this.currentPage1, this.pagesize1)
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
      this.getAdded(this.currentPage1, this.pagesize1);
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
      this.getAdded(this.currentPage1, this.pagesize1);
    },
    toAdd(item){
      let self = this;
      self.dialogFormVisible = true;
      self.form.orderId = item.id;
    },
    addYaoJian() {
        let self = this;
        if(self.wen_jian_url == 'undefined' || self.wen_jian_url == ''){
          self.$message.error("请先上传文件")
          return
        }
        self.add_yaojian_loading = true;
        self.form.addUserId = this.uid;
        self.form.addUserName = this.name;
        self.form.fileUrl = this.wen_jian_url;
        this.postRequest("/yao/list/add", self.form).then(resp => {
          self.add_yaojian_loading = false;
            if (resp && resp.status == 200 && resp.data.code == 0) {
                self.$message.success("添加成功");
                self.wen_jian_url = '';
                self.form.remark = '';
                self.dialogFormVisible = false;
                self.getCollectMouldList(false, self.currentPage0, self.pagesize0);
            } else {
                self.$message.error("添加失败");
            }
        })
    },
    // 获取订单列表
    getCollectMouldList(audit, currentPage, pagesize) {
      let _this = this
      this.getRequest("/yao/list/listbypage?page=" + currentPage + "&size=" + pagesize + "&yaoJian=" + audit).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          if (!audit){
            _this.tableData0 = resp.data.data.yaolist
            _this.totalnum0 = resp.data.data.count
          }else if(audit){
            _this.tableData1 = resp.data.data.yaolist
            _this.totalnum1 = resp.data.data.count
          }
        }
      })
    },
    // 获取订单列表
    getAdded(currentPage, pagesize) {
      let _this = this
      this.getRequest("/yao/list/added?page=" + currentPage + "&size=" + pagesize).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
            console.log(resp);
            _this.tableData1 = resp.data.data.yaolist
            _this.totalnum1 = resp.data.data.count

        }
      })
    },
    imageuploaded(data) {
      this.$message.success("上传成功");
      let urls = [];
      urls = data.url;
      if(urls != 'undefinded' && urls.length > 0 ){
        this.wen_jian_url = urls[0];
      }
    },
    // 上传图片失败
    handleError() {
        this.$notify.error({
            title: '上传失败',
            message: '图片上传出现异常'
        });
    },
  },
  mounted: function() {
    this.username = localStorage.getItem('cp_username');
    this.uid = localStorage.getItem('cp_uid');
    this.name = localStorage.getItem('cp_name');
    this.upload = JLApiUtils.upload;
    this.getCollectMouldList(false,1,10);
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
