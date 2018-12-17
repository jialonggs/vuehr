<template>
<div>
  <div>
    <el-container>
      <el-header style="align-items: center;margin-top:20px;">
        <div class="crumbs">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-menu"></i>工艺管理</el-breadcrumb-item>
            <el-breadcrumb-item>已提交记录</el-breadcrumb-item>
            <el-breadcrumb-item>记录详情</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px" v-loading="upadte_tech_loading">
        <div class="table">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>补充工艺信息</span>
                </div>
                <div>
                    <el-form ref="ruleform" :model="ruleform" :rules="rules" label-width="120px">
                      <el-form-item label="皮纹代码"  prop="piWenDaiMa" >
                          <el-input v-model="ruleform.piWenDaiMa"  placeholder="请输入纹理代码" style="width:30%" :disabled="true"></el-input>
                      </el-form-item>
                      <el-form-item label="难度系数"  prop="nanDuXiShu">
                          <el-input v-model="ruleform.nanDuXiShu" placeholder="请输入难度系数" style="width:30%" :disabled="!toupdate"></el-input>
                      </el-form-item>
                      <el-form-item label="贴花步数"  prop="tieHuaBuShu">
                        <el-input v-model="ruleform.tieHuaBuShu" placeholder="请输入贴花数" style="width:30%" :disabled="!toupdate"></el-input>
                      </el-form-item>
                      <el-form-item label="工艺参数"  prop="gongYiCanShu">
                          <el-input v-model="ruleform.gongYiCanShu" type="textarea" autosize="true" placeholder="请输入工艺参数" style="width:50%;" :disabled="!toupdate"></el-input>
                      </el-form-item>
                      <div style="height:1px;width:100%;border-bottom: 1px solid #e6ebf5;
                      box-sizing: border-box;margin-bottom:15px;">
                      </div>
                        <el-form-item label="实测模具光泽" prop="guangZhe">
                            <el-input v-model="ruleform.guangZhe" placeholder="请输入实测模具光泽" style="width:30%"></el-input>
                        </el-form-item>
                        <el-form-item label="产品材料" prop="chaiLiao">
                            <el-input v-model="ruleform.chaiLiao" placeholder="请输入产品材料" style="width:30%"></el-input>
                        </el-form-item>
                        <el-form-item label="实际调整情况" prop="tiaoZheng">
                            <el-input v-model="ruleform.tiaoZheng" placeholder="请输入实际调整情况" type="textarea" style="width:50%;"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="ruleform.remark" type="textarea" style="width:50%;"></el-input>
                        </el-form-item>
                        <div style="height:1px;width:100%;border-bottom: 1px solid #e6ebf5;
                        box-sizing: border-box;margin-bottom:15px;">
                        </div>
                        <div class="handle-box">
                            <el-button type="primary" icon="plus" class="mr10" style="float:right" @click="addLanMo"><i class="el-icon-plus"></i></el-button>
                        </div>
                        <el-table :data="tableData" border style="width: 100%">
                            <el-table-column label="序号"  type="index"  width="50">
                            </el-table-column>
                            <el-table-column prop="beginTime" label="时间">
                            </el-table-column>
                            <el-table-column prop="lanMoTime" label="烂模时间">
                            </el-table-column>
                            <el-table-column prop="shenDu" label="烂模总深度">
                            </el-table-column>
                            <el-table-column prop="yaoShui" label="烂模药水">
                            </el-table-column>
                            <el-table-column prop="remark" label="备注">
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                          <el-button size="mini" type="primary" @click="toEdit(scope.row)">编辑</el-button>
                          <el-button size="mini" type="danger" @click="delMouldRecord(scope.row)">删除</el-button>
                        </template>
                            </el-table-column>
                        </el-table>
                    </el-form>
                </div>
                <div style="height:1px;width:100%;border-bottom: 1px solid #e6ebf5;
                  box-sizing: border-box;margin-bottom:15px;margin-top:15px;">
                </div>
                <div class="card-bottom">
                    <el-button @click="toParent" type="primary">返回列表</el-button>
                    <el-button style="float:right" type="primary" @click="buChong('ruleform')">保存</el-button>
                </div>
            </el-card>
            <!-- 添加记录 -->
            <div v-loading="addlanmo_loading">
            <el-dialog title="添加记录" :visible.sync="dialogFormVisible" width='40%'>
                <div class="form-box" >
                    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                        <el-form-item label="时间" prop="beginTime">
                            <el-date-picker v-model="form.beginTime" style="width:50%" format="yyyy 年 MM 月 dd 日 HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="烂模时间" prop="lanMoTime">
                          <el-date-picker v-model="form.lanMoTime" style="width:50%" format="yyyy 年 MM 月 dd 日 HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间">
                          </el-date-picker>
                        </el-form-item>
                        <el-form-item label="烂模深度" prop="shenDu">
                            <el-input placeholder="请输入烂模深度" v-model="form.shenDu" style="width:50%"></el-input>
                        </el-form-item>
                        <el-form-item label="烂模药水" prop="yaoShui">
                            <el-input placeholder="请输入烂模药水" v-model="form.yaoShui" style="width:50%"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input type="textarea" v-model="form.remark"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary"v-show="!this.updatDisable" @click="submitForm('form')">提 交</el-button>
                    <el-button type="primary" v-show="this.updatDisable" @click="updateForm('form')">保 存</el-button>
                    <el-button @click="quit">取 消</el-button>
                </div>
            </el-dialog>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</div>
</template>
<script>
export default {
  props: {
    techCards:{
      type:Object
    }
  },
  data() {
    return {
      toupdate: false,
      upadte_tech_loading:false,
      addlanmo_loading:false,
      dialogFormVisible: false,
      item_techId:'',
      uid:'',
      name:'',
      username:'',
      updatDisable: false,
      ruleform: {},
      form:{},
      tableData: [],
      user_role: [],
      rules: {
        productName: [{
            required: true,
            message: '请输入产品名称',
            trigger: 'blur'
          },
          {
            min: 0,
            max: 255,
            message: '长度在 0 到 255 个字符',
            trigger: 'blur'
          }
        ],
        wenlidaima: [{
            required: true,
            message: '请输入纹理代码',
            trigger: 'blur'
          },
          {
            min: 0,
            max: 255,
            message: '长度在 0 到 255 个字符',
            trigger: 'blur'
          }
        ],
        carType: [{
            required: true,
            message: '请输入车型',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 1 到 255 个字符',
            trigger: 'blur'
          }
        ],
        clientCompanyName: [{
            required: true,
            message: '请输入客户单位',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 1 到 255 个字符',
            trigger: 'blur'
          }
        ],
        contactPerson: [{
            required: true,
            message: '请输入预报价单名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 1 到 255 个字符',
            trigger: 'blur'
          }
        ],
        contactPhone: [{
            required: true,
            message: '请输入联系人电话',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 1 到 255 个字符',
            trigger: 'blur'
          }
        ],
        paytype: [{
            required: true,
            message: '请输入付款方式',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 1 到 255 个字符',
            trigger: 'blur'
          }
        ],
        deliverytime: [{
            required: true,
            message: '请输入加工周期',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度在 1 到 255 个字符',
            trigger: 'blur'
          }
        ],
        remark: [{
          min: 0,
          max: 2048,
          message: '长度在 0 到 2048 个字符',
          trigger: 'blur'
        }]
      },
    }
  },
  methods: {
    buChong(formName){
      let self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.upadte_tech_loading = true;
          this.postRequest("/tech/added/update/techcard", this.ruleform).then(resp => {
            this.upadte_tech_loading = false;
            if (resp && resp.status == 200 && resp.data.code == 0) {
              self.$message.success('更新成功');
              // this.techCards = {};
              this.toParent();
            }else{
              self.$message.error('更新失败');
            }
          })
        } else {
          self.$message.error('请检查输入信息的格式');
          return false;
        }
      });
    },
    addLanMo(){
      let self = this;
      self.form = {};
      self.dialogFormVisible = true;
    },
    updateForm(formName){
      let self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addlanmo_loading = true;
          this.postRequest("/tech/added/update/lanmo", this.form).then(resp => {
            this.addlanmo_loading = false;
            if (resp && resp.status == 200 && resp.data.code == 0) {
              self.$message.success('更新成功');
              this.dialogFormVisible = false;
              this.resetForm('form');
              this.updatDisable = false;
              this.getLanMoList();
            }else{
              self.$message.error('更新失败');
            }
          })
        } else {
          self.$message.error('请检查输入信息的格式');
          return false;
        }
      });
    },
    quit(){
      this.resetForm('form');
      this.dialogFormVisible = false;
      this.updatDisable = false;
    },
    toEdit(item){
      let self = this;
      self.updatDisable = true;
      self.form = item;
      this.dialogFormVisible = true;
    },
    toGetInfo(orderId){
      this.getRequest("/tech/added/get/tech?orderId="+orderId).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.ruleform = resp.data.data.techcard;
          this.item_techId = resp.data.data.techcard.id;
          this.getLanMoList();
        }
      })
    },
    toParent(){
      this.$emit("listenToChild",1)
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 添加预报价单基础信息
    submitForm(formName) {
      let self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addlanmo_loading = true;
          self.form.addUserId = this.uid;
          self.form.addUserName = this.name;
          if(this.item_techId =='' || this.item_techId == 'undefinded'){
            self.$message.error('添加失败');
            return;
          }
          self.form.techId = this.item_techId;
          this.postRequest("/tech/added/add/lanmo", this.form).then(resp => {
            this.addlanmo_loading = false;
            if (resp && resp.status == 200 && resp.data.code == 0) {
              this.dialogFormVisible = false;
              self.resetForm('form');
              this.getLanMoList();
            }
          })
        } else {
          self.$message.error('请检查输入信息的格式');
          return false;
        }
      });
    },
    getLanMoList(){
      this.getRequest("/tech/added/lanmo/list?techId="+this.item_techId).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
           this.tableData = resp.data.data.lanmolist;
        }
      })

    },
    deletedLanMo(item){
      let self = this;
      this.getRequest("/tech/added/del/lanmo?id="+item.id).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
            self.$message.success("删除成功")
            this.getLanMoList();
        }else {
          self.$message.success("删除失败")
        }
      })
    },
    checkRole(){
      let user = localStorage.getItem('user');
      let userinfo = JSON.parse(user);
      this.user_role = userinfo.roles;
      if(this.user_role != 'undefinded' && this.user_role.length > 0){
        for (var i = 0; i < this.user_role.length; i++) {
           if(this.user_role[i].name==="ROLE_admin" || this.user_role[i].name==="ROLE_jishu"){
             this.toupdate = true;
             return;
           }
        }
      }
    },
    delMouldRecord(lanmo) {
      this.$confirm('此操作将删除此条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deletedLanMo(lanmo);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
  mounted: function() {
    this.$nextTick(function() {
    })
    this.username = localStorage.getItem('cp_username');
    this.uid = localStorage.getItem('cp_uid');
    this.name = localStorage.getItem('cp_name');
    this.checkRole();

  },
  watch: {
    techCards: function(val, oldVal){
      this.ruleform = val;
      this.toGetInfo(val.id);
    }
  }
}
</script>
