
<template>
<div>
  <div v-show="nowTab === 1">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>车间管理</el-breadcrumb-item>
        <el-breadcrumb-item>进行中订单列表</el-breadcrumb-item>
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
          <el-table-column label="质量总监">
            <template slot-scope="scope">
              <el-tag v-for="item in scope.row.qualityOrderUsers"  type="danger">{{item.userName}}</el-tag>
      </template>
          </el-table-column>
          <el-table-column label="工艺师">
            <template slot-scope="scope">
            <el-tag v-for="item in scope.row.orderUsers"  type="primary">{{item.userName}}</el-tag>
      </template>
          </el-table-column>
          <el-table-column label="当前步骤" prop="presentStepName">
            <template slot-scope="scope">
              <el-tag type="danger">{{scope.row.presentStepName}}</el-tag>
              </template>
          </el-table-column>
          <el-table-column label="已完成面积" prop="alreadyArea">
          </el-table-column>
          <el-table-column label="未完成面积" prop="stayArea">
          </el-table-column>
          <el-table-column label="进度">
            <template slot-scope="scope">
        <el-tag  type="info">{{scope.row.presentSchedule}}%</el-tag></template>
          </el-table-column>
          <el-table-column label="完工预期" prop="">
            <template slot-scope="scope">{{ scope.row.createTime | formatDateTime}}</template>
          </el-table-column>
          <el-table-column label="下单日期" prop="createTime">
            <template slot-scope="scope">{{ scope.row.createTime | formatDateTime}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                @click="tiaoZheng(scope.row)">调整</el-button>
            <el-button
              size="mini"
              type="warning"
              @click="toinfo(scope.row.id)">详情</el-button>
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

  <el-dialog title="订单分配详情" :visible.sync="dialogTableVisible">
    <el-table :data="orderUsers">
      <el-table-column property="orderName" label="订单名称"></el-table-column>
      <el-table-column property="biLi" label="分配比例">
        <template slot-scope="scope">
        <span>{{scope.row.biLi}}%</span>
        </template>
      </el-table-column>
      <el-table-column property="userName" label="工艺师"></el-table-column>
      <el-table-column property="zongJiArea" label="分配面积"></el-table-column>
      <el-table-column property="wanChengArea" label="已完成面积"></el-table-column>
      <el-table-column property="shengYuArea" label="未完成面积"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          @click="toJieSuan(scope.row)">结 算</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="border-top-style:dotted; border-bottom-style:dotted; margin-top: 40px;">
      <p> 流转面积：
        <el-tag type="success">{{itemTiaoZhen.liuZhuanArea}}</el-tag>
        流转比例：
        <el-tag type="success">{{itemTiaoZhen.liuZhuanBiLi}}%</el-tag>
      </p>
      <p> 重新分配面积比例：</p>
      <el-form :model="form" v-if="cxFenPei" label-width="30%" style="">
        <el-form-item label="选择工艺师:">
          <el-select v-model="itemYga" placeholder="请选工艺师">
            <el-option v-for="item in restaurants4" :key="item.value" :label="item.label" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面积比例:">
          <el-input-number v-model="form.biLi" controls-position="right" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="剩余贴花步数:">
          <el-input-number v-model="form.syTHBS" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button style="float:right" type="primary" @click="selectYga">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="Ygas" border style="width: 100%;margin-top:20px;" v-if="Ygas.length > 0">
      <el-table-column prop="orderNeedArea" label="产品总面积">
      </el-table-column>
      <el-table-column prop="userName" label="姓名">
      </el-table-column>
      <el-table-column prop="biLi" label="面积比例">
        <template slot-scope="scope">
          <el-tag type="danger">{{scope.row.biLi}}%</el-tag>
     </template>
      </el-table-column>
      <el-table-column prop="allTieHuaArea" label="贴花总面积">
      </el-table-column>
      <el-table-column prop="jingFengArea" label="精封面积">
      </el-table-column>
      <el-table-column prop="oneceTieHuaArea" label="每步贴花面积">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
<!-- <el-button type="text" size="small" @click.native.prevent="toEidtor(scope.$index, productData)">编辑</el-button> -->
<el-button @click.native.prevent="deleteRow(scope.$index, Ygas)" type="text" size="small">移除
</el-button>
</template>
    </el-table-column>
  </el-table>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="toFenPei">流转分配</el-button>
    <el-button @click="toQuXiao">取 消</el-button>
  </div>
</el-dialog>

</div>
</template>
<script>
export default {
  data() {
    return {
      restaurants2: [],
       state3: '',
      dialogTableVisible1:false,
      itemTiaoZhen: {
        liuZhuanBiLi: '0',
        liuZhuanArea: '0'
      },
      itemYga: {},
      cxFenPei: true,
      Ygas: [],
      restaurants4: [],
      form: {
        biLi: '',
        syTHBS: '1',
      },
      dialogTableVisible: false,
      orderUsers: [],
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    toQuXiao() {
      this.dialogTableVisible = false;
      this.Ygas = [];
      this.form = {
        biLi: '',
        syTHBS: '1',
      };
      this.itemYga = {};
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    toFenPei() {
      let self = this;
      if (this.Ygas.length == 0) {
        self.$message.error("至少分配一位工艺师");
        return
      }
      let params = {
        orderId: this.itemTiaoZhen.id,
        orderName: this.itemTiaoZhen.orderName,
        addUserId: this.uid,
        addUserName: this.name,
        ygas: this.Ygas,
      }
      this.jsonPostRequest("/plant/liu/zhuan", params).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.$message.success("重新分配完成");
          let liuZhuanBiLi = resp.data.data;
          let bili = parseInt(this.itemTiaoZhen.liuZhuanBiLi) - parseInt(liuZhuanBiLi);
          this.itemTiaoZhen.liuZhuanArea = bili * workArea / 100;
          this.itemTiaoZhen.liuZhuanBiLi = bili;
          // this.itemTiaoZhen.liuZhuanArea = 0;
          // this.itemTiaoZhen.liuZhuanBiLi = 0;
          this.toQuXiao();
        } else {
          self.$message.error("重新分配失败")
        }
      });
    },
    selectYga() {

      let item = this.itemYga;
      let itemYags = this.Ygas;
      let tieHuaBuShu = this.form.syTHBS
      let workArea = this.itemTiaoZhen.workArea
      let biLi = this.form.biLi
      if (biLi <= 0) {
        this.$message.error("分配比例不能为零")
        return;
      }
      if (biLi > this.itemTiaoZhen.liuZhuanBiLi) {
        this.$message.error("分配比例超出流转比例")
        return;
      }
      let yga = {
        userId: '',
        userName: '',
        biLi: '',
        allTieHuaArea: '',
        oneceTieHuaArea: '',
        jingFengArea: '',
        orderNeedArea: ''
      }

      if (itemYags.length > 0) {
        for (var i = 0; i < itemYags.length; i++) {
          if (itemYags[i].userId === item.value) {
            this.$message.error("该员工已添加")
            return;
          }
        }
        yga.userId = item.value;
        yga.userName = item.label;
        yga.biLi = biLi;
        yga.allTieHuaArea = workArea * 0.9 * biLi / 100
        yga.oneceTieHuaArea = workArea * 0.9 * biLi / (100 * tieHuaBuShu)
        yga.jingFengArea = workArea * 0.1 * biLi / 100
        yga.orderNeedArea = workArea
        this.Ygas.push(yga);
      } else {
        yga.userId = item.value;
        yga.userName = item.label;
        yga.biLi = biLi;
        yga.allTieHuaArea = workArea * 0.9 * biLi / 100
        yga.oneceTieHuaArea = workArea * 0.9 * biLi / (100 * tieHuaBuShu)
        yga.jingFengArea = workArea * 0.1 * biLi / 100
        yga.orderNeedArea = workArea
        this.Ygas.push(yga);
      }
      this.$message.success("添加成功")
      this.itemYga = {};
      this.form = {};
    },
    toJieSuan(item) {
      let zongJiArea = item.zongJiArea;
      let wanChengArea = item.wanChengArea;
      if (zongJiArea + '' === '' + wanChengArea) {
        this.$message.info("加工已完成，无需结算")
        return
      }
      this.$confirm('此操作将结算工艺师的加工面积, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.jieSuan(item);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    jieSuan(item) {
      this.postRequest("/plant/jie/suan", item).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          let liuZhuanBiLi = resp.data.data;
          this.cxFenPei = true;
          this.tiaoZheng(this.itemTiaoZhen);
          let workArea = this.itemTiaoZhen.workArea;
          let bili = parseInt(liuZhuanBiLi) + parseInt(this.itemTiaoZhen.liuZhuanBiLi);
          this.itemTiaoZhen.liuZhuanArea = bili * workArea / 100;
          this.itemTiaoZhen.liuZhuanBiLi = bili;
          this.$message.success("结算成功");
        } else {
          this.$message.error("结算失败");
        }
      })
    },
    tiaoZheng(item) {
      this.itemTiaoZhen = item;
      let id = item.id;
      this.getRequest("/plant/users?status=0&orderId=" + id).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.orderUsers = resp.data.data.orderusers;
          this.dialogTableVisible = true;
          this.loadAllYuanGongA();
        }
      })
    },
    loadAllYuanGongA() {
      let self = this
      this.getRequest("/config/mangers?role=ROLE_yga").then(resp => {
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
      this.getRequest("/plant/new/order?page=" + this.currentPage + "&size=" + this.pagesize + "&userId=" + this.uid + "&plantStatus=1").then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {

          _this.tableData = resp.data.data.orderlist
          //  console.log(_this.tableData);
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
