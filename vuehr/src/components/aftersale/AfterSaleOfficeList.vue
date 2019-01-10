<template>
<div>
  <div>
    <div class="crumbs" >
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>订单售后</el-breadcrumb-item>
        <el-breadcrumb-item>订单售后</el-breadcrumb-item>
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
              </el-table-column>
              <el-table-column prop="addUserName" label="项目负责人">
                </el-table-column>
              <el-table-column label="下单日期">
                  <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.createTime | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="售后负责人">
              <template slot-scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <span  style="margin-left: 10px">{{ scope.row.shouHou.userName }}</span>
        </template>
      </el-table-column>
              <!-- <el-table-column prop="urgency" label="紧急程度">
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
              </el-table-column> -->
              <el-table-column prop="urgency" label="售后状态">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.afterStatus+'' === '0' || scope.row.afterStatus+'' === '1' && scope.row.shouHou.status+'' ==='0' " type="primary">待申请售后</el-tag>
                  <el-tag v-if="scope.row.afterStatus+'' === '2' && scope.row.shouHou.status+'' ==='1'" type="primary">待分配</el-tag>
                  <el-tag v-if="scope.row.shouHou.status+'' === '2' " type="primary">进行中</el-tag>
                  <el-tag v-if="scope.row.shouHou.status+'' === '3' " type="primary">完成</el-tag>
            </template>
              </el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope">
                <!-- <el-button v-if= "scope.row.afterStatus+'' === '0'"
                  size="mini"
                  type="primary"
                  @click="toFenPei(scope.row)">申请售后</el-button> -->
                  <el-button v-if= "scope.row.afterStatus+'' === '0'"
                    size="mini"
                    type="primary"
                    @click="toXingZheng(scope.row)">行政单</el-button>
                    <el-button v-if= "scope.row.shouHou.shId+'' === '' && scope.row.shouHou.xzId+''!== ''"
                      size="mini"
                      type="primary"
                      @click="souhou(scope.row)">售后单</el-button>
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
  <el-dialog title="售后服务回执单" :visible.sync="dialogFormVisible" width='60%' v-loading="tableLoading1">
    <div class="form-box">
      <el-form ref="form" :model="shouHouOrder" label-width="120px" >
        <el-row :gutter="20">
       <el-col :span="12"><div class="grid-content bg-purple">
         <el-form-item label="客户单位：" prop="danwei">
           <el-input v-model="shouHouOrder.danwei" ></el-input>
         </el-form-item>
         <el-form-item label="前往地址：" prop="address">
           <el-input v-model="shouHouOrder.address" ></el-input>
         </el-form-item>
         <el-form-item label="售后人员：" prop="shouHouMan">
            <el-input v-model="shouHouOrder.shouHouMan" ></el-input>
         </el-form-item>
       </div></el-col>
       <el-col :span="12"><div class="grid-content bg-purple">
         <el-form-item label="联系人：" prop="contactUser">
            <el-input v-model="shouHouOrder.contactUser" ></el-input>
         </el-form-item>
         <el-form-item label="联系电话：" prop="contactPhone">
           <el-input v-model="shouHouOrder.contactPhone" ></el-input>
         </el-form-item>
         <el-form-item label="前往日期：" prop="toTime">
           <el-date-picker v-model="shouHouOrder.toTime"  style="width:50%" format="yyyy 年 MM 月 dd 日 HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间">
           </el-date-picker>
         </el-form-item>
       </div>
       </el-col>
        </el-row>
        <div style="width:100%;height:1px;border-top:1px solid;margin-bottom:15px;"></div>
        按贵司来函要求服务事项如下
        <el-row>
       <el-col>
         <div class="grid-content bg-purple" style="margin-top:25px;">
             <el-form-item label="客户评价：" prop="customerAtti" >
                <el-radio-group v-model="shouHouOrder.customerAtti">
                   <el-radio :label="0">满意</el-radio>
                   <el-radio :label="1">不满意</el-radio>
                 </el-radio-group>
               </el-form-item>
           </div>
          <div class="grid-content bg-purple" style="margin-top:25px;">
              <el-form-item label="处理详情：" prop="laoWuMingCheng" >
                <el-input type="textarea" autosize placeholder="请输入内容" v-model="shouHouOrder.fixContent" ></el-input >
                </el-form-item>
            </div>
          </el-col>
        </el-row>
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
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addShouHouOrder()">提 交</el-button>
      <el-button  @click="dialogFormVisible = false">取 消</el-button>
    </div>
  </el-dialog>

  <el-dialog title="售后行政单" :visible.sync="dialogFormVisible2" width='80%' v-loading="tableLoading2">
    <div class="form-box">
      <el-form ref="form" :model="xzOrder" label-width="120px" >
        <el-row :gutter="20">
       <el-col :span="12"><div class="grid-content bg-purple">
         <el-form-item label="客户单位：" prop="danWei">
           <el-input v-model="xzOrder.danWei" ></el-input>
         </el-form-item>
         <el-form-item label="单位地址：" prop="address">
           <el-input v-model="xzOrder.address" ></el-input>
         </el-form-item>
         <el-form-item label="联系内容：" prop="contactContent">
            <el-input v-model="xzOrder.contactContent" ></el-input>
         </el-form-item>
       </div></el-col>
       <el-col :span="12"><div class="grid-content bg-purple">
         <el-form-item label="预计周期：" prop="yuJi">
           <el-date-picker v-model="xzOrder.yuJi"  style="width:50%" format="yyyy 年 MM 月 dd 日 HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间">
           </el-date-picker>
            <!-- <el-input v-model="xzOrder.yuJi" ></el-input> -->
         </el-form-item>
         <el-form-item label="实施日期：" prop="startDate">
           <el-date-picker v-model="xzOrder.startDate"  style="width:50%" format="yyyy 年 MM 月 dd 日 HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间">
           </el-date-picker>
           <!-- <el-input v-model="xzOrder.startDate" ></el-input> -->
         </el-form-item>
         <el-form-item label="售后人员：" prop="shouHouMan">
            <el-input v-model="xzOrder.shouHouMan" ></el-input>
         </el-form-item>
       </div>
       </el-col>
        </el-row>
        <div style="width:100%;height:1px;border-top:1px solid;margin-bottom:15px;"></div>
        中途转程
        <el-row :gutter="20">
       <el-col :span="12"><div class="grid-content bg-purple">
         <el-form-item label="地 点：" prop="transferAddress" >
           <el-input v-model="xzOrder.transferAddress" ></el-input >
         </el-form-item>
         <el-form-item label="单 位：" prop="transferCompany">
            <el-input v-model="xzOrder.transferCompany" ></el-input>
         </el-form-item>
       </div></el-col>
       <el-col :span="12"><div class="grid-content bg-purple">
         <el-form-item label="问 题：" prop="transferProblem">
           <el-input v-model="xzOrder.transferProblem" ></el-input>
         </el-form-item>
         <el-form-item label="联系人：" prop="transferContact">
            <el-input v-model="xzOrder.transferContact" ></el-input>
         </el-form-item>
       </div>
       </el-col>
        </el-row>
        <div style="width:100%;height:1px;border-top:1px solid;margin-bottom:15px;"></div>
        <el-row>
          <el-col>
            <el-form-item label="售后工具：" prop="fuKuanType">
              <el-checkbox-group v-model="checkedGongJus">
              <el-checkbox v-for="gj in gongjus" :label="gj" :key="gj">{{gj}}</el-checkbox>
            </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="售后材料：" prop="fuKuanType">
               <span>砂：</span>
               <el-checkbox-group v-model="checkedshas" >
               <el-checkbox v-for="sha in shas" :label="sha" :key="sha">{{sha}}</el-checkbox>
               </el-checkbox-group>
              <span>洗模用品：</span>
              <el-checkbox-group v-model="checkedyps">
              <el-checkbox v-for="yp in yps" :label="yp" :key="yp">{{yp}}</el-checkbox>
              </el-checkbox-group>
              <span>其它材料：</span>
              <el-checkbox-group v-model="checkedcls" >
              <el-checkbox v-for="cl in cls" :label="cl" :key="cl">{{cl}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="后期补充：" prop="fuKuanType">
              <el-checkbox-group v-model="checkedhqs" >
              <el-checkbox v-for="hq in hqs" :label="hq" :key="hq">{{hq}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="后期补充详情：" prop="houQiRemark">
                <el-input v-model="xzOrder.houQiRemark" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="外派人员：" prop="waiPaiRenYuan">
                <el-input v-model="xzOrder.waiPaiRenYuan" ></el-input>
            </el-form-item>
            <el-form-item label="交通方式：" prop="jiaoTong">
                <el-input v-model="xzOrder.jiaoTong" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="备注：" prop="remark">
                <el-input v-model="xzOrder.remark" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addXzOrder">提 交</el-button>
      <el-button  @click="dialogFormVisible2=false">取 消</el-button>
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
      tableLoading2: false,
      tableLoading1: false,
      upload: '',
      imageData: {
        userId: '',
        imgPakage: 'sfm_shou'
      },
      imageUrls: [],
      itemOrder:'',
      commData: {
        danwei:'',
        address:''
      },
      itemShouHouOrder:'',
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
      shouHouOrder:{
        orderId:'',
      },
      xzOrder:{
        orderId:'',
        shouHouId:''
      },
      dialogFormVisible2:false,
      restaurants4:[],
      username: '',
      itemYga:[],
      name: '',
      uid: '',
      fenPei:'',
      dialogFormVisible: false,
      select_word: '',
      currentPage: 1,
      totalnum: 0,
      pagesize: 10,
      select_word: '',
      tableData: []
    }
  },
  methods: {
    addXzOrder(){
      this.xzOrder.orderId = this.itemOrder.id;
      // this.xzOrder.shId = this.itemOrder.id;
      this.xzOrder.gongJu = this.toJion(this.checkedGongJus);
      this.xzOrder.caiLiaoSha = this.toJion(this.checkedshas);
      this.xzOrder.caiLiaoYongPin = this.toJion(this.checkedyps);
      this.xzOrder.houQi = this.toJion(this.checkedhqs);
      this.xzOrder.caiLiao = this.toJion(this.checkedcls);
      this.xzOrder.addUserName = this.name;
      this.xzOrder.addUserId = this.uid;
      this.tableLoading2 = true;
      this.jsonPostRequest("/after/sale/office/addXZ", this.xzOrder).then(resp => {
        this.tableLoading2 = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
           this.dialogFormVisible2 = false;
           this.$message.success("提交成功,请继续填写售后回执单");
           this.getCollectMouldList();
        }else{
          this.$message.error("提交失败");
        }
      })
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
    souhou(data){
      this.dialogFormVisible = true
      this.itemShouHouOrder = data;
      this.shouHouOrder = {};
      this.imageUrls = [];
      this.commData.danwei = data.shouHou.danwei
      this.commData.address = data.shouHou.address
      this.shouHouOrder.danwei = data.shouHou.danwei
      this.shouHouOrder.address = data.shouHou.address
    },
    addShouHouOrder(){
      this.shouHouOrder.addUserName = this.name;
      this.shouHouOrder.addUserId = this.uid;
      this.shouHouOrder.orderId = this.itemShouHouOrder.id;
      let url = "";
      for (var i = 0; i < this.imageUrls.length; i++) {
        if (i == this.imageUrls.length - 1) {
          url = url + this.imageUrls[i]
        } else {
          url = this.imageUrls[i] + "|" + url
        }
      }
      this.shouHouOrder.picUrls = url;
      this.tableLoading1 = true;
      this.jsonPostRequest("/after/sale/office/addSh", this.shouHouOrder).then(resp => {
        this.tableLoading1 = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
           this.dialogFormVisible = false;
           this.$message.success("提交成功,订单进入待分配状态");
           this.getCollectMouldList();
        }else{
          this.$message.error("提交失败");
        }
      })
    },
    toXingZheng(data){
        this.dialogFormVisible2 = true;
        this.itemOrder = data;
        this.xzOrder = {};
        this.checkedGongJus = []
        this.checkedshas = []
        this.checkedyps = []
        this.checkedhqs = []
        this.checkedcls = []
    },
   toFenPei(val){
     this.tableLoading = true;
     this.getRequest("/after/sale/office/toSale?orderId=" + val.id + "&afterStatus=1").then(resp => {
       this.tableLoading = false;
       if (resp && resp.status == 200 && resp.data.code == 0) {
          this.getCollectMouldList();
          this.$message.success("申请成功，待售后主管处理");
       }else{
         this.$message.error("申请失败");
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
   // 上传图片失败
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
    // 获可售后列表
    getCollectMouldList() {
      let _this = this
      this.getRequest("/after/sale/office/list?page=" + this.currentPage + "&size=" + this.pagesize +
    "&userId=" + this.uid + "&afterStatus=0" ).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.tableData = resp.data.data.afterofficeList
          this.totalnum = resp.data.data.count
        }
      })
    }
  },
  mounted: function() {
    this.$nextTick(function() {
        this.tableLoading = true;
        this.imageData.userId = this.uid = localStorage.getItem('cp_uid');
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
