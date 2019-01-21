
<template>
<div>
  <div v-show="nowTab === 1">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>工艺管理</el-breadcrumb-item>
        <el-breadcrumb-item>待提交记录</el-breadcrumb-item>
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
        <el-table :data="data" border   style="width: 100%" v-loading="tableLoading">
          <el-table-column label="订单名称" prop="orderName">
          </el-table-column>
          <el-table-column label="紧急程度">
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
            <template slot-scope="scope">{{ scope.row.createTime | formatDateTime}}</template>
          </el-table-column>
          <el-table-column label="负责人" prop="addUserName">
          </el-table-column>
          <el-table-column label="纹理代码" prop="addUserName">
              <template slot-scope="scope">
                <el-table  :data="scope.row.wenlis" >
                  <el-table-column prop="wenliName">
                  </el-table-column>
                </el-table>
        </template>
          </el-table-column>
          <el-table-column label="面积" prop="addUserName">
              <template slot-scope="scope">
                <el-table  :data="scope.row.wenlis">
                  <el-table-column prop="area">
                  </el-table-column>
                </el-table>
        </template>
          </el-table-column>
          <el-table-column label="倍数" prop="addUserName">
              <template slot-scope="scope">
                <el-table  :data="scope.row.wenlis">
                  <el-table-column prop="times">
                  </el-table-column>
                </el-table>
        </template>
          </el-table-column>
          <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-table  :data="scope.row.wenlis">
                  <el-table-column >
                    <template slot-scope="sx">
                      <el-button
                        size="mini"
                        type="danger"
                        @click="toAdd(scope.row, sx.row)">编辑工艺卡</el-button>
                  </template>
                  </el-table-column>
                </el-table>
        </template>
          </el-table-column>

        </el-table>
      </el-main>
    </el-container>
    <div class="block" style="float:right;margin-top:15px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 30, 80, 100]" :page-size="pagesize" layout="total,sizes, prev, pager, next, jumper" :total="totalnum">
      </el-pagination>
    </div>
    <!-- 添加记录 -->
    <el-dialog :title="orderTitle" :visible.sync="dialogFormVisible" v-loading="addtechloading" width='50%' >
      <div>
          <div >
              <div>
                <span>项目名称：{{this.itemOrder.project.projectName}}</span>
                <span>区域：{{this.itemOrder.controlOrderFrom.quYu}}</span>
                <span>深度：{{this.itemOrder.controlOrderFrom.shenDu}}</span>
                <div :index="index" v-for="(list, index) in this.mouldLists" style="margin-top:10px;">
                  <div>
                    <span>{{list.productName}}的图片为:</span>
                  </div>
                  <div v-for="item1 in list.picUrls" style="margin-top:5px;">
                    <img  v-bind:src="item1" style="width:358px"/>
                  </div>
                </div>
                <!-- <div style="border: 1px dashed #d9d9d9;width:100%;min-height:358px;">
                  <el-row :gutter="20" style="margin-top:10px;">
                    <el-col :span="6" v-for="imageUrl in imageUrls ">
                      <el-card :body-style="{ padding: '0px' }" class="mould-card">
                        <img class="image" v-bind:src="imageUrl" style="height:420px;">

                      </el-card>
                    </el-col>
                  </el-row>
                </div> -->
              </div>

              <el-form ref="form" :model="form" :rules="rules" label-width="120px" >
                <!-- <el-form-item label="选择皮纹代码:" prop="name">
                  <template>
        <el-select v-model="form.wenliId" clearable placeholder="请选择">
          <el-option
            v-for="item in this.itemOrder.wenlis"
            :key="item.id"
            :label="item.wenliName"
            :value="item.value">
          </el-option>
        </el-select>
        </template>
                      </el-form-item> -->
                  <el-form-item label="皮纹代码："  >
                      <span>{{itemWenLi.wenliName}}</span>
                  </el-form-item>
                  <el-form-item label="难度系数："  prop="nanDuXiShu">
                      <el-input v-model="form.nanDuXiShu" placeholder="请输入难度系数" style="width:30%"></el-input>
                  </el-form-item>
                  <!-- <el-form-item label="贴花步数："  prop="tieHuaBuShu">
                    <el-input v-model="form.tieHuaBuShu" placeholder="请输入贴花数" style="width:30%"></el-input>
                  </el-form-item> -->
                  <el-form-item label="贴花步数：" prop="tieHuaBuShu">
                    <el-input-number v-model="form.tieHuaBuShu" controls-position="right" @change="handleChange" :min="1"></el-input-number>
                  </el-form-item>
                  <el-form-item label="工艺参数："  prop="gongYiCanShu">
                      <el-input v-model="form.gongYiCanShu" type="textarea" :autosize="true" placeholder="请输入工艺参数" style="width:50%;"></el-input>
                  </el-form-item>
              </el-form>
          </div>
          <!-- <div style="height:1px;width:100%;border-bottom: 1px solid #e6ebf5;
            box-sizing: border-box;margin-bottom:15px;margin-top:15px;">
          </div> -->
          <div class="card-bottom">
              <el-button type="primary" @click="submitForm('form')">提 交</el-button>
              <el-button @click="resetForm('form')">重 置</el-button>
          </div>
        </div>
    </el-dialog>
  </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      orderTitle:'',
      itemOrderId:'',
      dialogFormVisible: false,
      addtechloading:false,
      nowTab: 1,
      username: '',
      name: '',
      uid: '',
      mouldLists:[],
      itemWenLi:{},
      tableLoading: false,
      currentPage: 1,
      totalnum: 0,
      pagesize: 10,
      select_word: '',
      tableData: [],
      itemOrder:{
        project:{
          projectName:''
        },
        controlOrderFrom:{
          shenDu:'',
          quYu:''
        }
      },
      form:{
        tieHuaBuShu: '1'
      },
      rules: {
        nanDuXiShu: [{
          required: true,
          message: '请输入难度系数',
          trigger: 'blur'
        }],
        gongYiCanShu: [{
          required: true,
          message: '请输入加工参数',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    if (columnIndex === 0) {
      if (rowIndex % 2 === 0) {
        return {
          rowspan: 2,
          colspan: 1
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    }
  },
    toAdd(item,wenLi){
      this.itemWenLi = {};
      this.mouldLists = [];
      this.itemOrder = [];
      this.itemOrderId = ""
      this.dialogFormVisible = true;
      this.orderTitle = "添加订单 [ " + item.orderName + " ]" +" 的工艺卡";
      this.itemOrderId = item.id;
      this.itemOrder = item;
      // var te = this.$options.filters['splitRejectRemark'];
      let mouldList = this.itemOrder.mouldInfoList;
      if("" !== mouldList && mouldList !== 'undefined'){
        let item = [];
        for(let i=0; i<mouldList.length; i++){
          let picUrls = mouldList[i].picUrls;
          if(picUrls!=="" && picUrls !== 'undefined' && !(picUrls instanceof Array)){
            let urlArray = picUrls.split('|');
            mouldList[i].picUrls = urlArray;
            item.push(mouldList[i]);
          }else{
            item.push(mouldList[i]);
          }
        }
        this.mouldLists = item
      }
      this.itemWenLi = wenLi;
    },
    handleChange(value) {},
    // 重置
    handleSizeChange(val) {
      this.pagesize = val;
      this.getCollectMouldList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCollectMouldList();
    },
    // 添加项目基础信息
    submitForm(formName) {
      let self = this;

      this.$refs[formName].validate((valid) => {
        if (valid) {
          self.form.orderId = self.itemOrderId;
          self.form.piWenDaiMa = self.itemWenLi.wenliName
          self.form.wenliId = self.itemWenLi.id
          self.form.addUserName = this.name;
          self.form.addUserUid = this.uid;
          self.addtechloading = true;
          this.postRequest("/tech/stay/add/tech", self.form).then(resp => {
            self.addtechloading = false;
            if (resp && resp.status == 200 && resp.data.code == 0) {
              this.$message.success("添加成功");
              this.resetForm('form');
              this.tableLoading = true;
              this.dialogFormVisible = false;
              this.getCollectMouldList();
            }else{
              this.$message.error("添加失败");
            }
          })
        } else {
          self.$message.error('请检查输入信息的格式');
          return false;
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 获取订单列表
    getCollectMouldList() {
      let _this = this
      this.getRequest("/tech/stay/listbypage?page=" + this.currentPage + "&size=" + this.pagesize ).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          console.log(resp);
          _this.tableData = resp.data.data.stayorderlist
          _this.totalnum = resp.data.data.count
        }
      })
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableLoading = true;
      this.getCollectMouldList();
    })
    this.username = localStorage.getItem('cp_username');
    this.uid = localStorage.getItem('cp_uid');
    this.name = localStorage.getItem('cp_name');
  },
  computed: {
    data() {
      const self = this;
      return self.tableData.filter(function(d) {
        if (d.orderName.indexOf(self.select_word) > -1 ||
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
