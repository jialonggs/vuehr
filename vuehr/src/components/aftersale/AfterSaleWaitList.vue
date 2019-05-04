<template>
<div>
  <div>
    <div class="crumbs" >
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>待分配售后</el-breadcrumb-item>
        <el-breadcrumb-item>待分配记录</el-breadcrumb-item>
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
              <el-table-column prop="" label="订单名称">
                <template slot-scope="scope">
            <span >{{ scope.row.order.orderName}}</span>
          </template>
              </el-table-column>
              <el-table-column prop="addUserName" label="项目负责人">
                <template slot-scope="scope">
            <span >{{ scope.row.order.addUserName}}</span>
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
                <el-button v-if="scope.row.userId === ''"
                  size="mini"
                  type="primary"
                  @click="toFenPei(scope.row)">分配售后</el-button>
                  <el-button
                    size="mini"
                    type="primary"
                    @click="toHuZ(scope.row)">查看商务单</el-button>
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
                <el-form-item label="选择售后人员:">
                  <el-select v-model="itemYga" placeholder="请选工售后人员">
                    <el-option v-for="item1 in restaurants4" :key="item1.value" :label="item1.label" :value="item1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="前往时间:">
                  <el-date-picker style="width:40%" format="yyyy 年 MM 月 dd 日 HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="form.toTime" type="datetime" placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="预计时间:">
                  <el-input  v-model="form.days"></el-input>
                </el-form-item>
                <el-form-item label="始派地点:">
                  <el-input  v-model="form.diDian"></el-input>
                </el-form-item>
              <el-form-item label="备注：">
                  <el-input type="textarea" v-model="form.ZJremark"></el-input>
              </el-form-item>
              <!-- <el-form-item label="上传照片：">
                  <el-upload class="upload-demo" drag action="/api/posts/" multiple>
                      <i class="el-icon-upload"></i>
                      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

                  </el-upload>
              </el-form-item> -->
          </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="toAdd">提 交</el-button>
          <el-button  @click="quxiao">取 消</el-button>
      </div>
  </el-dialog>
  <!-- 审核步骤 -->
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
            <el-input v-model="shouHouOrder.shouHouMan" ></el-input>
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
           <el-date-picker v-model="shouHouOrder.toTime"  style="width:50%" format="yyyy 年 MM 月 dd 日 HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间">
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
                <el-radio-group v-model="shouHouOrder.customerAtti">
                   <el-radio :label="0">满意</el-radio>
                   <el-radio :label="1">不满意</el-radio>
                 </el-radio-group>
               </el-form-item>
           </div> -->
          <div class="grid-content bg-purple" style="margin-top:25px;">
              <el-form-item label="修复内容：" prop="laoWuMingCheng" >
                <el-input type="textarea" :disabled="true" autosize placeholder="请输入内容" v-model="shouHouOrder.fixContent" ></el-input >
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
</div>
</template>
<script>
export default {
  data() {
    return {
      item:{},
      imageUrls:[],
      shouHouOrder:{},
      restaurants4:[],
      username: '',
      itemYga:'',
      name: '',
      uid: '',
      fenPei:'',
      dialogFormVisible: false,
      dialogFormVisible1:false,
      select_word: '',
      form: {
          ZJremark: '',
          diDian:'',
          days:'',
          toTime:'',
      },
      currentPage: 1,
      totalnum: 0,
      pagesize: 10,
      select_word: '',
      tableData: [],

    }
  },
  methods: {
    toHuZ(item){
      this.imageUrls = [];
      this.dialogFormVisible1 = true;
      this.shouHouOrder = item.shBaoGao;
      this.shouHouOrder.danwei = item.danwei;
      this.shouHouOrder.address = item.address;
      let picurl = item.shBaoGao.picUrls
        if (picurl != "undefined" && picurl != "") {
          let urlArray = picurl.split('|');
          this.imageUrls = urlArray;
        }
    },
    toFenPei(item){
      this.dialogFormVisible = true;
      this.fenPei = item;
      this.form = {
          ZJremark: '',
          diDian:'',
          days:'',
          toTime:'',
      }
      this.loadAllYuanGongA();
      this.itemYag = [];

    },
    toChaKan(data){

    },
    quxiao(){
      this.dialogFormVisible = false;
      this.fenPei = [];
      this.itemYag = [];
    },
    toAdd(){
     let shouhou = {
          ZJremark: this.form.ZJremark,
          days:this.form.days,
          toTime:this.form.toTime,
          diDian:this.form.diDian,
          orderId: this.fenPei.order.id,
          userId: this.itemYga.value,
          userName: this.itemYga.label,
          addUserId:this.uid,
          addUserName:this.name,
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
      this.getRequest("/config/mangers?role=ROLE_shou_hou").then(resp => {
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
      this.getRequest("/after/sale/wait/list?page=" + this.currentPage + "&size=" + this.pagesize +
    "&userId=" + this.uid + "&status=1" ).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.tableData = resp.data.data.afterlist
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
