
<template>
<div>
  <div v-show="nowTab === 1">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>主机厂管理</el-breadcrumb-item>
        <el-breadcrumb-item>主机厂列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center;margin-top:20px;">
        <div class="handle-box">
          <el-button type="primary" icon="plus" class="mr10" @click="toadd()">添加主机厂</el-button>
          <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" icon="search"></el-input>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <el-table :data="data" stripe style="width: 100%" v-loading="tableLoading">
            <el-table-column prop="name" label="主机厂名称">
            </el-table-column>
            <el-table-column prop="addUserName" label="添加人">
            </el-table-column>
            <el-table-column label="创建时间">
                <template slot-scope="scope">
                <span><i class="el-icon-time"></i>{{scope.row.createTime}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="toupdate(scope.row)">编辑</el-button>
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
  <el-dialog title="主机厂信息" :visible.sync="dialogFormVisible" width='40%'>
      <div class="form-box">
          <el-form ref="enginefrom" :model="enginefrom" :rules="rules" label-width="120px">
              <el-form-item label="主机厂名称:" prop="name">
                  <el-input placeholder="请输入项目名称" v-model="enginefrom.name"></el-input>
              </el-form-item>
              <el-form-item label="备注：" prop="remark">
                  <el-input type="textarea" v-model="enginefrom.remark"></el-input>
              </el-form-item>
          </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button v-if="!this.updateflag" type="primary" :disabled="this.addloading" @click="toCheckEngineName">确 定</el-button>
          <el-button v-if="this.updateflag" type="primary" :disabled="this.addloading" @click="toCheckEngineName">更 新</el-button>
          <el-button @click="toQuxiao">取 消</el-button>
      </div>
  </el-dialog>
</div>
</template>
<script>
export default {
  data() {
    return {
      updateflag:false,
      tableLoading2: false,
      dialogFormVisible2: false,
      kaiPiao:{
        projectId:'',
        projectName:''
      },
      orderList:[],
      itemProject:{
        yuBaoJia:{
          audit:''
        },
        businessBaoJia:{
          audit:''
        }
      },
      nowTab: 1,
      username:'',
      name:'',
      uid:'',
      tableLoading: false,
      addloading: false,
      dialogFormVisible: false,
      enginefrom:{
        name:'',
          remark:'',
        addUserId:'',
        addUserName:''
      },
      currentPage: 1,
      itemKaiPiao:{},
      totalnum: 0,
      pagesize: 10,
      select_word: '',
      tableData: [],
      businessBaoJiaInfo:{},
      yuBaoJiaInfo:{},
      // 上部分
      rules: {
        name: [{
            required: true,
            message: '请输入主机厂名称',
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
    toupdate(item){
      this.dialogFormVisible = true;
      this.enginefrom = item;
      this.updateflag = true;
      this.addloading = false;
    },
    toadd(){
      this.dialogFormVisible = true;
      this.addloading = false;
    },
    toQuxiao(){
      this.enginefrom = {
        name:'',
          remark:'',
        addUserId:'',
        addUserName:''
      },
      this.updateflag = false;
      this.dialogFormVisible = false;
    },
    toCheckEngineName(){
      let name = this.enginefrom.name;
      if(name == 'undefined' || name.length == 0){
        this.$message.error("请输入主机厂名称");
        return
      }
      let data = {
        name : name
      }
      this.postRequest("/engine/checkEngineName", data).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          let engine = resp.data.data.engine;
          if(engine === ''){
            this.addloading = true;
            if(this.updateflag){
              this.updateEngine('enginefrom')
            }else{
              this.addEngine('enginefrom')
            }
          }else{
            this.$message.error("主机厂名称已存在，无需重复添加")
          }
        }else{
          this.$message.error("主机厂名称已存在，无需重复添加")
        }
      })
    },
    updateEngine(formName){
      let self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          self.enginefrom.updateUserId=self.uid
          self.enginefrom.updateUserName = self.name
          this.postRequest("/engine/updateEngine", self.enginefrom).then(resp => {
            this.dialogFormVisible = false;
            if (resp && resp.status == 200 && resp.data.code == 0) {
              this.$message.success("修改成功")
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
    addEngine(formName){
      let self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          self.enginefrom.addUserId = self.uid;
          self.enginefrom.addUserName = self.name;
          this.postRequest("/engine/addEngine", self.enginefrom).then(resp => {
            this.tableLoading = true;
            if (resp && resp.status == 200 && resp.data.code == 0) {
              this.dialogFormVisible = false;
              this.$message.success("添加成功")
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
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getCollectMouldList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCollectMouldList();
    },
    // 获取项目列表
    getCollectMouldList() {
      let _this = this
      this.getRequest("/engine/listbypage?page=" + this.currentPage + "&size=" + this.pagesize).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          _this.tableData = resp.data.data.enginelist
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
        if (d.name.indexOf(self.select_word) > -1 ||
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
