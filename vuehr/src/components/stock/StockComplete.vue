<template>
<div>
  <div>
    <div class="crumbs" >
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>备料管理</el-breadcrumb-item>
        <el-breadcrumb-item>已完成</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center;margin-top:30px;">
        <div class="handle-box">
          <!-- <el-button type="primary" icon="plus" class="mr10" @click="">增添商务报价</el-button> -->
          <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" icon="search"></el-input>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px;margin-top:20px;">
        <div>
          <el-table :data="data" style="width: 100%">
            <el-table-column prop="orderName" label="产品名称">
            </el-table-column>
            <el-table-column prop="wuLiaoName" label="纹理编号">
            </el-table-column>
            <el-table-column prop="wuLiaoNum" label="数量(张)">
            </el-table-column>
            <el-table-column prop="liaoJiang" label="料浆">
            </el-table-column>
            <el-table-column prop="addUserName" label="下单人">
            </el-table-column>
            <el-table-column prop="status" label="备料进度">
              <template slot-scope="scope">
        <el-tag v-if="scope.row.status+'' === '0'" >待备料</el-tag>
        <el-tag v-if="scope.row.status+'' === '1'" type="danger">待领取</el-tag>
        <el-tag v-if="scope.row.status+'' === '2'" type="warning">完成</el-tag>
        </template>
            </el-table-column>
            <el-table-column prop="createTime" label="下单时间">
            </el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="wancheng(scope.row)">详情</el-button>
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
</div>
</template>
<script>
export default {
  data() {
    return {
      username: '',
      name: '',
      uid: '',
      showTab: 1,
      tableLoading: false,
      currentPage: 1,
      totalnum: 0,
      pagesize: 10,
      select_word: '',
      tableData: []
    }
  },
  methods: {
    toadd() {
      this.$router.push('/offer/per/add')
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
    wancheng(item) {
      let self = this
      let params = {
        wuLiaoId:item.id,
        status:1
      }
      this.postRequest("/stock/manager/finish", params).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.$message.success("操作成功");
          self.getCollectMouldList();
        }else {
          self.$message.error("操作失败");
        }
      })
    },
    // 获取订单列表
    getCollectMouldList() {
      let _this = this
      this.getRequest("/stock/manager/listbypage?page=" + this.currentPage + "&size=" + this.pagesize +"&status=2").then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          _this.tableData = resp.data.data.wuliaolist
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
