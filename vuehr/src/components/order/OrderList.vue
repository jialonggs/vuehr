
<template>
<div>
  <div v-show="nowTab === 1">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center;margin-top:20px;">
        <div class="handle-box">
          <el-button type="primary" icon="plus" class="mr10" @click="toadd">创建订单</el-button>
          <!-- <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" icon="search"></el-input> -->
        </div>
      </el-header>
      <el-card class="box-card" shadow="never">
        <div class="handle-box">
          <el-row :gutter="10">
            <el-col :span="6">
                主机厂：<el-select v-model="select_engine" clearable  placeholder="请选择主机厂">
                      <el-option
                        v-for="item in Engineoptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
            </el-col>
            <el-col :span="6"><div class="grid-content bg-purple">
                  车型：
                  <el-select v-model="select_car" clearable  placeholder="请选择车型">
                       <el-option
                         v-for="item in allCars"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
                       </el-option>
                     </el-select>
            </div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple">
                  单位：<el-select v-model="select_unit" clearable  placeholder="请选择客户单位">
                        <el-option
                          v-for="item in allUnit"
                          :key="item.id"
                          :label="item.clientCompanyName"
                          :value="item.id">
                        </el-option>
                      </el-select>
            </div></el-col>
            <el-col :span="6"><div class="grid-content bg-purple">
                  项目： <el-select v-model="select_project" clearable  placeholder="请选择项目">
                        <el-option
                          v-for="item in allProject"
                          :key="item.id"
                          :label="item.projectName"
                          :value="item.id">
                        </el-option>
                      </el-select>
            </div></el-col>
          </el-row>
        </div>
        <div class="handle-box">
          <el-button type="primary" icon="el-icon-search" @click="selectAll()">搜索</el-button>
        </div>
      </el-card>

      <el-main style="padding-left: 0px;padding-top: 10px">
        <el-table :data="tableData" stripe style="width: 100%" v-loading="tableLoading">
          <el-table-column label="产品名称" prop="orderName">
          </el-table-column>
          <el-table-column label="所属项目" prop="projectName">
            <template slot-scope="scope">
          <span>{{scope.row.project.projectName}}</span>
        </template>
          </el-table-column>
          <el-table-column label="客户单位" prop="cilentCompanyName">
            <template slot-scope="scope">
          <span>{{scope.row.project.processUnit.clientCompanyName}}</span>
        </template>
          </el-table-column>
          <!-- <el-table-column label="客户单位" prop="clientCompanyName">
          </el-table-column> -->
          <el-table-column label="订单状态">
            <template slot-scope="scope">
          <el-tag type="success">{{scope.row.presentStepName}}</el-tag>
        </template>
          </el-table-column>
          <el-table-column label="订单进度">
            <template slot-scope="scope">
        <el-tag  type="info">{{scope.row.presentSchedule}}%</el-tag>
      </template>
          </el-table-column>
          <!-- <el-table-column label="纹理代码" prop="piWenDaiMa">
          </el-table-column> -->
          <el-table-column  label="纹理代码">
            <template slot-scope="scope">
                <el-tag
                  v-for="role in scope.row.wenlis"
                  :key="role.id"
                  type="success"
                  size="mini"
                  style="margin-right: 5px"
                  :disable-transitions="false">{{role.wenliName}}
                </el-tag>
              </template>
          </el-table-column>
          <el-table-column label="工艺类型" prop="machiningType">
          </el-table-column>
          <el-table-column label="备忘">
            <template slot-scope="scope">
        <el-tag v-if="scope.row.hasRemark+'' === 'true'" >有</el-tag>
        <el-tag v-if="scope.row.hasRemark+'' === 'false'" type="info">无</el-tag>
      </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime">
            <template slot-scope="scope">{{ scope.row.createTime | formatDateTime}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="toinfo(scope.row.id)">查看详情</el-button>
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
      select_engine:'',
      select_car:'',
      select_project:'',
      select_unit:'',
      allUnit:[],
      Engineoptions:[],
      allCars:[],
      allProject:[],

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
      //this.getCollectMouldList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.selectAll();
    //  this.getCollectMouldList();
    },
    // 获取订单列表
    // getCollectMouldList() {
    //   let _this = this
    //   this.getRequest("/order/list/listbypage?page=" + this.currentPage + "&size=" + this.pagesize +"&addUserId=" +this.uid).then(resp => {
    //     _this.tableLoading = false;
    //     if (resp && resp.status == 200 && resp.data.code == 0) {
    //       _this.tableData = resp.data.data.orderlist
    //       _this.totalnum = resp.data.data.count
    //     }
    //   })
    // },
    // 获取项目列表
    getAllEngineList() {
      let _this = this
      this.getRequest("/engine/all").then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          var re = resp.data.data.allenginelist;
          let item = []
          if (re != 'undefined' && re.length > 0) {
            this.Engineoptions = re;
          }
        }
      })
    },
    // 获取项目列表
    getAllCarList() {
      let _this = this
      this.getRequest("/car/all").then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          var re = resp.data.data.allcarlist;
          if (re != 'undefined' && re.length > 0) {
            this.allCars = re;
          }
        }
      })
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
    },
    selectAll() {
      let self = this
      let select = "";
      if(this.select_engine !== '' && this.select_engine !== 'undefined'){
        select = select + "&engineId=" + this.select_engine
      }
      if(this.select_car !== '' && this.select_car !== 'undefined'){
        select = select + "&carId=" + this.select_car
      }
      if(this.select_unit !== '' && this.select_unit!== 'undefined'){
        select = select + "&unitId=" + this.select_unit
      }
      if(this.select_project !== '' && this.select_project!== 'undefined'){
        select = select + "&projectId=" + this.select_project
      }

      this.getRequest("/order/list/by/condition?addUserId=" + this.uid +"&page=" + this.currentPage +"&size=" + this.pagesize + select).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.tableLoading = false;
          this.tableData = resp.data.data.orderlist
          console.log(this.tableData);
          this.totalnum = resp.data.data.count
        } else {
          console.log("获取列表数据失败");
        }
      });
    },
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableLoading = true;
    //  this.getCollectMouldList();
      this.selectAll();
      this.getAllEngineList();
      this.getAllCarList();
      this.loadAllProject();
      this.loadAllUnit();
    })
    this.username = localStorage.getItem('cp_username');
    this.uid = localStorage.getItem('cp_uid');
    this.name = localStorage.getItem('cp_name');
  },
  computed: {
    // data() {
    //   const self = this;
    //   return self.tableData.filter(function(d) {
    //     if (d.projectName.indexOf(self.select_word) > -1 ||
    //         d.cilentCompanyName.indexOf(self.select_word) > -1
    //     ) {
    //       return d;
    //     }
    //   });
    // }
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
