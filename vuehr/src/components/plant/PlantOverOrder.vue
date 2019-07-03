
<template>
<div>
  <div v-show="nowTab === 1">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>车间管理</el-breadcrumb-item>
        <el-breadcrumb-item>已完成订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center;margin-top:20px;">
        <div class="handle-box">
          <!-- <el-button type="primary" icon="plus" class="mr10" @click="toadd">创建订单</el-button> -->
          <!-- <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" icon="search"></el-input> -->
        </div>
      </el-header>
      <el-card class="box-card" shadow="never">
        <div class="handle-box">
          <el-row :gutter="10">
            <el-col :span="6"><div class="grid-content bg-purple">
                  单位：<el-select v-model="select_unit" filterable  placeholder="请选择客户单位">
                        <el-option
                          v-for="item in allUnit"
                          :key="item.id"
                          :label="item.clientCompanyName"
                          :value="item.id">
                        </el-option>
                      </el-select>
            </div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple">
                  项目： <el-select v-model="select_project" filterable  placeholder="请选择项目">
                        <el-option
                          v-for="item in allProject"
                          :key="item.id"
                          :label="item.projectName"
                          :value="item.id">
                        </el-option>
                      </el-select>
            </div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple">
                  产品名称： <el-input
                    placeholder="请填写产品名称"
                    style="width:50%"
                    v-model="select_order_name">
                  </el-input>
            </div></el-col>
          </el-row>
        </div>

        <div class="handle-box">
          <el-button type="primary" icon="el-icon-search" @click="selectAll()">搜索</el-button>
        </div>
      </el-card>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <el-table :data="data" stripe style="width: 100%" v-loading="tableLoading">
          <el-table-column label="产品名称" prop="orderName">
          </el-table-column>
          <!-- <el-table-column label="客户单位" prop="clientCompanyName">
          </el-table-column> -->
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
          <!-- <el-table-column label="工艺卡状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.techId+'' === '0'"  type="danger">未提交</el-tag>
              <el-tag v-if="scope.row.techId+'' !== '0'" type="primary">已提交</el-tag>
      </template>
          </el-table-column> -->
          <el-table-column label="面积" prop="realityArea">
          </el-table-column>
          <el-table-column label="完工日期" prop="">
            <template slot-scope="scope">{{ scope.row.createTime | formatDateTime}}</template>
          </el-table-column>
          <el-table-column label="下单日期" prop="createTime">
            <template slot-scope="scope">{{ scope.row.createTime | formatDateTime}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="">查看详情</el-button>
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
</div>
</template>
<script>
export default {
  data() {
    return {
      allUnit:[],
      allProject:[],
      select_unit:'',
      select_project:'',
      select_order_name:'',
      nowTab: 1,
      username: '',
      name: '',
      uid: '',
      tableLoading: false,
      currentPage: 1,
      totalnum: 0,
      pagesize: 10,
      select_word: '',
      tableData: []
    }
  },
  methods: {
    toinfo(id) {
      this.$router.push('/order/info/' + id)
    },
    toadd() {
      this.$router.push('/order/add')
    },
    // 重置
    handleSizeChange(val) {
      this.pagesize = val;
      this.selectAll();
      // this.getCollectMouldList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.selectAll();
      //this.getCollectMouldList();
    },
    // 获取待审核的列表
    getCollectMouldList() {
      let _this = this
      this.getRequest("/plant/over/listbypage?page=" + this.currentPage + "&size=" + this.pagesize).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.tableData = resp.data.data.overorderlist
          this.totalnum = resp.data.data.count
        }
      })
    },
    selectAll() {
      let select = "";
      if(this.select_unit !== '' && this.select_unit!== 'undefined'){
        select = select + "&unitId=" + this.select_unit
      }
      if(this.select_project !== '' && this.select_project!== 'undefined'){
        select = select + "&projectId=" + this.select_project
      }
      if(this.select_order_name !== '' && this.select_order_name!== 'undefined'){
        select = select + "&orderName=" + this.select_order_name
      }

      this.getRequest("/plant/over/listbypage?page=" + this.currentPage +"&size=" + this.pagesize + select).then(resp => {
          this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.tableData = resp.data.data.overorderlist
          this.totalnum = resp.data.data.count
        } else {
          console.log("获取列表数据失败");
        }
      });
    },
    loadAllProject() {
      let self = this
      this.getRequest("/project/list/byuid?uid=" + this.uid).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          let re = resp.data.data.projectlist;
          if (re != 'undefined' && re.length > 0) {
            self.allProject = re;
          }
        } else {
          console.log("获取列表数据失败");
        }
      });
    },
    loadAllUnit() {
      let self = this
      this.getRequest("/unit/all").then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          let re = resp.data.data.unitlist;
          if (re != 'undefined' && re.length > 0) {
            self.allUnit = re;
          }
        } else {
          console.log("获取列表数据失败");
        }
      });
    }
    // 获取订单列表
    // getCollectMouldList() {
    //   let _this = this
    //   this.getRequest("/plant/new/order?page=" + this.currentPage + "&size=" + this.pagesize +"&userId=" +this.uid + "&plantStatus=2").then(resp => {
    //     _this.tableLoading = false;
    //     if (resp && resp.status == 200 && resp.data.code == 0) {
    //       _this.tableData = resp.data.data.orderlist
    //       _this.totalnum = resp.data.data.count
    //     }
    //   })
    // }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableLoading = true;
      //this.getCollectMouldList();
      this.selectAll();
      this.loadAllUnit();
      this.loadAllProject();
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
            d.clientCompanyName.indexOf(self.select_word) > -1
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
