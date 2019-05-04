<template>
<div>
  <div>
    <div class="crumbs" >
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>售后记录</el-breadcrumb-item>
        <el-breadcrumb-item>售后过程记录</el-breadcrumb-item>
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
                <el-table-column prop="addUserName" label="确认情况">
                  <template slot-scope="scope">
                    <span v-if="scope.row.cheJianId+'' === ''">车间未确认</span>
                    <span v-if="scope.row.xingZhengId+'' === ''">行政未确认</span>
                    <span v-if="scope.row.cheJianId+'' !== ''">车间已确认</span>
                    <span v-if="scope.row.xingZhengId+'' !== ''">行政已确认</span>
                  </template>
                  </el-table-column>
              <el-table-column prop="userName" label="售后负责人">
              </el-table-column>
              <el-table-column prop="status" label="售后状态">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.status+'' === '2'" type="primary">待补充行政单</el-tag>
                  <el-tag v-if="scope.row.status+'' === '3'" type="primary">待审核行政单</el-tag>
                  <el-tag v-if="scope.row.status+'' === '4'" type="primary">进行中</el-tag>
                  <el-tag v-if="scope.row.status+'' === '5'" type="primary">完成</el-tag>
            </template>
              </el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope">
                <!-- <el-button v-if="scope.row.status+'' === '1'"
                  size="mini"
                  type="primary"
                  @click="toTiJiao(scope.row)">提交售后报告</el-button> -->
                  <el-button v-if="scope.row.status"
                    size="mini"
                    type="primary"
                    @click="toXingZeng(scope.row)">查看行政单</el-button>
                    <el-button v-if="scope.row.status"
                      size="mini"
                      type="primary"
                      @click="toShangWu(scope.row)">查看商务单</el-button>
                      <el-button v-if="scope.row.status"
                        size="mini"
                        type="primary"
                        @click="toQueRen(scope.row)">确认</el-button>
                        <el-button v-if="scope.row.status == 4"
                          size="mini"
                          type="warning"
                          @click="dayin(scope.row)">打印</el-button>
                        <el-button v-if="scope.row.status == 4"
                          size="mini"
                          type="danger"
                          @click="toWanJie(scope.row)">完结售后</el-button>
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
  <el-dialog title="售后报告" :visible.sync="dialogFormVisible" width='40%'>
      <div class="form-box">
          <el-form ref="form" :model="form" label-width="120px">
              <el-form-item label="备注：">
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
                    extensions="png,ppt,docx,txt,jpg,xlsx,pdf"
                    :max-file-size="5242880"
                    :data="wenjianData" text="上传文件"
                    :multiple="true"
                    :multiple-size="30"
                    credentials="true"
                    @imageuploaded="imageupwenjian" @errorhandle="handleError">
                    </vue-core-image-upload>
                </div>
              </el-form-item>
              <el-form-item label="上传图片：">
                <div>
                  <vue-core-image-upload :crop="false" inputOfFile="imageFile" :url="upload" extensions="png,gif,jpeg,jpg" :class="['el-button', 'el-button--primary']" :max-file-size="5242880" :data="imageData" text="上传图片" :multiple="true" :multiple-size="30" credentials="true"
                    @imageuploaded="imageuploaded" @errorhandle="handleError">
                  </vue-core-image-upload>
                </div>
              </el-form-item>
          </el-form>
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
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="tiJiao">提 交</el-button>
          <el-button  @click="quxiao">取 消</el-button>
      </div>
  </el-dialog>
  <el-dialog title="售后行政单" :visible.sync="dialogFormVisible2" width='80%' v-loading="tableLoading2">
    <div class="form-box">
      <div>
        <h3>总监信息</h3>
        <p>前往时间： {{itemShouHou.toTime}}</p>
        <p>预计时间：{{itemShouHou.days}}</p>
        <p>始派地点：{{itemShouHou.diDian}}</p>
        <p>备注：{{itemShouHou.ZJremark}}</p>
      </div>
      <div style="width:100%;height:1px;border-top:1px solid;margin-bottom:15px;"></div>
      <el-form ref="form" :model="xzOrder" label-width="120px" >
        <el-row :gutter="20">
       <el-col :span="12"><div class="grid-content bg-purple">
         <el-form-item label="客户单位："  prop="danWei">
           <el-input v-model="xzOrder.danWei" :disabled="true"></el-input>
         </el-form-item>
         <el-form-item label="单位地址：" prop="address">
           <el-input v-model="xzOrder.address" :disabled="true" ></el-input>
         </el-form-item>
         <el-form-item label="备注" prop="contactContent">
            <el-input v-model="xzOrder.contactContent" :disabled="true"></el-input>
         </el-form-item>
       </div></el-col>
       <el-col :span="12"><div class="grid-content bg-purple">
         <el-form-item label="预计周期：" prop="yuJi">
           <el-date-picker v-model="xzOrder.yuJi" :disabled="true" style="width:50%" format="yyyy 年 MM 月 dd 日 HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间">
           </el-date-picker>
            <!-- <el-input v-model="xzOrder.yuJi" ></el-input> -->
         </el-form-item>
         <el-form-item label="实施日期：" prop="startDate">
           <el-date-picker v-model="xzOrder.startDate" :disabled="true" style="width:50%" format="yyyy 年 MM 月 dd 日 HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间">
           </el-date-picker>
           <!-- <el-input v-model="xzOrder.startDate" ></el-input> -->
         </el-form-item>
         <el-form-item label="售后人员：" prop="userName">
            <el-input v-model="xzOrder.userName" :disabled="true"></el-input>
         </el-form-item>
       </div>
       </el-col>
        </el-row>
        <div style="width:100%;height:1px;border-top:1px solid;margin-bottom:15px;"></div>
        中途转程
        <el-row :gutter="20">
       <el-col :span="12"><div class="grid-content bg-purple">
         <el-form-item label="地 点：" prop="transferAddress" >
           <el-input v-model="xzOrder.transferAddress" :disabled="true"></el-input >
         </el-form-item>
         <el-form-item label="单 位：" prop="transferCompany">
            <el-input v-model="xzOrder.transferCompany" :disabled="true"></el-input>
         </el-form-item>
       </div></el-col>
       <el-col :span="12"><div class="grid-content bg-purple">
         <el-form-item label="问 题：" prop="transferProblem">
           <el-input v-model="xzOrder.transferProblem" :disabled="true"></el-input>
         </el-form-item>
         <el-form-item label="联系人：" prop="transferContact">
            <el-input v-model="xzOrder.transferContact" :disabled="true"></el-input>
         </el-form-item>
       </div>
       </el-col>
        </el-row>
        <div style="width:100%;height:1px;border-top:1px solid;margin-bottom:15px;"></div>
        <el-row>
          <el-col>
            <el-form-item label="售后工具：" prop="fuKuanType">
              <el-checkbox-group v-model="checkedGongJus" :disabled="true">
              <el-checkbox v-for="gj in gongjus" :label="gj" :key="gj">{{gj}}</el-checkbox>
            </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="售后材料：" prop="fuKuanType">
               <span>砂：</span>
               <el-checkbox-group v-model="checkedshas" :disabled="true">
               <el-checkbox v-for="sha in shas" :label="sha" :key="sha">{{sha}}</el-checkbox>
               </el-checkbox-group>
              <span>洗模用品：</span>
              <el-checkbox-group v-model="checkedyps" :disabled="true">
              <el-checkbox v-for="yp in yps" :label="yp" :key="yp">{{yp}}</el-checkbox>
              </el-checkbox-group>
              <span>其它材料：</span>
              <el-checkbox-group v-model="checkedcls" :disabled="true">
              <el-checkbox v-for="cl in cls" :label="cl" :key="cl">{{cl}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="后期补充：" prop="fuKuanType">
              <el-checkbox-group v-model="checkedhqs" :disabled="true">
              <el-checkbox v-for="hq in hqs" :label="hq" :key="hq">{{hq}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="后期补充详情：" prop="houQiRemark">
                <el-input v-model="xzOrder.houQiRemark" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="外派人员：" prop="waiPaiRenYuan">
                <el-input v-model="xzOrder.waiPaiRenYuan" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="交通方式：" prop="jiaoTong">
                <el-input v-model="xzOrder.jiaoTong" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="备注：" prop="remark">
                <el-input v-model="xzOrder.remark" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
  <el-dialog title="售后服务回执单" :visible.sync="dialogFormVisible1" width='60%'>
    <div class="form-box">
      <el-form ref="form" :model="shouHouOrder" label-width="120px" >
        <el-row :gutter="20">
       <el-col :span="12"><div class="grid-content bg-purple">
         <el-form-item label="客户单位：" prop="danwei">
           <el-input v-model="shouHouOrder.danwei" :disabled="true"></el-input>
         </el-form-item>
         <el-form-item label="前往地址：" prop="address">
           <el-input v-model="shouHouOrder.address" :disabled="true"></el-input>
         </el-form-item>
         <!-- <el-form-item label="售后人员：" prop="shouHouMan">
            <el-input v-model="shouHouOrder.shouHouMan" :disabled="true"></el-input>
         </el-form-item> -->
       </div></el-col>
       <el-col :span="12"><div class="grid-content bg-purple">
         <el-form-item label="联系人：" prop="contactUser">
            <el-input v-model="shouHouOrder.contactUser" :disabled="true"></el-input>
         </el-form-item>
         <el-form-item label="联系电话：" prop="contactPhone">
           <el-input v-model="shouHouOrder.contactPhone" :disabled="true"></el-input>
         </el-form-item>
         <!-- <el-form-item label="前往日期：" prop="toTime">
           <el-date-picker v-model="shouHouOrder.toTime" :disabled="true" style="width:50%" format="yyyy 年 MM 月 dd 日 HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间">
           </el-date-picker>
         </el-form-item> -->
       </div>
       </el-col>
        </el-row>
        <div style="width:100%;height:1px;border-top:1px solid;margin-bottom:15px;"></div>
        <el-form-item label="质量总监：" prop="zl">
           <el-input v-model="shouHouOrder.zl" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="出厂光泽：" prop="zl">
           <el-input v-model="shouHouOrder.gz" :disabled="true"></el-input>
        </el-form-item>
        按贵司来函要求服务事项如下
        <el-row>
       <el-col>
         <!-- <div class="grid-content bg-purple" style="margin-top:25px;">
             <el-form-item label="客户评价：" prop="customerAtti" >
                <el-radio-group v-model="shouHouOrder.customerAtti" :disabled="true">
                   <el-radio :label="0">满意</el-radio>
                   <el-radio :label="1">不满意</el-radio>
                 </el-radio-group>
               </el-form-item>
           </div> -->
          <div class="grid-content bg-purple" style="margin-top:25px;">
              <el-form-item label="修复内容：" prop="laoWuMingCheng" >
                <el-input type="textarea":disabled="true" autosize placeholder="请输入内容" v-model="shouHouOrder.fixContent" ></el-input >
                </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
       <el-col>
         <!-- <el-form-item label="上传图片：">
           <div>
             <vue-core-image-upload :crop="false" inputOfFile="imageFile" :url="upload" extensions="png,gif,jpeg,jpg" :class="['el-button', 'el-button--primary']" :max-file-size="5242880" :data="imageData" text="上传图片" :multiple="true" :multiple-size="30" credentials="true"
               @imageuploaded="imageuploaded" @errorhandle="handleError">
             </vue-core-image-upload>
           </div>
         </el-form-item> -->
       </el-col>
     </el-row>
     <div style="border: 1px dashed #d9d9d9;width:100%;min-height:358px;">
       <el-row :gutter="20" style="margin-top:10px;">
         <el-col :span="6" v-for="imageUrl in imageUrls ">
           <el-card :body-style="{ padding: '0px' }" class="mould-card">
             <img class="image" v-bind:src="imageUrl" style="height:320px;">
             <!-- <div style="text-align:center;">
               <el-button type="text" @click="delMouldImage(imageUrl)"><i class="el-icon-error" style="color:red;"></i></el-button>
             </div> -->
           </el-card>
         </el-col>
       </el-row>
     </div>
      </el-form>
    </div>
    <!-- <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addShouHouOrder()">提 交</el-button>
      <el-button  @click="dialogFormVisible = false">取 消</el-button>
    </div> -->
  </el-dialog>
  <el-dialog title="售后完结单" :visible.sync="dialogFormVisible3" width='60%'>
    <div class="form-box">
      <el-form ref="form" :model="wanJieForm" label-width="120px" >
        <el-form-item label="完结备注：" prop="zl">
            <el-input type="textarea" autosize placeholder="请输入内容" v-model="wanJieForm.wanJieRemark" ></el-input >
        </el-form-item>
        <el-row>
       <el-col>
         <el-form-item label="上传图片：">
           <div>
             <vue-core-image-upload :crop="false" inputOfFile="imageFile" :url="upload" extensions="png,gif,jpeg,jpg" :class="['el-button', 'el-button--primary']" :max-file-size="5242880" :data="imageData" text="上传图片" :multiple="true" :multiple-size="30" credentials="true"
               @imageuploaded="imageuploaded" @errorhandle="handleError">
             </vue-core-image-upload>
           </div>
         </el-form-item>
       </el-col>
     </el-row>
     <div style="border: 1px dashed #d9d9d9;width:100%;min-height:358px;">
       <el-row :gutter="20" style="margin-top:10px;">
         <el-col :span="6" v-for="wanJieImageUrl in wanJieImageUrls ">
           <el-card :body-style="{ padding: '0px' }" class="mould-card">
             <img class="image" v-bind:src="imageUrl" style="height:320px;">
             <div style="text-align:center;">
               <el-button type="text" @click="delMouldImage(wanJieImageUrl)"><i class="el-icon-error" style="color:red;"></i></el-button>
             </div>
           </el-card>
         </el-col>
       </el-row>
     </div>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addWanJie()">提 交</el-button>
      <el-button  @click="dialogFormVisible3 = false">取 消</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
import VueCoreImageUpload from 'vue-core-image-upload';
import JLApiUtils from '../../utils/JLApiUtils.js';
const gjOptions = ['光泽仪器','喷砂枪','软管','模具枪','防护眼镜','喷砂服','工作服','警示牌'];
const shaOptions = ['180目','100目','80目','珠','其他'];
const ypOptions = ['汽油','抹布','纸巾'];
const clOptions = ['棕胶带','油石','干粉','其他','费用'];
const hqOptions = ['费用','材料'];
export default {
  components: {
    VueCoreImageUpload
  },
  data() {
    return {
      wanJieForm:{
        wanJieRemark:""
      },
      tableLoading2:false,
      wanJieImageUrls:[],
      dialogFormVisible1:false,
      checkedGongJus:[],
        checkedshas:[],
        checkedyps:[],
        checkedhqs:[],
        checkedcls:[],
        gongjus:gjOptions,
        shas:shaOptions,
        yps:ypOptions,
        hqs:hqOptions,
        cls:clOptions,
      xzOrder:{
        orderId:'',
        shouHouId:''
      },
      dialogFormVisible2: false,
      imageData: {
        userId: '',
        imgPakage: 'yu_bao_jia'
      },
      imageUrls:[],
      upload:'',
      wenjianData: {
          userId: '',
          imgPakage: 'yu_bao_jia'
      },
      wen_jian_url:'',
      restaurants4:[],
      username: '',
      itemYga:[],
      name: '',
      uid: '',
      fenPei:'',
      dialogFormVisible: false,
      dialogFormVisible3: false,
      select_word: '',
      form: {
          remark: '',
      },
      currentPage: 1,
      totalnum: 0,
      pagesize: 10,
      select_word: '',
      tableData: [],
      itemData:'',
      itemShouHou:'',
      shouHouOrder:{},
      itemWanJie:{},
    }
  },
  methods: {
    toWanJie(item){
        this.imageUrl = [];
        this.dialogFormVisible3 = true;
        this.itemWanJie = item;
    },
    dayin(item) {
      let id = item.id;
      this.$router.push('/print/shouhou/' + id)
    },
    addWanJie(){
      let url = "";
      for (var i = 0; i < this.wanJieImageUrls.length; i++) {
        if (i == this.wanJieImageUrls.length - 1) {
          url = url + this.wanJieImageUrls[i]
        } else {
          url = this.wanJieImageUrls[i] + "|" + url
        }
      }
      if(url.length <=0){
        this.$message.error("请上传售后结果图片");
        return;
      }
      let data = {
        wanJieUrls:url,
        wanJieRemark:this.wanJieForm.wanJieRemark,
        id:this.itemWanJie.id
      }
      this.postRequest("/after/sale/job/wanjie", data).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.$message.success("提交成功");
          this.dialogFormVisible3 = false;
          this.getCollectMouldList();
        } else {
          this.$message.error("提交失败");
        }
      })
    },
    toQueRen(item){
      this.getRequest("/after/sale/course/checked?uid="+this.uid + "&orderId=" + item.orderId).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.$message.success("确认成功");
          this.getCollectMouldList();
        } else {
          self.$message.error("确认失败");
        }
      })
    },
    toShangWu(item){
      this.imageUrls = [];
      this.dialogFormVisible1 = true;
      this.shouHouOrder = item.shBaoGao;
      this.shouHouOrder = item.shBaoGao;
      this.shouHouOrder.danwei = item.danwei;
      this.shouHouOrder.address = item.address;
      let picurl = item.shBaoGao.picUrls
        if (picurl != "undefined" && picurl != "") {
          let urlArray = picurl.split('|');
          this.imageUrls = urlArray;
        }
    },
    toXingZeng(data){
      if(data.shXzOrder.gongJu.length > 0){
        this.checkedGongJus = data.shXzOrder.gongJu.split(',');
      }
      if(data.shXzOrder.caiLiaoSha.length > 0){
        this.checkedshas = data.shXzOrder.caiLiaoSha.split(',');
      }
      if(data.shXzOrder.caiLiaoYongPin.length > 0){
        this.checkedyps = data.shXzOrder.caiLiaoYongPin.split(',');
      }
      if(data.shXzOrder.caiLiao.length > 0){
        this.checkedcls = data.shXzOrder.caiLiao.split(',');
      }
      if(data.shXzOrder.houQi.length > 0){
        this.checkedhqs = data.shXzOrder.houQi.split(',');
      }
      this.dialogFormVisible2 = true;
      this.xzOrder = data.shXzOrder;
      this.xzOrder.danWei = data.danwei;
      this.xzOrder.address= data.address;
      this.xzOrder.userName= data.userName;
      this.itemShouHou = data;
    },
    updateXzOrder(){
      this.xzOrder.gongJu = this.toJion(this.checkedGongJus);
      this.xzOrder.caiLiaoSha = this.toJion(this.checkedshas);
      this.xzOrder.caiLiaoYongPin = this.toJion(this.checkedyps);
      this.xzOrder.houQi = this.toJion(this.checkedhqs);
      this.xzOrder.caiLiao = this.toJion(this.checkedcls);
      this.jsonPostRequest("/after/sale/course/checked?uid="+this.uid).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
           this.dialogFormVisible2 = false;
           this.$message.success("提交成功");
           this.getCollectMouldList();
        }else{
          this.$message.error("提交失败");
        }
      })
    },
    toBuChong(data){
      this.itemShouHou = data;
      this.xzOrder = data.shXzOrder;
      this.xzOrder.danWei = data.danwei;
      this.xzOrder.address= data.address;
      this.xzOrder.userName= data.userName;

      if(data.shXzOrder.gongJu.length > 0){
        this.checkedGongJus = data.shXzOrder.gongJu.split(',');
      }
      if(data.shXzOrder.caiLiaoSha.length > 0){
        this.checkedshas = data.shXzOrder.caiLiaoSha.split(',');
      }
      if(data.shXzOrder.caiLiaoYongPin.length > 0){
        this.checkedyps = data.shXzOrder.caiLiaoYongPin.split(',');
      }
      if(data.shXzOrder.caiLiao.length > 0){
        this.checkedcls = data.shXzOrder.caiLiao.split(',');
      }
      if(data.shXzOrder.houQi.length > 0){
        this.checkedhqs = data.shXzOrder.houQi.split(',');
      }
      this.dialogFormVisible2 = true;
    },
    toJion(data){
      if(data.length > 0){
        var item_str = '';
        for(var i=0;i<data.length; i++){
          item_str = data[i]+ ',' + item_str
        }
        return item_str;
      }else {
        return '';
      }
    },
    imageuploaded(data) {
      let self = this;
      if (data.url.length !== 'undefined' && data.url.length > 0) {
        let url = data.url
        let urls = self.wanJieImageUrls;
        for (var i = 0; i < url.length; i++) {
          urls.push(url[i]);
        }
        self.wanJieImageUrls = urls;
      }
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
          let urls = self.wanJieImageUrls;
          let newUrls = [];
          for (var i = 0; i < urls.length; i++) {
            if (url != urls[i]) {
              newUrls.push(urls[i])
            }
          }
          self.wanJieImageUrls = newUrls;
        } else {
          self.$message.error("删除照片失败");
        }
      })
    },
    // 上传图片失败
    handleError() {
      this.$notify.error({
        title: '上传失败',
        message: '图片上传出现异常'
      });
    },
    imageupwenjian(data) {
      this.$message.success("上传成功");
      let urls = [];
      urls = data.url;
      if(urls != 'undefinded' && urls.length > 0 ){
        this.wen_jian_url = urls[0];
      }
    },
    toTiJiao(item){
      this.dialogFormVisible = true;
      this.form.remark = '';
      this.imageUrls = [];
      this.wen_jian_url = '';
      this.itemData = item;
    },
    toPinjieUrl(urls) {
      var te = this.$options.filters['imageFilter'];
      let url = te(urls);
      return url;
    },
    tiJiao(){
      let shouhou = {
           remark: this.form.remark,
           fileUrl: this.wen_jian_url,
           orderId: this.itemData.orderId,
           picUrls: this.toPinjieUrl(this.imageUrls),
           addUserId:this.uid,
           addUserName:this.name
       }
       this.jsonPostRequest("/after/sale/job/add/bg", shouhou).then(resp => {
         if (resp && resp.status == 200 && resp.data.code == 0) {
           this.$message.success("报告提交成功");
           this.dialogFormVisible = false;
           this.getCollectMouldList();
         } else {
           this.$message.error("报告提交失败");
         }
       })
     },
    quxiao(){
      this.dialogFormVisible = false;
      this.form.remark = '';
      this.imageUrls = [];
      this.wen_jian_url = '';
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
    "&userId=" + this.uid ).then(resp => {
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
      this.imageData.userId = this.uid = localStorage.getItem('cp_uid');
      this.wenjianData.userId = this.uid = localStorage.getItem('cp_uid');
      this.upload = JLApiUtils.upload;
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
