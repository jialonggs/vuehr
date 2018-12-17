<template>
<div>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-share"></i>工序管理</el-breadcrumb-item>
        <el-breadcrumb-item>流程管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container style="margin-top:30px;">
      <el-main style="padding-left: 0px;padding-top: 0px">
        <!-- 添加订单基础信息 -->
        <div>
          <div>
            <el-button type="primary" @click="dialogFormVisible=false"><i class="el-icon-document"></i>默认流程</el-button>
            <el-button @click="zidingyi"><i class="el-icon-edit"></i>自定义流程</el-button>
          </div>
          <!-- <span>默认流程</span> -->
          <el-card v-for="item in morens" class="box-card" style="margin-top:15px;">
            <el-dropdown>
              <span class="el-dropdown-link"><i class="el-icon-setting"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>详情</el-dropdown-item>
                <el-dropdown-item>删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span>{{item.flowName}}</span>
            <el-steps align-center>
              <el-step v-for="step in item.stepslist" :title="step.stepName" :description="step.remark"></el-step>
            </el-steps>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
  <el-dialog title="自定义流程" v-loading="checkLoading" :show-close="true" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="dialogFormVisible" width='70%'>
    <div class="form-box">
      <el-card class="box-card" style="margin-top:25px;">
          <div slot="header" class="clearfix">
              <span>流程名称：<el-input style="width:20%" v-model="liuchengname"></el-input></span>
              <span style="margin-left:20px;">设置步骤数：<el-input-number v-model="buzhounum" controls-position="right" @change="handleChange" :min="1"></el-input-number></span>
              <span style="margin-left:20px;">贴花步数：<el-input-number v-model="tieHuaNum" controls-position="right" @change="handleChange" :min="1"></el-input-number></span>
          </div>
          <div v-show="buzhounum !== 1">
              <el-steps :active="active" finish-status="success">
                  <el-step v-for="n in steps" :title="n.stepname"></el-step>
              </el-steps>
          </div>
          <div style="margin-top:25px;" v-show="buzhounum !== 1">
              <el-form   label-width="80px">
                  <el-form-item label="设定步骤">
                    <el-select  v-model="itemstep" placeholder="请选择步骤">
                        <el-option v-for="item in restaurants3" :key="item.value" :label="item.label" :value="item"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                      <el-button :disabled="this.active === buzhounum || this.itemstep===''"type="primary" @click="next">下一步</el-button>
                      <el-button :disabled="this.active === 0" type="primary" @click="up">上一步</el-button>
                  </el-form-item>
              </el-form>
          </div>
          <div v-show="buzhounum !== 1" style="height:1px;width:100%;border-bottom: 1px solid #e6ebf5;
          box-sizing: border-box;margin-bottom:15px;">
          </div>
          <div style="margin-top:25px;" v-show="buzhounum !== 1">
              <el-form  label-width="120px" >
                <el-form-item label="设为默认流程">
                  <el-switch v-model="moren"></el-switch>
                </el-form-item>
              </el-form>
              <div>
                  <el-button type="primary" @click="toAdd">保存此流程</el-button>
                  <el-button type="" @click="dialogFormVisible=false">取消</el-button>
              </div>
          </div>
      </el-card>
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
      morens:[],
      dialogFormVisible: false,
      checkLoading: false,
      username: '',
      name: '',
      uid: '',
      form: {
        isCheck: true,
        isBusRemark: false
      },
      buzhounum: '1',
      tieHuaNum:'1',
      active: 0,
      form: {},
      steps: [],
      restaurants3:[],
      itemstep:'',
      moren: true,
      liuchengId:'',
      liuchengname:'',
      rules: {
        flowName: [{
            required: true,
            message: '请输入流程名称',
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
    handleChange(value) {},
    zidingyi(){
      this.dialogFormVisible = true;
    },
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
          let re = resp.data.data.steplist
          let item =[]
          for (var i = 0; i < re.length; i++) {
              let elem = {
                  label: '',
                  value: ''
              }
              elem.label = re[i].stepName
              elem.value = re[i].id
              item.push(elem);
          }
          self.restaurants3 = item;
        } else {
          console.log("获取列表数据失败");
        }
      });
    },
    loadAllFlows() {
      let self = this
      this.getRequest("/work/flow/list/steps?").then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.morens = resp.data.data.flowlist
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
    },
    next() {
        if (this.active++ > this.buzhounum-1){
            this.active = this.buzhounum;
            this.steps[this.active-1].stepname = this.itemstep.label;
            this.steps[this.active-1].stepid = this.itemstep.value;
        } else {
              this.steps[this.active-1].stepname = this.itemstep.label;
              this.steps[this.active-1].stepid = this.itemstep.value;
        }
    },
    up() {
      if (this.active-- < 1) {
        this.active = 0;
        this.steps[this.active].stepname = "步骤 "+(this.active+1);
        this.steps[this.active].stepid = '';
      } else {
        let num = this.active;
        this.steps[num].stepname = "步骤 "+(this.active+1);
        this.steps[num].stepid = '';
      }
    },
    // 添加流程
    toAdd(){
      let self =this;
      if(self.liuchengname === ''){
        self.$message.error("请填写流程名称");
        return;
      }
      if(self.steps[self.buzhounum -1].stepid === ''){
        self.$message.error("请将流程步骤设置完整");
        return;
      }
      self.checkLoading = true;
      let liucheng = {
        flowName:self.liuchengname,
        moren: self.moren,
        stepNum: self.buzhounum,
        tieHuaNum: self.tieHuaNum,
        addUserId: this.uid,
        addUserName: this.name
      }
      this.postRequest("/work/flow/add", liucheng).then(resp => {
        self.checkLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
              self.toaddStepAndFlow(resp.data.data.id)
          } else {
              self.$message.error('添加失败');
          }
      })
    },
    toaddStepAndFlow(flowId){
      let self = this;
      if(flowId === '' || flowId==='undefinded'){
        return
      }
      self.checkLoading = true;
      let paramsString = '';
      for (var i = 0; i < this.steps.length; i++) {
        let step = this.steps[i];
        let flow = {
          stepId: step.stepid,
          addUserId: this.uid,
          addUserName: this.name,
          stepIndex: i+1,
          stepName: step.stepname,
          flowId:flowId
        }
        let pageinfoString = JSON.stringify(flow);
        paramsString = paramsString + pageinfoString + "|";
      }
      let params = {
        steps:paramsString
      }
      this.postRequest("/work/flow/add/steps", params).then(resp => {
        self.checkLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
              self.$message.success("添加成功");
              this.dialogFormVisible = false;
              this.loadAllFlows();
          } else {
            self.$message.error();("添加失败");
          }
      })
    }
  },
  watch: {　　　　　　　　
      buzhounum(curVal, oldVal) {　
        this.steps = [];　　　　　　　　　
          if(curVal !== 1){
            for(let i=1;i<=curVal;i++){
              let step = {
                stepname:'步骤 '+ i,
                stepid:''
              }
              this.steps.push(step)
            }
          }　　　　　　
      }　　　　　　　　
  },
  mounted: function() {
    this.username = localStorage.getItem('cp_username');
    this.uid = localStorage.getItem('cp_uid');
    this.name = localStorage.getItem('cp_name');
    this.loadAllSteps();
    this.loadAllFlows();
  }
}
</script>
