<template>
<div>
  <div v-show="nowTab === 1">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>收模管理</el-breadcrumb-item>
        <el-breadcrumb-item>拆模记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center;margin-top:20px;">
        <div class="handle-box">
          <el-button type="primary" icon="plus" class="mr10" @click="toAddMouldRecord">增添拆模记录</el-button>
          <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" icon="search"></el-input>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <el-table :data="data" stripe v-loading="tableLoading">
          <el-table-column align="center" prop="mouldName" label="模具名称">
            <template slot-scope="scope">
              <span>{{scope.row.mouldInfo.mouldName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="mouldNum" label="数量">
            <template slot-scope="scope">
              <span>{{scope.row.mouldInfo.mouldNum}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="收模时间">
            <template slot-scope="scope">
              <span>{{scope.row.mouldInfo.createTime | formatDateTime}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="addUserName" label="拆模人">
          </el-table-column>
          <el-table-column align="center" prop="remark" label="备注">
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
      <el-button
        size="mini"
        type="primary"
        @click="toGetAllInfo(scope.row)">查看详情</el-button>
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
  <!-- 添加表单 -->
  <div style="width:100%;float:right;" v-show="nowTab==2">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>收模管理</el-breadcrumb-item>
        <el-breadcrumb-item>拆模记录</el-breadcrumb-item>
        <el-breadcrumb-item>拆模详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card class="box-card" style="margin-top:25px;">
      <div slot="header" class="clearfix">
        <span>拆模基础信息</span>
      </div>
      <div>
        <div class="form-box">
          <el-form ref="exfrom" :model="exfrom" :rules="rules" label-width="120px">
            <el-form-item label="模具名称：" required v-show="!update_disable">
              <el-input placeholder="请输入内容(模具名称或收模人姓名)" v-model="select_mould_word" style="width:30%" class="input-with-select">
                <el-select slot="prepend" v-model="selectedM" style="width: 130px;"placeholder="请选择">
                  <el-option v-for="item in moulds" :key="item.value" :label="item.label" :value="item"></el-option>
                </el-select>
                <el-button slot="append" @click="toSelect" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="模具收模信息：">
              <div style="border: 1px dashed #d9d9d9;width:40%;min-height:128px;" v-show="!update_disable">
                <el-form-item label="模具数量："  style="margin-top:10px;">
                  <el-input-number placeholder="请输入模具数量"  v-model="selectedM.num" controls-position="right" @change="handleChange" :min="0" :disabled="true"></el-input-number>
                </el-form-item>
                <el-form-item label="收模时间："  style="margin-top:10px;">
                  <el-date-picker v-model="selectedM.time" :disabled="true" style="width:50%" format="yyyy 年 MM 月 dd 日 HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              </div>
              <div style="border: 1px dashed #d9d9d9;width:40%;min-height:128px;" v-if="update_disable">
                <el-form-item label="模具名称："  style="margin-top:10px;">
                  <span>{{update_mould_name}}</span>
                </el-form-item>
                <el-form-item label="模具数量："  style="margin-top:10px;">
                  <el-input-number placeholder="请输入模具数量"  v-model="selectedM.num" controls-position="right" @change="handleChange" :min="0" :disabled="true"></el-input-number>
                </el-form-item>
                <el-form-item label="收模时间："  style="margin-top:10px;">
                  <el-date-picker v-model="selectedM.time" :disabled="true" style="width:50%" format="yyyy 年 MM 月 dd 日 HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="蚀纹镶块：" prop="youSiWenNum">
              <el-input-number v-model="exfrom.youSiWenNum" controls-position="right" @change="handleChange" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="无蚀纹镶块：" prop="wuSiWenNum">
              <el-input-number v-model="exfrom.wuSiWenNum" controls-position="right" @change="handleChange" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input style="width:28%" type="textarea" v-model="exfrom.remark"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="card-bottom">
        <el-button type="primary" v-if="!update_disable" @click="submitForm('exfrom')">确 定</el-button>
        <el-button type="primary" v-if="update_disable" @click="toUpdate('exfrom')">修 改</el-button>
        <el-button @click="goBack">取 消</el-button>
      </div>
    </el-card>
  </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      update_mould_name: '',
      update_disable: false,
      username: '',
      uid: '',
      name:'',
      nowTab: 1,
      select_mould_word: '',
      select_mould:'',
      selectedM:{
        num:0,
        time:'',
        value:'',
        label:''
      },
      moulds: [],
      currentPage: 1,
      totalnum: 0,
      pagesize: 10,
      select_word: '',
      tableData: [],
      tableLoading: false,
      exfrom: {
        addUserId: '',
        mouldId:'',
        addUserName: '0',
        youSiWenNum: '0',
        wuSiWenNum: '0',
        remark: ''
      },
      // 上部分
      rules: {
        mouldName: [{
            required: true,
            message: '请输入模具名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 1 到 255 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    toUpdate(formName){
      let self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          self.exfrom.mouldId = this.selectedM.value;
          this.putRequest("/shou/cai/update", self.exfrom).then(resp => {
            if (resp && resp.status == 200 && resp.data.code == 0) {
              var id = resp.data.data.id;
              this.tableLoading = true;
              this.$message.success("修改成功")
              this.nowTab = 1;
              this.resetForm('exfrom');
              this.selectedM = {};
              this.getCollectMouldList();

            }else{
              this.$message.error("修改失败")
            }
          })
        } else {
          return false;
        }
      });
    },
    goBack(){
      this.nowTab = 1;
      this.update_disable = false;
    },
    toGetAllInfo(item){
      this.update_disable = true
        this.exfrom.mouldId= item.mouldId,
        this.exfrom.id=item.id,
        this.exfrom.youSiWenNum=item.youSiWenNum,
        this.exfrom.wuSiWenNum= item.wuSiWenNum,
        this.exfrom.remark= item.remark
      if(item.mouldInfo.mouldNum+"" == "" ){
        this.selectedM.num= 0
      }else{
        this.selectedM.num = item.mouldInfo.mouldNum+'';
      }
      this.selectedM.time = item.mouldInfo.createTime;
      this.selectedM.value = item.mouldInfo.id;
      this.update_mould_name = item.mouldInfo.mouldName;
      this.nowTab = 2
    },
    toSelect() {
      let self = this;
      if(self.select_mould_word == ""){
        self.$message.error("请输入模具名称或添加人姓名")
      }
      this.getRequest("/shou/mo/select?mouldName="+ self.select_mould_word +"&addUserName="+self.select_mould_word).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
              self.$message.success("查找成功，请左侧点击选择")
              let re = resp.data.data
              let item = []
              for (var i = 0; i < re.length; i++) {
                  let elem = {
                      label: '',
                      value: '',
                      time: '',
                      num:''
                  }
                  elem.label = re[i].mouldName
                  elem.value = re[i].id
                  elem.num = re[i].mouldNum
                  elem.time = re[i].createTime
                  item.push(elem);
              }
              self.moulds = item;
          } else {
              self.$message.success("信息不存在")
          }
      });
    },
    loadAllProject() {
        let self = this
        this.getRequest("/shou/mo/get/byday").then(resp => {
          if (resp && resp.status == 200 && resp.data.code == 0) {
                let item = []
                let re = resp.data.data
                for (var i = 0; i < re.length; i++) {
                    let elem = {
                        label: '',
                        value: '',
                        time: '',
                        num:''
                    }
                    elem.label = re[i].mouldName
                    elem.value = re[i].id
                    elem.num = re[i].mouldNum
                    elem.time = re[i].createTime
                    item.push(elem);
                }
                self.moulds = item;
            } else {
                console.log("获取列表数据失败");
            }
        });
    },
    toAddMouldRecord() {
      this.nowTab = 2;
      this.loadAllProject();
    },
    delMouldRecord(pkGuid) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.toDelPartInfo(pkGuid);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 添加收模单
    submitForm(formName) {
      let self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          self.exfrom.addUserId = this.uid;
          self.exfrom.addUserName = this.name;
          self.exfrom.mouldId = this.selectedM.value;
          this.putRequest("/shou/cai/create", self.exfrom).then(resp => {
            if (resp && resp.status == 200 && resp.data.code == 0) {
              var id = resp.data.data.id;
              this.tableLoading = true;
              this.$message.success("添加成功")
              this.nowTab = 1;
              this.resetForm('exfrom');
              this.selectedM = {};
              this.getCollectMouldList();

            }else{
              this.$message.success("添加失败")
            }
          })
        } else {
          return false;
        }
      });
    },
    handleChange(value) {},
    handleSizeChange(val) {
      this.pagesize = val;
      this.getCollectMouldList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCollectMouldList();
    },
    // 获取收模列表
    getCollectMouldList() {
      let _this = this
      this.getRequest("/shou/cai/listbypage?page=" + this.currentPage + "&size=" + this.pagesize).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          _this.tableData = resp.data.data.caiMoList
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
        if (d.addUserName.indexOf(self.select_word) > -1
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
