
<template>
<div>
  <div v-show="nowTab === 1">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>工艺管理</el-breadcrumb-item>
        <el-breadcrumb-item>已提交记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-card class="box-card" shadow="never" style="margin-top:25px;">
        <div class="handle-box">
          <el-row :gutter="10">
            <el-col :span="6">
                纹理代码:<el-input v-model="item_wenli" placeholder="请输入纹理代码" class="handle-input mr10" icon="search"></el-input>
            </el-col>
            <el-col :span="6"><div class="grid-content bg-purple">
                  订单编号:<el-input v-model="item_orderId" placeholder="请输入订单编号" class="handle-input mr10" icon="search"></el-input>
            </div></el-col>
            <!-- <el-col :span="6"><div class="grid-content bg-purple">
                  单位：<el-select v-model="select_unit" clearable  placeholder="请选择客户单位">
                        <el-option
                          v-for="item in allUnit"
                          :key="item.id"
                          :label="item.clientCompanyName"
                          :value="item.id">
                        </el-option>
                      </el-select>
            </div></el-col> -->
          </el-row>
        </div>
        <div class="handle-box">
          <el-button type="primary" icon="el-icon-search" @click="chaXun()">搜索</el-button>
        </div>
      </el-card>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center;margin-top:0px;">
        <!-- <div class="handle-box">
          <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" icon="search"></el-input>
        </div> -->

      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <el-table :data="tableData" stripe style="width: 100%" v-loading="tableLoading">
          <el-table-column label="订单编号" prop="orderId">
            <template slot-scope="scope">
              {{scope.row.orderId}}
            </template>
          </el-table-column>
          <el-table-column label="订单名称" prop="orderName">
            <template slot-scope="scope">
              {{scope.row.order.orderName}}
            </template>
          </el-table-column>
          <el-table-column label="紧急程度">
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
          <el-table-column label="纹理代码" >
            <template slot-scope="scope">{{ scope.row.wenli.wenliName}}</template>
          </el-table-column>
          <el-table-column label="商务负责人">
            <template slot-scope="scope">{{ scope.row.order.addUserName}}</template>
          </el-table-column>
          <el-table-column label="添加人" prop="addUserName">
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime">
            <template slot-scope="scope">{{ scope.row.createTime | formatDateTime}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="toAdd(scope.row)">查看详情</el-button>
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
  <div v-show="nowTab==2">
    <BuChongGongYi :techCards="techCard" v-on:listenToChild="showChild"></BuChongGongYi>
  </div>
</div>
</template>
<script>
import BuChongGongYi from '../comm/BuChongGongYi.vue';
export default {
  components: {
    BuChongGongYi
  },
  data() {
    return {
      item_wenli:"",
      item_orderId:"",
      orderTitle:'',
      techCard:{},
      itemOrderId:'',
      dialogFormVisible: false,
      addtechloading:false,
      nowTab: 1,
      username: '',
      name: '',
      uid: '',
      tableLoading: false,
      currentPage: 1,
      totalnum: 0,
      pagesize: 10,
      select_word: '',
      tableData: [],
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
    chaXun(){
      this.getCollectMouldList();
    },
    showChild(data){
      this.nowTab = 1;
    },
    toAdd(item){
      this.techCard = item;
      this.nowTab=2;
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
      self.addtechloading = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          self.form.orderId = self.itemOrderId;
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
      this.getRequest("/tech/added/listbypage?page=" + this.currentPage + "&size=" + this.pagesize+
    "&wenli=" + this.item_wenli + "&orderId=" + this.item_orderId ).then(resp => {
        // _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          _this.tableData = resp.data.data.stayorderlist
          _this.totalnum = resp.data.data.count
        }
      })
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      // this.tableLoading = true;
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
