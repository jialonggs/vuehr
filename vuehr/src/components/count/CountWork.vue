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
      <el-header style="align-items: center;margin-top:10px;">
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <div>
          <el-card class="box-card" style="margin-top:0px;">
            <div slot="header" class="clearfix">
              <span>汇总表</span>
            </div>
            <div>
              <div style="min-height:15px;width:100%;">
                <el-table :data="tableData1" border show-summary style="width: 100%">
                  <el-table-column prop="userName" label="姓名">
                  </el-table-column>
                  <el-table-column prop="workTime" label="工时">
                  </el-table-column>
                  <el-table-column prop="lastMonthArge" label="上月遗留面积">
                  </el-table-column>
                  <el-table-column prop="currentMonthArge" label="本月接单面积">
                  </el-table-column>
                  <el-table-column prop="currentMonthNeedArge" label="本月需完成面积">
                  </el-table-column>
                  <el-table-column prop="currentMonthFinishArge" label="本月已完成面积">
                  </el-table-column>
                  <el-table-column prop="currentMonthShenYuArge" label="本月未完成面积">
                  </el-table-column>
                  <el-table-column prop="efficiency" label="平均效率">
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-card>
        </div>
        <!-- <div>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>分配参数表</span>
            </div>
            <div>
              <div style="min-height:15px;width:100%;">
                <el-table :data="tableData6" border show-summary style="width: 100%">
                  <el-table-column prop="projectName" label="组长">
                  </el-table-column>
                  <el-table-column prop="piWenDaiMa" label="未完成单数">
                  </el-table-column>
                  <el-table-column prop="addUserName" label="本月接单面积">
                  </el-table-column>
                  <el-table-column prop="createTime" label="总接单面积">
                  </el-table-column>
                  <el-table-column prop="finishTime" label="现有简单率">
                  </el-table-column>
                  <el-table-column prop="gongXu" label="简单率">
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-card>
        </div> -->

        <div>
          <el-card class="box-card" style="margin-top:25px;">
            <div slot="header" class="clearfix">
              <span>员工工作量统计</span>
            </div>
            <el-alert title="默认统计当月数据" style="margin-bottom:15px;" type="info" center show-icon :closable="false">
            </el-alert>
            </el-alert>
            <div class="block" style="margin-bottom: 15px;">
              <span>开始日期：</span>
              <el-date-picker v-model="value1" type="date"  value-format="timestamp" placeholder="开始日期" :picker-options="pickerOptions0">
              </el-date-picker>
              <span style="margin-left:15px;">结束日期：</span>
              <el-date-picker v-model="value2" type="date"  value-format="timestamp" placeholder="结束日期" :picker-options="pickerOptions1">
              </el-date-picker>
            </div>
            <div>
              <el-row :gutter="30">
                <el-col :span='4' v-loading="tree_loading">
                  <el-input placeholder="输入关键字进行过滤" v-model="filterText">
                  </el-input>
                  <el-tree @check-change="toChangeCheck" :data="data3" default-expand-all :filter-node-method="filterNode" ref="tree2" node-key="id" style="border-right: 1px solid #e6e6e6;min-height:260px;" @node-click="handleNodeClick">
                  </el-tree>
                </el-col>
                <el-col :span='20'>
                  <div style="min-height:15px;width:100%;">
                    <el-table :data="tableData6" stripe border style="width: 100%">
                      <el-table-column fixed width="120" prop="projectName" label="项目">
                        <template slot-scope="scope">
                          <el-tag>{{scope.row.orderInfo.project.projectName}}</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column fixed width="120" label="订单名称">
                        <template slot-scope="scope">
                          <el-tag>{{scope.row.orderInfo.orderName}}</el-tag>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column width="120" label="贴花工序">
                        <template slot-scope="scope">
                          <el-tag>{{scope.row.orderInfo.techCard.tieHuaBuShu}}</el-tag>
                        </template>
                      </el-table-column> -->
                      <el-table-column width="120" align="left" prop="jingFengArea" label="精封面积">
                      </el-table-column>
                      <el-table-column width="120" align="left" prop="tieHuaArea" label="每道面积">
                      </el-table-column>
                      <el-table-column prop="wanChengArea" width="120" label="完成面积">
                      </el-table-column>
                      <el-table-column prop="zongJiArea" width="120" label="合计">
                      </el-table-column>
                      <el-table-column width="120" label="难度">
                        <template slot-scope="scope">
                          <el-tag v-for = "">{{scope.row.orderInfo.nanDuDengJi}}</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column width="120" label="皮纹代码">
                        <template slot-scope="scope">
                          <el-tag v-for = "wenli in scope.row.orderInfo.wenlis ">{{wenli.wenliName}}</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column width="120" align="left" label="经办">
                        <template slot-scope="scope">
                          <el-tag>{{scope.row.orderInfo.addUserName}}</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column width="160" align="left" label="完成日期">
                        <template slot-scope="scope">
                          <el-tag>{{scope.row.orderInfo.createTime | formatDateTime}}</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column width="160" align="left" label="下单时间">
                        <template slot-scope="scope">
                          <el-tag>{{scope.row.orderInfo.createTime | formatDateTime}}</el-tag>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <div class="block" style="float:right;margin-top:15px;">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 30, 80, 100]" :page-size="pagesize" layout="total,sizes, prev, pager, next, jumper" :total="totalnum">
                    </el-pagination>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      itemStaffId: '',
      currentPage: 1,
      totalnum: 0,
      pagesize: 10,
      filterText: "",
      tree_loading: false,
      tableData1: [],
      tableData6: [],
      data3: [],
      value1: {},
      value2: '',
      pickerOptions0: {
        disabledDate: (time) => {
          if (this.value2 != "") {
            return time.getTime() > Date.now() || time.getTime() > this.value2;
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      pickerOptions1: {
        disabledDate: (time) => {
          return time.getTime() < this.value1 || time.getTime() > Date.now();
        }
      },
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  methods: {
    handleSizeChange() {
      this.pagesize = val;
      this.handleNodeClick(this.itemStaffId);
    },
    handleCurrentChange() {
      this.currentPage = val;
      this.handleNodeClick(this.itemStaffId);
    },
    handleNodeClick(data) {
      let self = this
      let id = data.id
      if (id != this.itemStaffId) {
        this.currentPage = 1
        this.totalnum = 0
        this.pagesize = 10
      }
      this.itemStaffId = id;
      this.getRequest("/count/work/user/order/listbypage?page=" + this.currentPage + "&size=" + this.pagesize + "&userId=" + id
     + "&startTime=" + this.value1 +"&endTime=" +this.value2).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.tableData6 = resp.data.data.userordercount;
          this.totalnum = resp.data.data.count
        } else {
          self.tableData6 = [];
          self.currentPage = 1;
          self.totalnum = 0;
        }
      })
    },
    filterNode() {

    },
    getSummaries(param) {
      const {
        columns,
        data
      } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += ' 元';
        } else {
          sums[index] = 'N/A';
        }
      });
      return sums;
    },
    toChangeCheck() {

    },
    defaultProps() {

    },
    getHuiZong() {
      let self = this
      this.getRequest("/count/work/huizong").then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.tableData1 = resp.data.data.huizong;
        }
      })
    },
    getYgaTree() {
      let self = this
      this.getRequest("/config/mangers?role=ROLE_yga").then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          let users = resp.data.data
          let newData = [];
          for (var i = 0; i < users.length; i++) {
            let item = {
              id: '',
              label: ''
            }
            item.id = users[i].id
            item.label = users[i].name
            newData.push(item);
          }
          self.data3 = newData;
        }
      })
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      var nowDate = new Date();
      var nowDate2 = new Date();
      this.value1 = nowDate.setDate(1);
      this.value2 = nowDate2.getTime();
    })
    this.username = localStorage.getItem('cp_username');
    this.uid = localStorage.getItem('cp_uid');
    this.name = localStorage.getItem('cp_name');
    this.getHuiZong();
    this.getYgaTree();
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
