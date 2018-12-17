<template>
<div>
  <div v-show="nowTab==1">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>质量管理</el-breadcrumb-item>
        <el-breadcrumb-item>加工中订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- <el-container> -->
      <div style="margin-top:30px;">
        <el-tabs type="card" v-model="activeName2">
          <el-tab-pane label="我负责的订单" name="first">
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center;margin-top:30px;">
              <div class="handle-box">
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" icon="search"></el-input>
              </div>
            </el-header>
              <div>
                <el-table :data="tableData" style="width: 100%">
                  <el-table-column prop="" label="产品名称">
                    <template slot-scope="scope">
                      <span>{{scope.row.order.orderName}}</span>
                </template>
                  </el-table-column>
                  <el-table-column prop="" label="工艺师">
                    <template slot-scope="scope">
                      <el-tag v-for="item in scope.row.orderUsers"  type="danger">{{item.userName}}</el-tag>
              </template>
                  </el-table-column>
                  <el-table-column prop="" label="项目经理">
                    <template slot-scope="scope">
                      <span>{{scope.row.order.addUserName}}</span>
                </template>
                  </el-table-column>
                  <el-table-column label="下单日期">
                    <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.order.createTime | formatDateTime}}</span>
                    <span style="margin-left: 10px">(工期[{{scope.row.order.createTime | formatDateTime3(scope.row.order.expectedTime)}}]天)</span>
                  </template>
                  </el-table-column>
                  <el-table-column label="完工预期">
                    <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span style="margin-left: 10px">{{ scope.row.order.expectedTime | formatDateTime}}</span>
                  <span style="margin-left: 10px">(剩余[{{scope.row.order.expectedTime | formatDateTime2}}]天)</span>
                </template>
                  </el-table-column>
                  <el-table-column label="当前步骤">
                    <template slot-scope="scope">
                <span>{{ scope.row.order.presentStepName}}</span>
              </template>
            </el-table-column>
                  <el-table-column prop="presentSchedule" label="订单进度">
                    <template slot-scope="scope">
                <el-tag  type="info">{{scope.row.order.presentSchedule}}%</el-tag>
              </template>
                  </el-table-column>
                  <el-table-column prop="hasRemark" label="备忘">
                    <template slot-scope="scope">
                      <el-tag v-if="!scope.row.order.hasRemark" type="primary">无</el-tag>
                      <el-tag v-if="scope.row.order.hasRemark" type="danger">有</el-tag>
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
                  <el-table-column label="操作"   width="250" >
                    <template slot-scope="scope">
                    <el-button v-if="scope.row.order.liuChengStatus+'' == '1'"
                      size="mini"
                      type="danger"
                      @click="toShenHe(scope.row)">审 核</el-button>
                      <el-button v-if="scope.row.order.jingFengStatus+'' == '0'"
                        size="mini"
                        type="warning"
                        @click="toJingFeng(scope.row)">精 封</el-button>
                      <el-button
                        size="mini"
                        type="primary"
                        @click="toinfo(scope.row)">详 情</el-button>
                  </template>
                  </el-table-column>
                </el-table>
              </div>
            <div class="block" style="float:right;margin-top:15px;">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 30, 80, 100]" :page-size="pagesize" layout="total,sizes, prev, pager, next, jumper" :total="totalnum">
              </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="全部订单" name="second">
            <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center;margin-top:30px;">
              <div class="handle-box">
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" icon="search"></el-input>
              </div>
            </el-header>
              <div>
                <el-table :data="tableData1" style="width: 100%">
                  <el-table-column prop="" label="产品名称">
                    <template slot-scope="scope">
                      <span>{{scope.row.order.orderName}}</span>
                </template>
                  </el-table-column>
                  <el-table-column prop="" label="工艺师">
                    <template slot-scope="scope">
                      <el-tag v-for="item in scope.row.orderUsers"  type="danger">{{item.userName}}</el-tag>
              </template>
                  </el-table-column>
                  <el-table-column prop="" label="项目经理">
                    <template slot-scope="scope">
                      <span>{{scope.row.order.addUserName}}</span>
                </template>
                  </el-table-column>
                  <el-table-column label="下单日期">
                    <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.order.createTime | formatDateTime}}</span>
                    <span style="margin-left: 10px">(工期[{{scope.row.order.createTime | formatDateTime3(scope.row.order.expectedTime)}}]天)</span>
                  </template>
                  </el-table-column>
                  <el-table-column label="完工预期">
                    <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span style="margin-left: 10px">{{ scope.row.order.expectedTime | formatDateTime}}</span>
                  <span style="margin-left: 10px">(剩余[{{scope.row.order.expectedTime | formatDateTime2}}]天)</span>
                </template>
                  </el-table-column>
                  <el-table-column label="当前步骤">
                    <template slot-scope="scope">
                <span>{{ scope.row.order.presentStepName}}</span>
              </template>
            </el-table-column>
                  <el-table-column prop="presentSchedule" label="订单进度">
                    <template slot-scope="scope">
                <el-tag  type="info">{{scope.row.order.presentSchedule}}%</el-tag>
              </template>
                  </el-table-column>
                  <el-table-column prop="" label="负责人">
                    <template slot-scope="scope">
                      <span>{{scope.row.userName}}</span>
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
                  <el-table-column label="操作" width="250">
                    <template slot-scope="scope">
                    <el-button v-if="scope.row.order.liuChengStatus+'' == '1' &&
                       scope.row.haveAuth+'' == 'true'"
                      size="mini"
                      type="danger"
                      @click="toShenHe(scope.row)">审 核</el-button>
                      <el-button v-if="scope.row.order.jingFengStatus+'' == '0'"
                        size="mini"
                        type="warning"
                        @click="toJingFeng(scope.row)">精 封</el-button>
                      <el-button
                        size="mini"
                        type="primary"
                        @click="">详 情</el-button>
                  </template>
                  </el-table-column>
                </el-table>
              </div>
            <div class="block" style="float:right;margin-top:15px;">
              <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="currentPage1" :page-sizes="[10, 30, 80, 100]" :page-size="pagesize1" layout="total,sizes, prev, pager, next, jumper" :total="totalnum1">
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    <!-- </el-container> -->
  </div>
  <!-- 审核步骤 -->
  <el-dialog title="步骤审核" :visible.sync="dialogFormVisible" width='40%'>
    <div class="form-box">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item prop="presentStepName" label="当前步骤：">
          <el-input :disabled="true" v-model="form.presentStepName">44</el-input>
        </el-form-item>
        <el-form-item label="审核备注：">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
        <el-form-item label="上传文件：" >
          <div v-show="wen_jian_url !== ''">
            <p style="color: blue;">上传成功</p>
          </div>
          <div v-show="wen_jian_url === ''">
              <vue-core-image-upload :class="['el-button', 'el-button--primary']"
              :crop="false"
               inputOfFile="imageFile"
               :url="upload"
              extensions="png,ppt,doc,txt,jpg,xsl"
              :max-file-size="5242880"
              :data="wenjianData" text="上传文件"
              :multiple="true"
              :multiple-size="30"
              credentials="true"
              @imageuploaded="imageupwenjian" @errorhandle="handleError">
              </vue-core-image-upload>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="shenhe">通 过</el-button>
      <el-button type="danger" @click="">驳 回</el-button>
    </div>
  </el-dialog>
  <el-dialog title="精封结算" :visible.sync="dialogTableVisible1">
    <el-table :data="orderUsers">
      <el-table-column property="orderName" label="订单名称"></el-table-column>
      <el-table-column property="biLi" label="贴花分配比例">
        <template slot-scope="scope">
        <span>{{scope.row.biLi}}%</span>
        </template>
      </el-table-column>
      <el-table-column property="userName" label="工艺师"></el-table-column>
      <el-table-column property="zongJiArea" label="分配贴花面积"></el-table-column>
      <el-table-column property="wanChengArea" label="已完成面积"></el-table-column>
      <el-table-column property="shengYuArea" label="未完成面积"></el-table-column>
      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          @click="toJieSuan(scope.row)">结 算</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <div style="border-top-style:dotted; border-bottom-style:dotted; margin-top: 40px;">
      <p> 结算精封面积：</p>
      <el-form :model="form1"  label-width="30%" style="">
        <!-- <el-form-item label="选择工艺师:">
          <el-select v-model="itemYga" placeholder="请选工艺师">
            <el-option v-for="item in restaurants4" :key="item.value" :label="item.label" :value="item"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="选择工艺师：" prop="qualityUsers">
          <el-select v-model="zhiliang" multiple placeholder="选择工艺师：" style="width:50%;">
            <el-option v-for="ar in restaurants4" :key="ar.value" :label="ar.label" :value="ar">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="精封总面积比例:">
          <el-input-number v-model="form1.biLi" controls-position="right" :min="0" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button style="float:right" type="primary" @click="selectYga">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="Ygas" border style="width: 100%;margin-top:20px;" v-if="Ygas.length > 0">
      <el-table-column prop="orderNeedArea" label="产品总面积">
      </el-table-column>
      <el-table-column prop="userName" label="姓名">
      </el-table-column>
      <el-table-column prop="biLi" label="精封面积比例">
        <template slot-scope="scope">
          <el-tag type="danger">{{scope.row.biLi}}%</el-tag>
     </template>
      </el-table-column>
      <!-- <el-table-column prop="allTieHuaArea" label="贴花总面积">
      </el-table-column> -->
      <el-table-column prop="jingFengArea" label="精封面积">
      </el-table-column>
      <!-- <el-table-column prop="oneceTieHuaArea" label="每步贴花面积">
      </el-table-column> -->
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
  <!-- <el-button type="text" size="small" @click.native.prevent="toEidtor(scope.$index, productData)">编辑</el-button> -->
  <el-button @click.native.prevent="deleteRow(scope.$index, Ygas)" type="text" size="small">移除
  </el-button>
  </template>
    </el-table-column>
  </el-table>
  <div slot="footer" class="dialog-footer">
    <el-button type="warning" style="float:left" @click="toMoRen">结算默认</el-button>
    <el-button type="primary" @click="toJieSuan">自定义结算</el-button>
    <el-button @click="quxiao">取 消</el-button>
  </div>
  </el-dialog>
  <!-- <div v-show="nowTab==2">
    <OrderInfoComm :orderInfo="orderInfoId" v-on:listenToChild="showChild"></OrderInfoComm>
  </div> -->
</div>
</template>
<script>
import VueCoreImageUpload from 'vue-core-image-upload';
import JLApiUtils from '../../utils/JLApiUtils.js';
// import OrderInfoComm from '../comm/OrderInfoComm.vue';
export default {
  components: {
    VueCoreImageUpload,
  },
  data() {
    return {
      orderInfoId:'',
      nowTab:1,
      activeName2: 'first',
      zhiliang:[],
      restaurants4:[],
      itemYga:{},
      // selectYga:[],
      form1:{},
      Ygas:[],
      orderUsers:{},
      dialogTableVisible1:false,
      stepId:'',
      wen_jian_url:'',
      upload:'',
      wenjianData: {
          userId: '',
          imgPakage: 'yu_bao_jia'
      },
      form1:{
        biLi: 5
      },
      username: '',
      name: '',
      uid: '',
      itemOrderId:'',
      dialogFormVisible: false,
      select_word: '',
      form: {
        presentStepName:''
      },
      flowStepId:'',
      currentPage: 1,
      totalnum: 0,
      pagesize: 10,
      select_word: '',
      tableData: [],
      currentPage1: 1,
      totalnum1: 0,
      pagesize1: 10,
      select_word1: '',
      tableData1: []
    }
  },
  methods: {
    showChild(data){
      this.nowTab = 1;
    },

    toinfo(data) {
      // console.log(data.orderId);
      this.$router.push('/plant/order/info/' + data.orderId)
      // this.orderInfoId = id;
      // alert(id);
      // this.nowTab = 2;
    },
    toMoRen(){
      let self = this;
      let params = {
        orderId: this.itemTiaoZhen.order.id,
        orderName: this.itemTiaoZhen.order.orderName,
        addUserId: this.uid,
        addUserName: this.name,
      }
      this.postRequest("/quality/moren/jingfeng", params).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.$message.success("精封结算成功");
          this.getCollectMouldList();
          this.quxiao();
        } else {
          self.$message.error("精封结算失败");
        }
      });
    },
    toJieSuan(){
      let self = this;
      if(this.Ygas.length <=0){
        self.$message.error("请至少分配一名工艺师")
        return
      }
      let allBiLi = 0
      for (var i = 0; i < this.Ygas.length; i++) {
        allBiLi = allBiLi + this.Ygas[i].biLi;
      }
      if(allBiLi !== 10){
        self.$message.error("精封面积总分配不为10%")
        return
      }

      let params = {
        orderId: this.itemTiaoZhen.order.id,
        orderName: this.itemTiaoZhen.order.orderName,
        addUserId: this.uid,
        addUserName: this.name,
        ygas: this.Ygas,
      }
      this.jsonPostRequest("/quality/jie/jingfeng", params).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.$message.success("精封结算成功")
          this.quxiao();
          // this.$router.push('/plant/new/order')
        } else {
          self.$message.error("精封结算失败")
        }
      });
    },
    quxiao(){
      this.Ygas = [];
      this.zhiliang = [];
      this.dialogTableVisible1 = false;
    },
    deleteRow(index, rows) {
       rows.splice(index, 1);
     },
    selectYga() {
      let users = this.zhiliang;
      let item = this.itemYga;
      let itemYags = this.Ygas;
      let workArea = this.itemTiaoZhen.order.workArea
      let biLi = this.form1.biLi

      if(users.length <= 0){
        this.$message.error("请选择有效工艺师")
        return
      }
      let allBiLi = 0;
      allBiLi = biLi * users.length
      if(itemYags.length > 0){
        for (var i = 0; i < itemYags.length; i++) {
          allBiLi = allBiLi + itemYags[i].biLi
        }
      }
      if(allBiLi > 10){
        this.$message.error("面积分配比例超限")
        return;
      }
      if(itemYags.length > 0){
        for (var i = 0; i < itemYags.length; i++) {
          let itemYag = itemYags[i];
          let flag = false
          for (var j = 0; j < users.length; j++) {
            if(users[j].value === itemYag.userId){
              flag = true;
              break;
            }
          }
          if(flag){
            this.$message.error("员工已被添加")
            return;
          }
        }
        for (var k = 0; k < users.length; k++) {
          let yga = {
            userId:'',
            userName:'',
            biLi:'',
            jingFengArea:'',
            orderNeedArea:'',
            jingFengBiLi:''
          }
          yga.userId = users[k].value;
          yga.userName = users[k].label;
          yga.biLi = biLi;
          yga.jingFengArea = workArea * biLi / 100
          yga.orderNeedArea = workArea
          yga.jingFengBiLi = biLi
          this.Ygas.push(yga);
        }
      }else {
        for (var k = 0; k < users.length; k++) {
          let yga = {
            userId:'',
            userName:'',
            biLi:'',
            jingFengArea:'',
            orderNeedArea:'',
            jingFengBiLi:''
          }
          yga.userId = users[k].value;
          yga.userName = users[k].label;
          yga.biLi = biLi;
          yga.jingFengArea = workArea * biLi / 100
          yga.orderNeedArea = workArea
          yga.jingFengBiLi = biLi
          this.Ygas.push(yga);
        }
      }
      this.$message.success("添加成功")
      this.itemYga = {};
      this.form = {};
      this.zhiliang = [];
    },
    toJingFeng(item) {
      this.Ygas = [];
      this.zhiliang = [];
      this.itemTiaoZhen = item;
      let id = item.order.id;
      this.getRequest("/plant/users?status=0&orderId=" + id).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.orderUsers = resp.data.data.orderusers;
          this.dialogTableVisible1 = true;
          this.loadAllYuanGongA();
        }
      })
    },
    imageupwenjian(data) {
      this.$message.success("上传成功");
      let urls = [];
      urls = data.url;
      if(urls != 'undefinded' && urls.length > 0 ){
        this.wen_jian_url = urls[0];
      }
    },
    handleError() {
      this.$notify.error({
        title: '上传失败',
        message: '图片上传出现异常'
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
    handleSizeChange1(val) {
      this.pagesize1 = val;
      this.getAllCollectMouldList();
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
      this.getAllCollectMouldList();
    },
    toShenHe(item){
      let self = this
      self.dialogFormVisible = true;
      self.form.presentStepName = item.order.presentStepName;
      self.form.remark = "";
      self.stepId = item.order.presentStepId;
      self.itemOrderId = item.order.id
    },
    shenhe(){
      if('undefined' == this.stepId || this.stepId == ''){
        this.$message.error("当前步骤信息有误")
        return
      }
      let params = {
        presentStepId: this.stepId ,
        orderId:this.itemOrderId,
        remark:this.form.remark,
        fuJianUrl:this.wen_jian_url,
        userId:this.uid,
        userName:this.name,
        auditResult:0
      }
      this.postRequest("/quality/audit", params).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.dialogFormVisible = false;
          this.getCollectMouldList();
          this.getAllCollectMouldList();
          this.$message.success("审核成功")
        } else {
          this.$message.error("审核失败")
        }
      })
    },
    loadAllYuanGongA() {
      let self = this
      this.getRequest("/config/mangers?role=ROLE_yga").then(resp => {
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
    // 获取已添加记录
    getCollectMouldList() {
      let _this = this
      this.getRequest("/quality/process/listbypage?page=" + this.currentPage + "&size=" + this.pagesize + "&userId=" + this.uid + "&status=0").then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.tableData = resp.data.data.qualityorderlist
          this.totalnum = resp.data.data.count;
        }
      })
    },
    getAllCollectMouldList() {
      let _this = this
      this.getRequest("/quality/process/all/listbypage?page=" + this.currentPage1 + "&size=" + this.pagesize1 + "&userId="+this.uid + "&status=0").then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.tableData1 = resp.data.data.qualityorderlist
          this.totalnum1 = resp.data.data.count;
        }
      })
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableLoading = true;
      this.getCollectMouldList();
      this.getAllCollectMouldList();
      this.upload = JLApiUtils.upload;
    })
    this.username = localStorage.getItem('cp_username');
    this.uid = localStorage.getItem('cp_uid');
    this.name = localStorage.getItem('cp_name');
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
