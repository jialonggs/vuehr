
<template>
<div>
  <div v-show="nowTab === 1">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>财务管理</el-breadcrumb-item>
        <el-breadcrumb-item>已结款列表</el-breadcrumb-item>
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
        <el-table :data="tableData" stripe style="width: 100%" v-loading="tableLoading">
          <el-table-column label="项目名称" prop="projectName">
          </el-table-column>
          <el-table-column label="项目编号" prop="id">
          </el-table-column>
          <el-table-column label="付款状态" prop="financeStatus">
            <template slot-scope="scope">
        <el-tag v-if="scope.row.financeStatus+'' === '0'" >待审查</el-tag>
        <el-tag v-if="scope.row.financeStatus+'' === '1'" type="danger">未付款</el-tag>
        <el-tag v-if="scope.row.financeStatus+'' === '2'" type="info">部分付款</el-tag>
        <el-tag v-if="scope.row.financeStatus+'' === '3'" type="success">已全款</el-tag>
      </template>
          </el-table-column>
          <el-table-column label="已付款比例" prop="financeBiLi">
              <template slot-scope="scope">{{ scope.row.financeBiLi}}%</template>
          </el-table-column>
          <el-table-column label="已付款金额" prop="financeJinE">
          </el-table-column>
          <el-table-column label="到款时间" prop="createTime">
            <template  slot-scope="scope" >
              <el-tag v-if="scope.row.financeTime+'' ==='' || scope.row.financeTime+'' ==='null'" >--</el-tag>
              <span v-if="scope.row.financeTime+'' !=='' && scope.row.financeTime+'' !=='null'">{{ scope.row.financeTime | formatDateTime}}</span></template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime">
            <template slot-scope="scope">{{ scope.row.createTime | formatDateTime}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <!-- <template slot-scope="scope">
            <el-button
                size="mini"
                type="warning"
                @click="">详情</el-button>
          </template> -->
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <div class="block" style="float:right;margin-top:15px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 30, 80, 100]" :page-size="pagesize" layout="total,sizes, prev, pager, next, jumper" :total="totalnum">
      </el-pagination>
    </div>
  </div>
  <!-- 付款详情 -->
  <el-dialog title="付款详情" :visible.sync="dialogFormVisible" width='40%'  v-loading="tableLoading">
    <div class="form-box">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" >
        <el-form-item prop="financeJinE" label="付款金额：">
          <el-input  v-model="form.financeJinE"></el-input>
        </el-form-item>
        <el-form-item prop="financeBiLi" label="付款比例：">
          <el-input  v-model="form.financeBiLi"></el-input>
        </el-form-item>
        <el-form-item label="到款时间：" prop="financeTime" >
          <el-date-picker   style="width:40%" format="yyyy 年 MM 月 dd 日 HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="form.financeTime" type="datetime" placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注：" prop="financeRemark">
          <el-input type="textarea" v-model="form.financeRemark"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="isFuKuan">确 认</el-button>
      <el-button type="danger" @click="dialogFormVisible=false">取 消</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
export default {
  data() {
    return {
      form:{
        financeRemark: ''
      },
      dialogFormVisible: false,
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
      itemOrder:{},
      tableLoading: false,
      rules:{
        financeBiLi: [{
            required: true,
            message: '请输入付款比例',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 0 到 255 个字符',
            trigger: 'blur'
          }
        ],
        financeJinE: [{
            required: true,
            message: '请输入付款金额',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 0 到 255 个字符',
            trigger: 'blur'
          }
        ],
      }
    }
  },
  methods: {
    toWeiFuKuan(item) {
      this.$confirm('此订单确定未付款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isWeiFuKuan(item);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    isWeiFuKuan(item){
      let params = {
        financeStatus: 1,
        projectId:item.id
      }
      this.postRequest("/finance/auth/unpay", params).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.$message.success("执行成功");
          this.getCollectMouldList();
        }else{
          this.$message.error("执行失败");
        }
      })
    },
    isFuKuan() {
      this.$confirm('是否确认提交付款信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tofukuan();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    toShenHe(item){
      this.dialogFormVisible = true;
      this.itemOrder = item;
      this.form = {};
    },
    tofukuan(){
      let _this = this;
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.projectId = this.itemOrder.id;
          _this.tableLoading = true;
          this.jsonPostRequest("/finance/auth/add", this.form).then(resp => {
            _this.tableLoading = false;
            if (resp && resp.status == 200 && resp.data.code == 0) {
              this.$message.success("添加成功")
              this.dialogFormVisible = false;
              this.getCollectMouldList();
            }else{
              this.$message.error("添加失败")
            }
          })
        } else {
          return false;
        }
      });
    },
    toinfo(id) {
      this.$router.push('/order/info/' + id)
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
      this.getRequest("/finance/auth/listbypage?page=" + this.currentPage + "&size=" + this.pagesize +"&financeStatus=3").then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          _this.tableData = resp.data.data.putorderlist
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
