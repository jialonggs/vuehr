
<template>
<div>
  <div v-show="nowTab === 1">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>车间管理</el-breadcrumb-item>
        <el-breadcrumb-item>待分配订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center;margin-top:20px;">
        <div class="handle-box">
          <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" icon="search"></el-input>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <el-table :data="data" stripe style="width: 100%" v-loading="tableLoading">
          <el-table-column label="产品名称" prop="orderName">
          </el-table-column>
          <el-table-column label="项目名称">
            <template slot-scope="scope">
                <span>{{scope.row.project.projectName}}</span>
      </template>
          </el-table-column>
          <el-table-column label="单位名称">
            <template slot-scope="scope">
              <span>{{scope.row.project.processUnit.clientCompanyName}}</span>
      </template>
          </el-table-column>
          <el-table-column label="经办人" prop="addUserName">
          </el-table-column>
          <el-table-column label="纹理代码" >
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
          <el-table-column label="工艺卡状态">
            <template slot-scope="scope">
              <el-tag v-if="!scope.row.techId"  type="danger">未提交</el-tag>
              <el-tag v-if="scope.row.techId" type="primary">已提交</el-tag>
      </template>
          </el-table-column>
          <el-table-column label="加工面积" prop="workArea">
          </el-table-column>
          <el-table-column label="难度等级" prop="nanDuDengJi">
          </el-table-column>
          <el-table-column label="完工预期" prop="">
            <template slot-scope="scope">{{ scope.row.expectedTime | formatDate}}</template>
          </el-table-column>
          <el-table-column label="下单日期" prop="createTime">
            <template slot-scope="scope">{{ scope.row.createTime | formatDateTime}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- <el-button
                v-if="scope.row.nanDuDengJi+'' === '待设定'"
                size="mini"
                type="warning"
                @click="toNanDu(scope.row)">难度</el-button> -->
            <el-button
              <el-button
                size="mini"
                type="danger"
                @click="toinfo(scope.row.id)">详情</el-button>
            <el-button
            v-if="scope.row.techId && scope.row.nanDuDengJi+'' !== '待设定'"
              size="mini"
              type="danger"
              @click="toinfo(scope.row.id)">加工分配</el-button>
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
  <!-- Form -->
<el-dialog title="提交订单难度等级" :visible.sync="dialogFormVisible" v-loading="tableLoading">
  <el-form :model="form">
    <el-form-item label="难度等级：">
      <el-input v-model="form.nanDuDengJi" auto-complete="off" ></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="nanDu">确 定</el-button>
  </div>
</el-dialog>
</div>
</template>
<script>
export default {
  data() {
    return {
      form:{},
      itemOrder:{},
      nowTab: 1,
      username: '',
      name: '',
      uid: '',
      dialogFormVisible: false,
      tableLoading: false,
      currentPage: 1,
      totalnum: 0,
      pagesize: 10,
      select_word: '',
      tableData: []
    }
  },
  methods: {
    toNanDu(item){
      this.dialogFormVisible = true;
      this.itemOrder = item
      this.form = {};
    },
    nanDu(){
      let params = {
        nanDuDengJi: this.form.nanDuDengJi,
        orderId: this.itemOrder.id
      }
      this.tableLoading = true
      this.postRequest("/plant/nan/du", params).then(resp => {
        this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.$message.success("设置成功")
          this.itemOrder.nanDuDengJi = this.form.nanDuDengJi
          this.dialogFormVisible = false;
        }else {
          this.$message.error("设置失败")
        }
      })
    },
    toinfo(id) {
      this.$router.push('/plant/order/info/' + id)
    },
    toadd() {
      this.$router.push('/order/add')
    },
    // 重置
    handleSizeChange(val) {
      this.pagesize = val;
      this.getCollectMouldList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCollectMouldList();
    },
    // 获取订单列表
    getCollectMouldList() {
      let _this = this
      this.getRequest("/plant/new/order?page=" + this.currentPage + "&size=" + this.pagesize +"&userId=" +this.uid + "&plantStatus=0").then(resp => {
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
