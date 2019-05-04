<template>
<div>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>物料单管理</el-breadcrumb-item>
        <el-breadcrumb-item>下物料单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>

      <el-main style="padding-left: 0px;padding-top: 0px;margin-top:20px;">
        <div>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>物料单信息</span>
            </div>
            <div v-loading="addLoading">
              <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="所属订单：" prop="orderId">
                  <el-select v-model='itemOrder' placeholder="请选择所属订单" required>
                    <el-option v-for="item in restaurants3" :key="item.value" :label="item.label" :value="item"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="纹理编号：" prop="wuLiaoName">
                  <el-input v-model="form.wuLiaoName" style="width:40%"></el-input>
                </el-form-item>
                <el-form-item label="花纹层次：" prop="wenliChengCi">
                  <el-input v-model="form.wenliChengCi" style="width:40%"></el-input>
                </el-form-item>
                <el-form-item label="数量：" prop="wuLiaoNum">
                  <el-input-number v-model="form.wuLiaoNum" controls-position="right" @change="handleChange" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="料浆：" prop="liaoJiang">
                  <el-input v-model="form.liaoJiang" style="width:40%"></el-input>
                </el-form-item>
                <el-form-item label="送单时间：" prop="songTime">
                  <el-date-picker   style="width:40%" format="yyyy 年 MM 月 dd 日 HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="form.songTime" type="datetime" placeholder="选择日期时间">
                  </el-date-picker>
                  <!-- <el-input v-model="form.songTime" style="width:40%"></el-input> -->
                </el-form-item>
                <el-form-item label="印料时间：" prop="yinTime">
                  <el-date-picker   style="width:40%" format="yyyy 年 MM 月 dd 日 HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="form.yinTime" type="datetime" placeholder="选择日期时间">
                  </el-date-picker>
                  <!-- <el-input v-model="form.yinTime" style="width:40%"></el-input> -->
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input type="textarea" v-model="form.remark" style="width:40%"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="card-bottom">
              <el-button type="primary" @click="addWuLiao('form')">提 交</el-button>
              <el-button @click="resetForm('form')">重置</el-button>
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>
    <!-- 身份认证-->
    <!-- <el-dialog title="员工身份认证" v-loading="checkLoading" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="dialogFormVisible" width='50%'>
      <div class="form-box">
        <el-form ref="reform" :model="reform" label-width="110px">
          <el-form-item label="认证账号：">
            <el-input v-model="reform.username"></el-input>
          </el-form-item>
          <el-form-item label="认证密码：">
            <el-input v-model="reform.password"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkUserInfo">提 交</el-button>
      </div>
    </el-dialog> -->
  </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      addLoading: false,
      dialogFormVisible: true,
      checkLoading: false,
      itemOrder:{},
      restaurants3: [],
      itemUser: {
        userId: '',
        userName: ''
      },
      reform: {},
      form: {
        orderId: '',
        wuLiaoNum: '1',
        wuLiaoName: '',
        wenliChengCi: '',
        liaoJiang:'',
        remark: '',
        songTime: new Date(),
        yinTime: new Date()
      },
      rules: {
        wuLiaoName: [{
            required: true,
            message: '请输入订单名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 0 到 255 个字符',
            trigger: 'blur'
          }
        ],
        wenliChengCi: [{
            required: true,
            message: '请输入纹理层次',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 0 到 255 个字符',
            trigger: 'blur'
          }
        ],
        liaoJiang: [{
          required: true,
          message: '请输入浆料',
          trigger: 'blur'
          }
        ],
        // orderId: [{
        //   required: true,
        //   message: 'qing',
        //   trigger: 'blur'
        //   }
        // ],
        songTime: [{
          required: true,
          message: '请输入送单时间',
          trigger: 'blur'
          }
        ],
        yinTime: [{
          required: true,
          message: '请输入印花时间',
          trigger: 'blur'
          }
        ]
      }
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
    checkUserInfo() {
      let _this = this
      _this.checkLoading = true;
      this.postRequest('/login', _this.reform).then(resp => {
        _this.checkLoading = false
        if (resp && resp.status == 200) {
          _this.dialogFormVisible = false;
          _this.itemUser.userId = resp.data.msg.id;
          _this.itemUser.userName = resp.data.msg.name;
          this.getOrderList();
        } else {
          _this.$message.error("验证失败,请重新验证");
        }
      })
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
    },
    // 获取订单列表
    addWuLiao(formName) {
      let self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {

          self.form.addUserId = this.uid;
          self.form.addUserName = this.name;
          self.form.orderName = this.itemOrder.label;
          self.form.orderId = this.itemOrder.value;
          if(self.form.orderId+'' === '' || self.form.orderId+''==='undefined'){
            self.$message.error("请选择有效的订单!")
            return;
          }
          self.addLoading = true;
          this.postRequest("/material/apply", self.form).then(resp => {
            self.addLoading = false;
            if (resp && resp.status == 200 && resp.data.code == 0) {
              self.$message.success("添加成功");
              self.resetForm('form')
            }else{
              self.$message.error("添加失败");
            }
          })
        } else {
          console.log('提交数据格式有误');
          return false;
        }
      });

    },
    handleChange(value) {},
    // 获取所有订单
    getOrderList() {
      let self = this
      this.getRequest("/material/apply/order/list?userId=" + self.uid).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          let item = []
          let re = resp.data.data
          for (var i = 0; i < re.length; i++) {
            let elem = {
              label: '',
              value: ''
            }
            elem.label = re[i].orderName
            elem.value = re[i].orderId
            item.push(elem);
          }
          self.restaurants3 = item;
        } else {
          console.log("获取列表数据失败");
        }
      });
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableLoading = true;
    })
    this.username = localStorage.getItem('cp_username');
    this.uid = localStorage.getItem('cp_uid');
    this.name = localStorage.getItem('cp_name');
    this.getOrderList();
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
