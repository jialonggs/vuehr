<template>
<div>
  <div v-show="nowTab === 1">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>收模管理</el-breadcrumb-item>
        <el-breadcrumb-item>收模列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center;margin-top:20px;">
        <div class="handle-box">
          <el-button type="primary" icon="plus" class="mr10" @click="toAddMouldRecord">增添收模记录</el-button>
          <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" icon="search"></el-input>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <el-table :data="data" stripe v-loading="tableLoading">
          <el-table-column prop="createTime" align="center" label="日期">
            <template slot-scope="scope">{{ scope.row.createTime | formatDateTime}}</template>
          </el-table-column>
          <el-table-column prop="batch" align="center" label="批次">
          </el-table-column>
          <el-table-column prop="clientCompanyName" align="center" label="客户单位">
          </el-table-column>
          <el-table-column align="center" label="模具总数">
            <template slot-scope="scope" v-if="scope.row.mouldInfos+'' !=='null' && scope.row.mouldInfos +'' !=='undefined'">{{ scope.row.mouldInfos.length}}</template>
          </el-table-column>
          <el-table-column prop="addUserName" align="center" label="添加人">
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
        <el-button
          size="mini"
          type="primary"
          @click="chaKan(scope.row)">基础详情</el-button>
          <el-button
            size="mini"
            type="warning"
            @click="mojuInfo(scope.row)">模具信息</el-button>
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
  <!-- 模具card -->
  <div v-show="nowTab==3">
    <div class="table">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-menu"></i>收模管理</el-breadcrumb-item>
          <el-breadcrumb-item>模具信息</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-card class="box-card" style="margin-top:25px;">
        <div slot="header" class="clearfix">
          <span>模具信息</span>
        </div>
        <div>
          <el-row :gutter="20">
            <el-col :span="6">
              <div @click="toChangeDisable">
                <el-card style="min-height:460px;" class="mould-card">
                  <div style="padding: 14px;">
                    <img class="image">
                    <i class="el-icon-plus">添加模具记录</i>
                  </div>
                </el-card>
              </div>
            </el-col>
            <el-col :span="6" v-for="part in partsInfos">
              <el-card :body-style="{ padding: '0px' }" class="mould-card" v-loading="mouldPartLoading">
                <img class="image" v-bind:src="part.picUrls[0]">
                <div style="padding: 14px;">
                  <h4>{{part.mouldName}}</h4>
                  <span>备注：{{part.remark}}</span>
                  <div class="bottom clearfix">
                    <time class="time"></time>
                    <el-dropdown style="float: right;color: #409EFF;">
                      <span class="el-dropdown-link"><i class="el-icon-edit"></i>
                                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                          <el-button type="text" @click="mouldInfos(part)">详情</el-button>
                        </el-dropdown-item>
                        <el-dropdown-item>
                          <el-button type="text" @click="delMouldRecord(part.id)" :disabled="upadteDisabled">删除</el-button>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <div class="card-bottom">
          <el-button type="primary" style="float:left !important" @click="toLieBiao">返回</el-button>
        </div>
      </el-card>
    </div>
  </div>
  <!-- 具体模具信息 -->
  <div v-show="nowTab == 4">
    <div class="table">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-menu"></i>收模管理</el-breadcrumb-item>
          <el-breadcrumb-item>增添收模</el-breadcrumb-item>
          <el-breadcrumb-item>模具详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-card class="box-card" style="margin-top:25px;">
        <div slot="header" class="clearfix">
          <span>基础信息</span>
        </div>
        <div class="form-box">
          <el-form :model="form" ref="form" label-width="120px" :rules="rules">
            <el-form-item label="模具名称：" prop="mouldName">
              <el-input style="width:28%" placeholder="请输入模具名称" v-model="form.mouldName"></el-input>
            </el-form-item>
            <el-form-item label="模具数量：" prop="mouldNum">
              <el-input-number v-model="form.mouldNum" controls-position="right" @change="handleChange" :min="1"></el-input-number>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              <el-input style="width:28%" type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
            <el-form-item label="上传图片：">
              <div>
                <vue-core-image-upload :crop="false" inputOfFile="imageFile" :url="upload" extensions="png,gif,jpeg,jpg" :class="['el-button', 'el-button--primary']" :max-file-size="5242880" :data="imageData" text="上传图片" :multiple="true" :multiple-size="30" credentials="true"
                  @imageuploaded="imageuploaded" @errorhandle="handleError">
                </vue-core-image-upload>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div style="border: 1px dashed #d9d9d9;width:100%;min-height:358px;">
          <el-row :gutter="20" style="margin-top:10px;">
            <el-col :span="6" v-for="imageUrl in imageUrls ">
              <el-card :body-style="{ padding: '0px' }" class="mould-card">
                <img class="image" v-bind:src="imageUrl" style="height:420px;">
                <div style="text-align:center;">
                  <el-button type="text" @click="delMouldImage(imageUrl)"><i class="el-icon-error" style="color:red;"></i></el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <div class="card-bottom">
          <el-button type="primary" style="float:left !important" @click="toMojuLieBiao">返回</el-button>
          <el-button v-show="part_disable === false" type="primary" @click="addMouldInfos('form')">提交</el-button>
          <el-button v-show="part_disable === true" type="primary" @click="to_update_partinfo('form')">更新</el-button>
        </div>
      </el-card>
    </div>
  </div>
  <!-- 添加表单 -->
  <div style="width:100%;float:right;" v-show="nowTab==2">
    <div class="table">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-menu"></i>收模管理</el-breadcrumb-item>
          <el-breadcrumb-item>收模详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-card class="box-card" style="margin-top:25px;">
        <div slot="header" class="clearfix">
          <span>收模基础信息</span>
        </div>
        <div>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
            <el-form-item label="批次：" prop="batch">
              <el-input style="width:28%;" placeholder="设置时间后会自动判断批次" v-model="batch" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="收模时间：" prop="createTime" required>
              <el-date-picker @change="toChange" :disabled="tiem_disablse" style="width:28%" format="yyyy 年 MM 月 dd 日 HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="ruleForm.createTime" type="datetime" placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="客户单位：" prop="clientCompanyName">
              <el-input style="width:28%;" placeholder="请输入客户单位名称" v-model="ruleForm.clientCompanyName" :disabled="base_disablse"></el-input>
            </el-form-item>
            <el-form-item label="运输方式：" prop="freightType">
              <el-radio-group v-model="ruleForm.freightType" :disabled="base_disablse">
                <el-radio label="快递"></el-radio>
                <el-radio label="货运"></el-radio>
                <el-radio label="专车"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="车牌号：" prop="carNum">
              <el-input style="width:28%;" placeholder="请输入车牌号" v-model="ruleForm.carNum" :disabled="base_disablse"></el-input>
            </el-form-item>
            <el-form-item label="驾驶员手机号：" prop="driverPhone">
              <el-input style="width:28%;" placeholder="请输入手机号" v-model="ruleForm.driverPhone" :disabled="base_disablse"></el-input>
            </el-form-item>
            <el-form-item label="包装方式：">
              <div style="border: 1px dashed #d9d9d9;width:40%;min-height:128px;">
                <el-form-item label="简包：" prop="jianBao">
                  <el-switch v-model="ruleForm.jianBao" :disabled="base_disablse" active-text="是" inactive-text="否">
                  </el-switch>
                </el-form-item>
                <el-form-item label="木箱：" style="margin-top:10px;" prop="woodenCaseNum">
                  <el-input-number v-model="ruleForm.woodenCaseNum" controls-position="right" @change="handleChange" :min="0" :disabled="base_disablse"></el-input-number>
                </el-form-item>
                <el-form-item label="托盘：" style="margin-top:10px;" prop="palletNum">
                  <el-input-number v-model="ruleForm.palletNum" controls-position="right" @change="handleChange" :min="0" :disabled="base_disablse"></el-input-number>
                </el-form-item>
                <el-form-item label="吊环：" style="margin-top:10px;" prop="diaoHuanNum">
                  <el-input-number v-model="ruleForm.diaoHuanNum" controls-position="right" @change="handleChange" :min="0" :disabled="base_disablse"></el-input-number>
                </el-form-item>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <div class="card-bottom">
            <el-button type="primary" style="float:left" @click="goBack">返 回 </el-button>
            <el-button style="float:right" v-show="toAddDisable === true" @click="resetForm('ruleForm')">重 置</el-button>
            <el-button type="primary" style="float:right" @click="submitForm('ruleForm')" v-show="toAddDisable === true">保 存</el-button>
            <el-button style="float:right" v-show="update_disablse === true " type="primary" @click="updateCollectionInfo('ruleForm')">提 交</el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</div>
</template>
<script>
import timeFilter from '../../utils/timeFilter.js'
import VueCoreImageUpload from 'vue-core-image-upload';
import JLApiUtils from '../../utils/JLApiUtils.js';
export default {
  components: {
    VueCoreImageUpload
  },
  data() {
    return {
      pkGuid: '',
      shouMoId: '',
      mouldPartLoading: false,
      updateId: '',
      partsInfos: [],
      nowTab: 1,
      mojuCard: false,
      moJuDisable: false,
      form: {
        mouldNum: 1,
        addUserId: '',
        addUserName: '',
        shouMoId: '',
        picUrls: ''
      },
      upload: '',
      imageData: {
        userId: '',
        imgPakage: 'sfm_shou'
      },
      imageUrls: [],
      // 上传
      tableLoading: false,
      changeDisable: true,
      toAddDisable: false,
      currentPage: 1,
      totalnum: 0,
      pagesize: 10,
      select_word: '',
      tableData: [],
      username: '',
      uid: '',
      batch: '',
      upadteDisabled: false,
      tiem_disablse: false,
      part_disable: false,
      chomgzi_dis: false,
      update_disablse: false,
      base_disablse: false,
      doc_collect_id: '',
      dialogFormVisible: false,
      itemForm: {},
      ruleForm: {
        createTime: '',
        addUserName: '',
        addUserId: '',
        woodenCaseNum: '0',
        palletNum: '0',
        diaoHuanNum: '0',
        clientCompanyName: '',
        freightType: '',
        carNum: '',
        jianBao: false,
        driverPhone: ''
      },
      rules: {
        clientCompanyName: [{
          min: 1,
          max: 64,
          message: '长度在 1 到 64 个字符',
          trigger: 'blur'
        }],
        freightType: [{
          required: true,
          message: '请至少选择一种运输方式',
          trigger: 'blur'
        }],
        carNum: [{
          min: 8,
          max: 24,
          message: '长度在 8 到 24 个字符',
          trigger: 'blur'
        }],
        driverPhone: [{
          min: 11,
          max: 11,
          message: '请检查手机号码格式',
          trigger: 'blur'
        }],
        remark: [{
          min: 0,
          max: 255,
          message: '长度在 0 到 255 个字符',
          trigger: 'blur'
        }],
        mouldName: [{
            required: true,
            message: '请输入模具名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 1 到 255 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    delMouldRecord(pkGuid) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.toDelPartInfo(pkGuid);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    toAddMould() {
      this.$confirm('是否添加模具信息?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        this.toAddMouldRecord();
      }).catch(() => {
        this.getCollectMouldList();
        // this.$message({
        //   type: 'info',
        //   message: '已取消'
        // });
      });
    },

    toDelPartInfo(pkGuid) {
      let self = this;
      if (pkGuid == 'undefined' || pkGuid == '') {
        self.$message.error("删除出错")
        return
      }
      this.getRequest("/shou/mo/del/mould?mouldId=" + pkGuid).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.toGetColletPartInfo();
          self.$message.success("删除成功");
        } else {
          self.$message.error("删除失败");
        }
      })
    },
    toGetColletPartInfo() {
      this.mouldPartLoading = true;
      let self = this;
      if (self.pkGuid == 'undefined' || self.pkGuid == '') {
        this.mouldPartLoading = false;
        self.$message.error("获取模具列表失败")
        return
      }
      this.getRequest("/shou/mo/list/mouldinfo?shouMoId=" + self.pkGuid).then(resp => {
        this.mouldPartLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.partsInfos = [];
          let parts = resp.data.data;
          parts.forEach(function(part, index, array) {
            let picurl = part.picUrls;
            let urlArray = [];
            if (picurl != "undefined" && picurl != "") {
              urlArray = picurl.split('|');
              part.picUrls = urlArray;
            }
            self.partsInfos.push(part);
          })
        } else {
          console.log("获取失败");
        }
      });
    },
    to_update_partinfo(formName) {
      let self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let paramsData = self.form;
          if (self.imageUrls.length == 0) {
            self.$message.error("请上传必要图片");
            return;
          }
          let url = "";
          for (var i = 0; i < self.imageUrls.length; i++) {
            if (i == self.imageUrls.length - 1) {
              url = url + self.imageUrls[i]
            } else {
              url = self.imageUrls[i] + "|" + url
            }
          }
          paramsData.picUrls = url
          paramsData.shouMoId = this.shouMoId;
          paramsData.id = this.updateId;
          this.postRequest("/shou/mo/update/mouldinfo", paramsData).then(resp => {
            if (resp && resp.status == 200 && resp.data.code == 0) {
              self.$message.success("更新成功");
              self.resetForm('form');
              self.imageUrls = [];
              this.nowTab = 3;
              this.toGetColletPartInfo();
            } else {
              self.$message.error('更新失败');
            }
          })
        } else {
          console.log('提交数据格式有误');
          return false;
        }
      });
    },
    mouldInfos(item) {
      this.nowTab = 4;
      this.form = item;
      this.imageUrls = item.picUrls;
      this.part_disable = true;
      this.shouMoId = item.shouMoId;
      this.updateId = item.id;
    },
    toMojuLieBiao() {
      this.nowTab = 3;
    },
    toLieBiao() {
      this.nowTab = 1;
      this.partsInfos = [];
    },
    mojuInfo(item) {
      this.pkGuid = item.id;
      let parts = []
      parts = item.mouldInfos;
      if (parts != 'undefined' && parts.length > 0) {
        let newPartInfo = [];
        parts.forEach(function(part, index, array) {
          let picurl = part.picUrls;
          let urlArray = [];
          if (picurl instanceof Array){
              part.picUrls = picurl;
          } else {
            if (picurl != "undefined" && picurl != "") {
              urlArray = picurl.split('|');
              part.picUrls = urlArray;
            }
          }
          newPartInfo.push(part);
          console.log(newPartInfo);
        })
        this.partsInfos = newPartInfo;
      }
        this.nowTab = 3;
    },
    // 添加模具信息
    addMouldInfos(formName) {
      let self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let paramsData = self.form;
          if (self.imageUrls.length == 0) {
            self.$message.error("请上传必要图片");
            return;
          }
          let url = "";
          for (var i = 0; i < self.imageUrls.length; i++) {
            if (i == self.imageUrls.length - 1) {
              url = url + self.imageUrls[i]
            } else {
              url = self.imageUrls[i] + "|" + url
            }
          }
          paramsData.picUrls = url
          paramsData.addUserId = this.uid;
          paramsData.addUserName = this.name;
          paramsData.shouMoId = self.pkGuid;
          this.postRequest("/shou/mo/create/mouldinfo", paramsData).then(resp => {
            if (resp && resp.status == 200 && resp.data.code == 0) {
              self.$message.success("添加成功");
              self.resetForm('form');
              self.imageUrls = [];
              self.nowTab = 3;
              this.toGetColletPartInfo();
              //toGetColletPartInfo()
              //self.getCollectMouldList();
              // self.dialogFormVisible = true;
              // self.mould_id = data.data.pkGuid;
              // self.partsInfos=[];
              // self.toGetColletPartInfo(self.doc_collect_id);
            } else {
              self.$message.error('添加失败');
            }
          })
        } else {
          return false;
        }
      });
    },
    imageuploaded(data) {
      let self = this;
      if (data.url.length !== 'undefined' && data.url.length > 0) {
        let url = data.url
        let urls = self.imageUrls;
        for (var i = 0; i < url.length; i++) {
          urls.push(url[i]);
        }
        self.imageUrls = urls;
      }
    },
    // 上传图片失败
    handleError() {
      this.$notify.error({
        title: '上传失败',
        message: '图片上传出现异常'
      });
    },
    todelImage(url) {
      let self = this
      if (url == 'undefined' || url.length == "") {
        self.$message.error("删除图片不存在");
        return
      }
      this.getRequest("/config/delfile/delImage?url=" + url).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.$message.success("删除成功");
          let urls = self.imageUrls;
          let newUrls = [];
          for (var i = 0; i < urls.length; i++) {
            if (url != urls[i]) {
              newUrls.push(urls[i])
            }
          }
          self.imageUrls = newUrls;
        } else {
          self.$message.error("删除照片失败");
        }
      })

    },
    delMouldImage(url) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.todelImage(url);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    goBack() {
      this.nowTab = 1;
      this.toAddDisable = false;
      this.update_disablse = false;
      this.tiem_disablse = false;
    },
    toAddMouldRecord() {
      this.nowTab = 2;
      this.toAddDisable = !this.toAddDisable;
      this.tiem_disablse = false;
      this.ruleForm = {
        createTime: '',
        addUserName: '',
        addUserId: '',
        woodenCaseNum: '0',
        palletNum: '0',
        diaoHuanNum: '0',
        clientCompanyName: '',
        freightType: '',
        carNum: '',
        jianBao: false,
        driverPhone: ''
      };
      this.batch = "";
    },
    chaKan(item) {
      let self = this;
      self.nowTab = 2;
      // let time = timeFilter.formatTime(item.createTime);
      // let updatetime = timeFilter.formatTime(item.updateTime);
      // item.createTime = time;
      // item.updateTime = updatetime;
      self.tiem_disablse = true;
      self.update_disablse = true;
      self.ruleForm = item;
      self.batch = item.batch;
    },
    // 修改基础信息
    updateCollectionInfo(formName) {
      let self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (self.ruleForm.id == "undefined" || self.ruleForm.id + '' == "") {
            self.$message.error("修改失败");
            return;
          }
          this.putRequest("/shou/mo/update/baseinfo", self.ruleForm).then(resp => {
            if (resp && resp.status == 200 && resp.data.code == 0) {
              self.$message.success("修改成功");
              self.goBack();
              self.getCollectMouldList();
            } else {
              self.$message.error('修改失败');
            }
          })
        } else {
          return false;
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      if (formName == 'ruleForm') {
        this.ruleForm.createTime = "";
        this.batch = "";
      }
    },
    // 添加收模单
    submitForm(formName) {
      let self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          self.ruleForm.addUserId = this.uid;
          self.ruleForm.addUserName = this.name;
          self.ruleForm.batch = this.batch
          this.postRequest("/shou/mo/add/baseinfo", self.ruleForm).then(resp => {
            if (resp && resp.status == 200 && resp.data.code == 0) {
              var id = resp.data.data.id;
              if (id == -1) {
                _this.$message.error("添加失败");
              } else {
                // 绑定用户角色
                self.doc_collect_id = id;
                self.nowTab = 1;
                this.resetForm('ruleForm')
                this.tableLoading = true;
                self.$message.success("添加成功");
                self.getCollectMouldList();
                //this.toAddMould();
              }
            }
          })
        } else {
          self.$message.error("请检查填写格式");
          return false;
        }
      });
    },
    toChange() {
      this.toInitBatch();
    },
    toInitBatch() {
      let self = this;
      let time = self.ruleForm.createTime;
      if (time == '' || time == 'undefined') {
        self.$message.error('请先设置收模时间');
        return;
      }
      this.getRequest("/shou/mo/max/batch?dateTime=" + time).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          let maxBatch = resp.data.data + 1;
          self.$nextTick(function() {
            this.batch = "第" + maxBatch + "批次";
          })
        } else {
          self.ruleForm.batch = '';
        }
      })
    },
    toChangeDisable() {
      this.nowTab = 4;
    },
    toUpdate() {
      this.update_disablse = true;
    },
    handleChange(value) {},

    handleSizeChange(val) {
      this.pagesize = val;
      this.getCollectMouldList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCollectMouldList();
    },
    // 获取收模列表
    getCollectMouldList() {
      let _this = this
      this.getRequest("/shou/mo/listbypage?page=" + this.currentPage + "&size=" + this.pagesize).then(resp => {
        this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          _this.tableData = resp.data.data.shoumolist
          _this.totalnum = resp.data.data.count
        }
      })
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.imageData.userId = localStorage.getItem('cp_uid');
      this.tableLoading = true;
      this.getCollectMouldList();
    })
    this.username = localStorage.getItem('cp_username');
    this.uid = localStorage.getItem('cp_uid');
    this.name = localStorage.getItem('cp_name');

  },
  created: function(){
    this.upload = JLApiUtils.upload;
  },
  computed: {
    data() {
      const self = this;
      return self.tableData.filter(function(d) {
        if (d.clientCompanyName.indexOf(self.select_word) > -1 ||
          d.addUserName.indexOf(self.select_word) > -1
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

.card-bottom {
  padding: 18px 20px;
  border-top: 1px solid #e6ebf5;
  box-sizing: border-box;
  text-align: right;
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
