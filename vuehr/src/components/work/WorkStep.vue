<template>
<div>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-share"></i>车间管理</el-breadcrumb-item>
        <el-breadcrumb-item>步骤管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <!-- 添加订单基础信息 -->
        <div>
          <el-card class="box-card" style="margin-top:25px;">
            <div slot="header" class="clearfix">
              <span>已有步骤</span>
            </div>
            <div>
              <el-row :gutter="20">
                <el-col :span="6">
                  <div @click="addbuzhou">
                    <el-card style="min-height:121px;" class="mould-card">
                      <div style="padding: 14px;">
                        <img class="image">
                        <i class="el-icon-plus">新增步骤</i>
                      </div>
                    </el-card>
                  </div>
                </el-col>
                <el-col :span="6" v-for=" step in steps">
                  <el-card :body-style="{ padding: '0px' }" class="mould-card">
                    <div style="padding: 14px;">
                      <h4>{{step.stepName}}</h4>
                      <h5>添加人:{{step.addUserName}}</h5>
                      <div v-show="step.isCheck === false">
                        <h6>无需审核</h6></div>
                      <div v-show="step.isCheck === true">
                        <h6>需要审核</h6></div>
                      <div class="bottom clearfix">
                        <p class="time">说明：{{step.remark}}</p>
                        <el-dropdown style="float: right;color: #409EFF;">
                          <span class="el-dropdown-link"><i class="el-icon-edit"></i>
                                            </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                              <el-button type="text" @click="del(step.id)">删 除</el-button>
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
  <el-dialog title="添加步骤" v-loading="checkLoading" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="dialogFormVisible" width='50%'>
    <div class="form-box">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="步骤名称" prop="stepName">
          <el-input v-model="form.stepName" placeholder="请输入步骤名称" style="width:30%"></el-input>
        </el-form-item>
        <el-form-item label="质量审查">
          <el-switch v-model="form.isCheck"></el-switch>
        </el-form-item>
        <el-form-item label="商务监察">
          <el-switch v-model="form.isBusRemark"></el-switch>
        </el-form-item>
        <el-form-item label="说明">
          <el-input type="textarea" v-model="form.remark" style="width:50%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button style="float:right" type="primary" @click="submitForm('form')">提 交</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </div>
  </el-dialog>
</div>
</template>
<script>
export default {
  props: {
    title: String
  },
  data() {
    return {
      dialogFormVisible: false,
      checkLoading: false,
      steps: [],
      username: '',
      name: '',
      uid: '',
      form: {
        isCheck: true,
        isBusRemark: false
      },

      rules: {
        stepName: [{
            required: true,
            message: '请输入步骤名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 0 到 255 个字符',
            trigger: 'blur'
          }
        ]
      },
    }
  },
  methods: {
    // 添加步骤
    submitForm(formName) {
      let self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          self.checkLoading = true;
          self.form.addUserId = this.uid;
          self.form.addUserName = this.name;
          this.postRequest("/work/step/add", self.form).then(resp => {
            self.checkLoading = false;
            if (resp && resp.status == 200 && resp.data.code == 0) {
              self.$message.success("添加成功");
              self.dialogFormVisible = false;
              self.loadAllSteps();
            } else {
              self.$message.error('添加失败');
            }
          })
        } else {
          return false;
        }
      });
    },
    addbuzhou() {
      this.dialogFormVisible = true;
    },
    loadAllSteps() {
      let self = this
      this.getRequest("/work/step/list?").then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.steps = resp.data.data.steplist
        } else {
          console.log("获取列表数据失败");
        }
      });
    },
    del(id) {
      this.$confirm('此操作将永久删除该步骤, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.todel(id);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    todel(id) {
      let self = this
      this.getRequest("/work/step/del?id=" + id).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.$message.success("删除成功")
          self.loadAllSteps();
        } else {
          self.$message.error("删除失败")
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted: function() {
    this.username = localStorage.getItem('cp_username');
    this.uid = localStorage.getItem('cp_uid');
    this.name = localStorage.getItem('cp_name');
    this.loadAllSteps();
  }
}
</script>
