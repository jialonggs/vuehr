<template>
<div>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>创建订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-header style="align-items: center;margin-top:40px;">
        <el-steps :active="nowTab">
          <el-step title="基本信息" icon="el-icon-edit"></el-step>
          <el-step title="选择模具" icon="el-icon-picture"></el-step>
          <el-step title="下控制单" icon="el-icon-document"></el-step>
        </el-steps>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <!-- 添加订单基础信息 -->
        <div v-show="nowTab === 2" v-loading="base_loading">
          <el-card style="margin-top:30px;">
            <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
              <div>
                <el-row :gutter="20">
                  <el-col :span="10">
                    <el-form-item label="订单名称：" prop="orderName">
                      <el-input placeholder="请输入订单名称" style="width:217px;" v-model="ruleForm.orderName"></el-input>
                    </el-form-item>
                    <el-form-item label="所属项目：" prop="projectId">
                      <el-select v-model='ruleForm.projectId'  filterable placeholder="请选择所属项目">
                        <el-option v-for="item in restaurants3" :key="item.value" :label="item.label"  :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="车间负责人：" prop="managerId">
                      <el-select v-model='ruleForm.managerId' placeholder="请选择所属项目">
                        <el-option v-for="item in restaurants4" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="加工预期：" prop="expectedTime">
                      <el-date-picker style="width:40%" format="yyyy 年 MM 月 dd 日 HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="ruleForm.expectedTime" type="datetime" placeholder="选择日期时间">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="上传图片：">
                      <div>
                        <vue-core-image-upload :crop="false" inputOfFile="imageFile" :url="upload" extensions="png,gif,jpeg,jpg" :class="['el-button', 'el-button--primary']" :max-file-size="5242880" :data="imageData" text="上传图片" :multiple="true" :multiple-size="30" credentials="true"
                          @imageuploaded="imageuploaded" @errorhandle="handleError">
                        </vue-core-image-upload>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <div style="width:100%;height:1px;"></div>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="紧急程度：" prop="urgency">
                      <el-select v-model='ruleForm.urgency' placeholder="请选择紧急程度">
                        <el-option label="特急" value='8'></el-option>
                        <el-option label="紧急A" value='7'></el-option>
                        <el-option label="紧急B" value='6'></el-option>
                        <el-option label="紧急C" value='5'></el-option>
                        <el-option label="急A" value='4'></el-option>
                        <el-option label="急B" value='3'></el-option>
                        <el-option label="急C" value='2'></el-option>
                        <el-option label="正常" value='1'></el-option>
                        <el-option label="不急" value='0'></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="加工类型：" prop="machiningType">
                      <el-autocomplete class="inline-input" v-model="ruleForm.machiningType" :fetch-suggestions="querySearch" placeholder="请输入加工类型" @select="handleSelect"></el-autocomplete>
                    </el-form-item>
                    <!-- <el-form-item label="加工面积：" prop="realityArea">
                      <el-input-number v-model="ruleForm.realityArea" controls-position="right" :min="0"></el-input-number>
                    </el-form-item> -->
                    <!-- <el-form-item label="倍数：" prop="beiShu">
                      <el-input-number v-model="ruleForm.beiShu" controls-position="right" :min="1"></el-input-number>
                    </el-form-item> -->
                    <!-- <el-form-item label="纹理代码：" prop="piWenDaiMa">
                      <el-input placeholder="请输入纹理代码" style="width:217px;" v-model="ruleForm.piWenDaiMa"></el-input>
                    </el-form-item> -->
                    <el-form-item label="是否有备忘：" prop="hasRemark">
                      <el-switch v-model="ruleForm.hasRemark" active-text="有" inactive-text="无"></el-switch>
                    </el-form-item>
                    <el-form-item label="备注：" style="width:80%" prop="remark">
                      <el-input type="textarea" v-model="ruleForm.remark"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-form>
            <div style="margin-bottom:15px;">
              <el-card class="box-card" style="margin-top:25px;" v-loading="table_loading">
                <div slot="header" class="clearfix">
                  <span>纹理列表</span>
                  <!-- <div class="card-bottom" > -->
                    <el-button type="primary" style="float:right"class="el-icon-plus" @click="toAddWenLi">添加</el-button>
                  <!-- </div> -->
                </div>
                <div>
                  <el-table :data="wenliData" border show-summary style="width: 100%">
                    <el-table-column prop="wenliName" label="纹理代码">
                    </el-table-column>
                    <el-table-column prop="times" label="倍数">
                    </el-table-column>
                    <el-table-column prop="area" label="面积">
                    </el-table-column>

                    <el-table-column fixed="right" label="操作" width="300">
                      <template slot-scope="scope">
           <!-- <el-button type="text" size="small" @click.native.prevent="toEidtor(scope.$index, productData)">编辑</el-button> -->
           <el-button
             @click.native.prevent="deleteRow(scope.$index, wenliData)"
             type="text"
             size="small">
             移除
           </el-button>
         </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-card>
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
              <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
            </div>
          </el-card>
          <div>
            <el-dialog width="60%" title="纹理详情" :visible.sync="innerVisible" :close-on-click-modal="false" append-to-body>
              <el-form ref="elform1" :model="elform1" :rules="rules" label-width="120px" style="width:100%;">
                <el-form-item label="纹理名称：" prop="wenliName">
                  <el-input v-model="elform1.wenliName" style="width:30%;" placeholder="请输入纹理代码"></el-input>
                </el-form-item>
                <el-form-item label="倍数：" prop="times">
                  <el-input v-model="elform1.times"  style="width:30%;" controls-position="right" ></el-input>
                </el-form-item>
                <el-form-item label="实际面积：" prop="area">
                  <el-input-number v-model="elform1.area" controls-position="right" :min="0"></el-input-number>
                </el-form-item>
                <span style="color:red">面积不能为0，请填写大于0的数字</span>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary"  @click="addWenLi()">确 定</el-button>
                <el-button type="primary" v-show="udapteBoolean" @click="toUpdateProduct">更 新</el-button>
                <el-button @click="chanel">取 消</el-button>
              </div>
            </el-dialog>
          </div>
        </div>
        <!-- 选择模具 -->
        <div v-show="nowTab === 1">
          <el-card class="box-card" style="margin-top:25px;">
            <div slot="header" class="clearfix">
              <span>选择模具</span>
            </div>
            <div>
              <el-row :gutter="30">
                <el-col :span='4' v-loading="tree_loading">
                  <el-input placeholder="输入关键字进行过滤" v-model="filterText">
                  </el-input>
                  <template>
                    <div style="height:600px;">
                      <el-scrollbar style="height:100%">
                          <div style="width:400px;" >
                            <el-tree class="filter-tree" @check-change="toChangeCheck" :data="data3" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree2" show-checkbox node-key="id" style="border-right: 1px solid #e6e6e6;min-height:260px;">
                            </el-tree>
                          </div>
                      </el-scrollbar>
                    </div>
                  </template>

                </el-col>
                <el-col :span='20'>
                  <div style="min-height:15px;width:100%;">
                    <el-row :gutter="30">
                      <el-col :span="6" v-for="part in select_part">
                        <el-card :body-style="{ padding: '0px' }" class="mould-card">
                          <img class="image" v-bind:src="part.collectPartinfoEntity.picurl[0]" style="height:260px;">
                          <div style="padding: 14px;">
                            <h4>{{part.collectPartinfoEntity.mouldName}}</h4>
                            <span>备注：{{part.collectPartinfoEntity.remark}}</span>
                            <div class="bottom clearfix">
                              <time class="time">{{part.collectPartinfoEntity.createTime}}</time>
                            </div>
                          </div>
                        </el-card>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="card-bottom" style="float: left;">
              <el-button type="primary" @click="nowTab = 1">上一步</el-button>
            </div>
            <div class="card-bottom">
              <el-button type="primary" @click="toControl">下一步</el-button>
            </div>
          </el-card>
        </div>
        <!-- 下控制单 -->
        <div v-show="nowTab===3" style="margin-top:40px;">
          <el-card class="box-card" v-loading="contr_loading">
            <div slot="header" class="clearfix">
              <span>控制单</span>
            </div>
            <div>
              <el-form :model="exform" ref="exform" label-width="180px" class="demo-ruleForm">
                <div>
                  <el-row :gutter="30">
                    <el-col :span="8">
                      <el-form-item label="气孔：">
                        <el-radio-group v-model="exform.qiKong">
                          <el-radio label="待定"></el-radio>
                          <el-radio label="无"></el-radio>
                          <el-radio label="补"></el-radio>
                          <el-radio label="不补"></el-radio>
                        </el-radio-group>
                        <!-- <el-select v-model="exform.qiKong" placeholder="请选择气孔">
                          <el-option label="无" value="无"></el-option>
                          <el-option label="补" value="补"></el-option>
                          <el-option label="不补" value="不补"></el-option>
                        </el-select> -->
                      </el-form-item>
                      <el-form-item label="缺口：">
                        <el-radio-group v-model="exform.queKou">
                          <el-radio label="待定"></el-radio>
                          <el-radio label="无"></el-radio>
                          <el-radio label="补"></el-radio>
                          <el-radio label="不补"></el-radio>
                        </el-radio-group>
                        <!-- <el-select v-model="exform.queKou" placeholder="请选择缺口">
                          <el-option label="无" value="无"></el-option>
                          <el-option label="补" value="补"></el-option>
                          <el-option label="不补" value="不补"></el-option>
                        </el-select> -->
                      </el-form-item>
                      <el-form-item label="裂缝：">
                        <el-radio-group v-model="exform.lieFeng">
                          <el-radio label="待定"></el-radio>
                          <el-radio label="无"></el-radio>
                          <el-radio label="补"></el-radio>
                          <el-radio label="不补"></el-radio>
                        </el-radio-group>
                        <!-- <el-select v-model="exform.lieFeng" placeholder="请选裂缝">
                          <el-option label="无" value="无"></el-option>
                          <el-option label="补" value="补"></el-option>
                          <el-option label="不补" value="不补"></el-option>
                        </el-select> -->
                      </el-form-item>
                      <el-form-item label="焊疤：">
                        <el-radio-group v-model="exform.hanBa">
                          <el-radio label="待定"></el-radio>
                          <el-radio label="无"></el-radio>
                          <el-radio label="优化"></el-radio>
                          <el-radio label="不处理"></el-radio>
                        </el-radio-group>
                        <!-- <el-select v-model="exform.hanBa" placeholder="请选择处理方式">
                          <el-option label="无" value="无"></el-option>
                          <el-option label="优化" value="优化"></el-option>
                          <el-option label="不处理" value="不处理"></el-option>
                        </el-select> -->
                      </el-form-item>
                      <el-form-item label="电火花：">
                        <el-radio-group v-model="exform.dianHuoHua">
                          <el-radio label="待定"></el-radio>
                          <el-radio label="无"></el-radio>
                          <el-radio label="抛光"></el-radio>
                          <el-radio label="不抛光"></el-radio>
                        </el-radio-group>
                        <!-- <el-select v-model="exform.dianHuoHua" placeholder="请选择处理方式">
                          <el-option label="无" value="无"></el-option>
                          <el-option label="抛光" value="抛光"></el-option>
                          <el-option label="不抛光" value="不抛光"></el-option>
                        </el-select> -->
                      </el-form-item>
                      <el-form-item label="油石丝：">
                        <el-radio-group v-model="exform.youShiSi">
                          <el-radio label="待定"></el-radio>
                          <el-radio label="无"></el-radio>
                          <el-radio label="抛光"></el-radio>
                          <el-radio label="不抛光"></el-radio>
                        </el-radio-group>
                        <!-- <el-select v-model="exform.youShiSi" placeholder="请选择处理方式">
                          <el-option label="无" value="无"></el-option>
                          <el-option label="抛光" value="抛光"></el-option>
                          <el-option label="不抛光" value="不抛光"></el-option>
                        </el-select> -->
                      </el-form-item>
                      <el-form-item label="不平：">
                        <el-radio-group v-model="exform.buPing">
                          <!-- <el-radio label="待定"></el-radio> -->
                          <el-radio label="无"></el-radio>
                          <el-radio label="处理"></el-radio>
                          <el-radio label="不处理"></el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="备注：">
                        <el-input type="textarea" v-model="exform.remark"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="材质偏析：">
                        <el-radio-group v-model="exform.pianXi">
                          <el-radio label="待定"></el-radio>
                          <el-radio label="无"></el-radio>
                          <el-radio label="有"></el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="区域：">
                        <!-- <el-switch v-model="exform.quyu" active-text="纹理件" inactive-text="区域件">
                                      </el-switch> -->
                        <el-autocomplete class="inline-input" v-model="exform.quYu" :fetch-suggestions="querySearch5" placeholder="请输入" @select="handleSelect"></el-autocomplete>
                      </el-form-item>
                      <el-form-item label="深度：">
                        <el-autocomplete class="inline-input" v-model="exform.shenDu" :fetch-suggestions="querySearch6" placeholder="请输入" @select="handleSelect"></el-autocomplete>
                      </el-form-item>
                      <el-form-item label="同光泽处理区域：">
                        <el-switch v-model="exform.tongGZ" active-text="有" inactive-text="无">
                        </el-switch>
                      </el-form-item>
                      <el-form-item label="最后试模件：">
                        <el-input-number v-model="exform.zuiHouShiMoJian" controls-position="right" :min="0"></el-input-number>
                      </el-form-item>
                      <el-form-item label="CKD件：">
                        <el-input-number v-model="exform.ckd" controls-position="right" :min="0"></el-input-number>
                      </el-form-item>
                      <el-form-item label="光件（非最后试模件）：">
                        <el-input-number v-model="exform.guangJian" controls-position="right" :min="0"></el-input-number>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="分型线光边：">
                        <el-input placeholder="请输入内容" v-model="exform.fenXingBian">
                          <template slot="append">mm</template>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="合模线光边：">
                        <el-input placeholder="请输入内容" v-model="exform.heMoBian">
                          <template slot="append">mm</template>
                        </el-input>
                      </el-form-item>
                      <el-form-item label="光泽：">
                        <el-autocomplete class="inline-input" v-model="exform.guangze" :fetch-suggestions="querySearch1" placeholder="请输入" ></el-autocomplete>
                      </el-form-item>
                      <el-form-item label="碰穿边：">
                        <el-autocomplete class="inline-input" v-model="exform.pengChuanBian" :fetch-suggestions="querySearch1" placeholder="请输入" @select="handleSelect"></el-autocomplete>
                      </el-form-item>
                      <el-form-item label="碰穿孔：">
                        <el-autocomplete class="inline-input" v-model="exform.pengChuanKong" :fetch-suggestions="querySearch2" placeholder="请输入" @select="handleSelect"></el-autocomplete>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
            </div>
            <div class="card-bottom" style="float: left;">
              <el-button type="primary" @click="nowTab = 2">上一步</el-button>
            </div>
            <div class="card-bottom">
              <el-button type="primary" @click="toCommit">提 交</el-button>
              <el-button @click="resetForm1('exform')">重 置</el-button>
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</div>
</template>
<script>
import VueCoreImageUpload from 'vue-core-image-upload';
import JLApiUtils from '../../utils/JLApiUtils.js';
export default {
  data() {
    return {
      page_size:0,
      page:1,
      table_loading:false,
      udapteBoolean:false,
      wenliData: [],
      elform1:{
        wenliName:'',
        area:'0',
        times:'1'
      },
      innerVisible: false,
      contr_loading: false,
      base_loading: false,
      exform: {
        addUserId: '',
        addUserName: '',
        orderId: '',
        qiKong: '待定',
        queKou: '待定',
        lieFeng: '待定',
        hanBa: '待定',
        dianHuoHua: '待定',
        youShiSi: '待定',
        pianXi: '待定',
        buPing: '待定',
        heMoBian: '0',
        fenXingBian: '0',
        tongGZ: false,
        zuiHouShiMoJian: '0',
        ckd: '0',
        guangJian: '0'
      },
      filterText: '',
      tree_loading: false,
      item_order_id: '2',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      select_part: [],
      upload: '',
      data3: [],
      nowTab: 1,
      username: '',
      name: '',
      uid: '',
      imageUrls: [],
      restaurants1: [],
      restaurants2: [],
      restaurants3: [],
      restaurants4: [],
      imageData: {
        userId: '',
        imgPakage: 'order_pm'
      },
      ruleForm: {
        managerName: '',
        orderName: '',
        addUserId: '',
        addUserName: '',
        projectId: '',
        hasRemark: false,
        picUrls: '',
        urgency: '1',
        remark: '',
        realityArea: '0',
        expectedTime: '',
        beiShu: '1',
        machiningType: ''
      },
      restaurants: [],
      rules: {
        orderName: [{
            required: true,
            message: '请输入订单名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 0 到 255 个字符',
            trigger: 'blur'
          }
        ],
        wenliName: [{
            required: true,
            message: '请输入订单名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 0 到 255 个字符',
            trigger: 'blur'
          }
        ],
        piWenDaiMa: [{
            required: true,
            message: '请输入订单名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 0 到 255 个字符',
            trigger: 'blur'
          }
        ],
        machiningType: [{
          required: true,
          message: '请选择工艺类型',
          trigger: 'blur'
        }],
        managerId: [{
          required: true,
          message: '请选择车间负责人',
          trigger: 'blur'
        }],
        realityArea: [{
          required: true,
          message: '请输入实际面积',
          trigger: 'blur'
        }],
        projectId: [{
          required: true,
          message: '请选择所属项目',
          trigger: 'blur'
        }],
        urgency: [{
          required: true,
          message: '请选择订单紧急成度',
          trigger: 'blur'
        }],
        beiShu: [{
          required: true,
          message: '请填写倍数',
          trigger: 'blur'
        }],
        expectedTime: [{
          required: true,
          message: '请选择加工预期',
          trigger: 'blur'
        }]

      }
    }
  },
  components: {
    VueCoreImageUpload
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
    methods: {
      handleCurrentChange(val) {
      this.page = val
      this.getMultiTemplate()
      },
      handleSizeChange(val){
      this.page_size = val
      this.getMultiTemplate()
      },
    deleteRow(index, rows) {
       rows.splice(index, 1);
     },
    toUpdateProduct(){
    },
    addWenLi() {
      let self = this;
      if(this.elform1.times =='undefined' || this.elform1.times <=0){
        this.$message.error("请正确填写面积倍数");
        return;
      }
      let wenli = {
        wenliName: this.elform1.wenliName,
        times: this.elform1.times,
        area: this.elform1.area,
        addUserId: this.uid,
        addUserName: this.name
      }
      self.wenliData.push(wenli);
      self.elform1 = {
          wenliName:'',
          area:'0',
          times:'1'
        },
      self.innerVisible = false;
    },
    chanel(){
      this.innerVisible = false;
      this.elform1 = {
        wenliName:'',
        area:'0',
        times:'1'
      }
    },
    toAddWenLi(){
      this.innerVisible = true;
    },
    toCommit() {
      // 第一步提交基础信息
      this.contr_loading = true;
      //this.toAddBaseInfo();
      this.toAddNew();
    },
    toAddNew() {
      let self = this;
      let url = "";
      let managerId = self.ruleForm.managerId;
      for (let i = 0; i < self.restaurants4.length; i++) {
        if (managerId === self.restaurants4[i].value) {
          self.ruleForm.managerName = self.restaurants4[i].label
        }
      }
      let paramsData = self.ruleForm;
      if (self.imageUrls.length != 0) {
        for (var i = 0; i < self.imageUrls.length; i++) {
          if (i == self.imageUrls.length - 1) {
            url = url + self.imageUrls[i]
          } else {
            url = self.imageUrls[i] + "|" + url
          }
        }
      }
      paramsData.picUrls = url
      paramsData.addUserId = this.uid;
      paramsData.addUserName = this.name;
      paramsData.wenlis = this.wenliData

      let area = 0;
      for (var i = 0; i < this.wenliData.length; i++) {
        area = area + this.wenliData[i].area * this.wenliData[i].times
      }
      paramsData.realityArea = area;

      self.exform.orderId = self.item_order_id
      self.exform.addUserId = self.uid;
      self.exform.addUserName = self.name;
      let moulds = this.toGetMouldIds();
      let orderParams = {
        order:paramsData,
        mouldIds: moulds,
        controlOrderFrom:self.exform,
        wenlis:this.wenliData
      }
      this.jsonPostRequest("/order/list/new/add", orderParams).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.$message.success('订单添加成功');
          self.resetForm('ruleForm');
          self.imageUrls = [];
          self.$store.state.stomp.send("/ws/nf", {}, '');
          //跳转路由
          this.$router.push('/order/list')
        } else {
          self.$message.error('订单添加失败');
        }
      })
    },
    toGetMouldIds() {
      let self = this
      let mouldIds = '';
      for (let i = 0; i < self.select_part.length; i++) {
        if (i == self.select_part.length - 1) {
          mouldIds = mouldIds + self.select_part[i].collectPartinfoEntity.id
        } else {
          mouldIds = mouldIds + self.select_part[i].collectPartinfoEntity.id + ','
        }
      }
      return mouldIds;
    },
    toControl() {
      let self = this
      if (self.select_part === "undefined" || !self.select_part.length > 0) {
        self.$message.info("请选择有效的模具")
        return
      }
      self.nowTab = 2;
    },
    addcontroInfo() {
      let self = this
      self.exform.orderId = self.item_order_id
      self.exform.addUserId = self.uid;
      self.exform.addUserName = self.name;
      this.postRequest("/order/list/add/control", self.exform).then(resp => {
        this.contr_loading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.$message.success('订单添加成功');
          self.$store.state.stomp.send("/ws/nf", {}, '');
          //跳转路由
          this.$router.push('/order/list')
        } else {
          self.$message.error(data.msg);
        }
      })
    },
    initSysMsgs() {
      var _this = this;
      this.getRequest("/chat/sysmsgs").then(resp => {
        _this.sysmsgs = resp.data;
        var isDot = false;
        _this.sysmsgs.forEach(msg => {
          if (msg.state == 0) {
            isDot = true;
          }
        })
        _this.$store.commit('toggleNFDot', isDot);
      })
    },
    splitUrl(item) {
      let picurl = item.picUrls;
      let urlArray = [];
      if (picurl != "undefined" && picurl != "") {
        urlArray = picurl.split('|');
      }
      return urlArray;
    },
    addSelected(item) {
      let self = this
      let sel = self.select_part
      if (sel.length === 0) {
        if (item.collectPartinfoEntity.picurl instanceof Array) {
          sel.push(item);
        } else {
          item.collectPartinfoEntity.picurl = self.splitUrl(item.collectPartinfoEntity)
          sel.push(item);
        }
      } else {
        let flag = true
        for (let i = 0; i < sel.length; i++) {
          if (sel[i].id === item.id) {
            flag = false;
            break;
          }
        }
        if (flag) {
          if (item.collectPartinfoEntity.picurl instanceof Array) {
            sel.push(item);
          } else {
            item.collectPartinfoEntity.picurl = self.splitUrl(item.collectPartinfoEntity)
            sel.push(item);
          }
        }
      }
    },
    delSelected(item) {
      let self = this
      let sel = self.select_part
      let newS = [];
      for (let i = 0; i < sel.length; i++) {
        if (sel[i].id === item.id) {
          continue;
        } else {
          newS.push(sel[i]);
        }
      }
      self.select_part = newS;
    },
    toChangeCheck(node, isChecked) {
      let disabled = node.disabled
      if (isChecked && !disabled) { // 选择
        if (node.collectPartinfoEntity !== "undefined") {
          this.addSelected(node);
        }
      } else if (!isChecked && !disabled) { // 取消选择
        if (node.collectPartinfoEntity !== "undefined") {
          this.delSelected(node);
        }
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    toChangeSet() {
      let self = this
      if (self.select_part === "undefined" || !self.select_part.length > 0) {
        self.$message.info("请选择有效的模具")
        return
      }
      let data = {
        partIds: [],
      }
      for (let i = 0; i < self.select_part.length; i++) {
        data.partIds.push(self.select_part[i].collectPartinfoEntity.id);
      }
      if (data.partIds === "undefined" || !data.partIds.length > 0) {
        self.$message.info("请选择有效的模具")
        return
      }
      let dataString = JSON.stringify(data)
      let params = {
        data: dataString,
        userId: '123',
        userToken: '',
        md5: '',
        source: ''
      }
      JLApiUtils.updateSetOrderMould(params).then(function(data) {
        if (data.code == '0') {
          self.$message.success('修改成功');
          self.getMouldTree();
          self.select_part = [];
          self.is_set = false;
        } else {
          self.$message.error(data.msg);
        }
      })
    },
    toSetMouldPart() {
      let self = this
      let data = {
        orderId: self.item_order_id,
        uid: this.uid,
        mouldIds: ''
      }
      let mouldIds = '';
      for (let i = 0; i < self.select_part.length; i++) {
        if (i == self.select_part.length - 1) {
          mouldIds = mouldIds + self.select_part[i].collectPartinfoEntity.id
        } else {
          mouldIds = mouldIds + self.select_part[i].collectPartinfoEntity.id + ','
        }
        // data.partIds.push(self.select_part[i].collectPartinfoEntity.pkGuid);
      }
      data.mouldIds = mouldIds
      this.postRequest("/order/list/set/mould", data).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          // 第三步创建控制单
          this.addcontroInfo();
        } else {
          self.$message.error("模具设置失败");
        }
      })
    },
    getMouldTree() {
      let self = this
      this.getRequest("/order/list/mould/tree").then(resp => {
        this.tree_loading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.data3 = resp.data.data.tree;
        }
      })
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 重置
    resetForm1(formName) {
      this.exform = {
        addUserId: '',
        addUserName: '',
        orderId: '',
        qiKong: '无',
        queKou: '无',
        lieFeng: '无',
        hanBa: '无',
        dianHuoHua: '无',
        youShiSi: '无',
        heMoBian: '0',
        fenXingBian: '0',
        tongGZ: false,
        zuiHouShiMoJian: '0',
        ckd: '0',
        guangJian: '0'
      }
    },
    // 添加项目基础信息
    submitForm(formName) {
      let self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.nowTab = 3;
        } else {
          self.$message.error('请检查输入信息的格式');
          return false;
        }
      });
    },
    toAddBaseInfo() {
      let self = this;
      let url = "";
      let managerId = self.ruleForm.managerId;
      for (let i = 0; i < self.restaurants4.length; i++) {
        if (managerId === self.restaurants4[i].value) {
          self.ruleForm.managerName = self.restaurants4[i].label
        }
      }
      let paramsData = self.ruleForm;
      if (self.imageUrls.length != 0) {
        for (var i = 0; i < self.imageUrls.length; i++) {
          if (i == self.imageUrls.length - 1) {
            url = url + self.imageUrls[i]
          } else {
            url = self.imageUrls[i] + "|" + url
          }
        }
      }
      paramsData.picUrls = url
      paramsData.addUserId = this.uid;
      paramsData.addUserName = this.name;
      this.postRequest("/order/list/add/order", paramsData).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.resetForm('ruleForm');
          self.imageUrls = [];
          let id = resp.data.data.id;
          self.item_order_id = id;
          if (id > 0) {
            //第二步添加模具信息
            this.toSetMouldPart();
          } else {
            self.$message.error('基础信息创建失败');
          }
        } else {
          self.$message.error('基础信息创建失败');
        }
      })
    },
    handleSelect(item) {
      console.log(item);
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    querySearch1(queryString, cb) {
      var restaurants = this.restaurants1;
      var results = queryString ? restaurants1.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    querySearch2(queryString, cb) {
      var restaurants = this.restaurants2;
      var results = queryString ? restaurants2.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    querySearch5(queryString, cb) {
      var restaurants = this.restaurants5;
      var results = queryString ? restaurants5.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    querySearch6(queryString, cb) {
      var restaurants = this.restaurants6;
      var results = queryString ? restaurants6.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
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
    loadAllProject() {
      let self = this
      this.getRequest("/project/list/byuid?uid=" + this.uid).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          let item = []
          let re = resp.data.data.projectlist;
          if (re != 'undefined' && re.length > 0) {
            for (var i = 0; i < re.length; i++) {
              let elem = {
                label: '',
                value: ''
              }
              elem.label = re[i].projectName
              elem.value = re[i].id
              item.push(elem);
            }
            self.restaurants3 = item;
          }
        } else {
          console.log("获取列表数据失败");
        }
      });
    },
    loadAllManger() {
      let self = this
      this.getRequest("/order/list/mangers?role=ROLE_chejian").then(resp => {
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
          console.log("获取车间负责人失败");
        }
      });
    },
    // 上传图片失败
    handleError() {
      this.$notify.error({
        title: '上传失败',
        message: '图片上传出现异常'
      });
    },
    loadAll5() {
      return [{
          "value": "区域件"
        },
        {
          "value": "纹理件"
        }
      ];
    },
    loadAll6() {
      return [{
          "value": "按样板"
        },
        {
          "value": "按皮纹件"
        },
        {
          "value": "按匹配件"
        }
      ];
    },
    loadAll() {
      return [{
          "value": "传统"
        },
        {
          "value": "电火花"
        },
        {
          "value": "喷砂"
        },
        {
          "value": "激光"
        },
        {
          "value": "其他"
        }
      ];
    },
    loadAll1() {
      return [{
          "value": "无"
        },
        {
          "value": "按客户划线多做"
        },
        {
          "value": "按客户划线少做"
        },
        {
          "value": "喷砂多做"
        },
        {
          "value": "喷砂少做"
        },
        {
          "value": "激光多做"
        },
        {
          "value": "激光少做"
        },
        {
          "value": "其他"
        }
      ];
    },
    loadAll2() {
      return [{
          "value": "无"
        },
        {
          "value": "按客户划线多做"
        },
        {
          "value": "按客户划线少做"
        },
        {
          "value": "喷砂多做"
        },
        {
          "value": "喷砂少做"
        },
        {
          "value": "激光多做"
        },
        {
          "value": "激光少做"
        },
        {
          "value": "其他"
        },
        {
          "value": "全做"
        }
      ];
    },
    // 获取订单列表
    getCollectMouldList() {
      let _this = this
      this.getRequest("/order/list/listbypage?page=" + this.currentPage + "&size=" + this.pagesize + "&addUserId=" + this.uid).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          _this.tableData = resp.data.data.orderlist
          _this.totalnum = resp.data.data.count
        }
      })
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.imageData.userId = localStorage.getItem('cp_uid');
      this.upload = JLApiUtils.upload;
    })
    this.restaurants = this.loadAll();
    this.restaurants1 = this.loadAll1();
    this.restaurants2 = this.loadAll2();
    this.restaurants5 = this.loadAll5();
    this.restaurants6 = this.loadAll6();
    this.username = localStorage.getItem('cp_username');
    this.uid = localStorage.getItem('cp_uid');
    this.name = localStorage.getItem('cp_name');
    this.restaurants = this.loadAll();
    this.loadAllProject();
    this.loadAllManger();
    this.tree_loading = true;
    this.getMouldTree();
    // this.restaurants1 = this.loadAll1();
    // this.restaurants2 = this.loadAll2();
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
