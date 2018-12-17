<template>
<div style="display: flex;justify-content: space-around;flex-wrap: wrap;text-align: left">
  <el-card style="width: 850px;margin-bottom: 20px">
    <div slot="header" class="clearfix">
      <span>个人中心</span>
    </div>
    <div>
      <div style="width: 100%;display: flex;justify-content: center">
        <img :src="item.userface" alt="item.name" style="width: 70px;height: 70px;border-radius: 70px">
      </div>
      <div style="margin-top: 20px">
        <div style="margin-top:20px;"><span class="user-info">用户名: {{item.name}}</span></div>
        <div style="margin-top:20px;"><span class="user-info">手机号码: {{item.phone}}</span></div>
        <div style="margin-top:20px;"><span class="user-info">电话号码: {{item.telephone}}</span></div>
        <div style="margin-top:20px;"><span class="user-info">地址: {{item.address}}</span></div>
        <div style="margin-top:20px;" class="user-info">
          用户角色:
          <el-tag v-for="role in item.roles" :key="role.id" type="success" size="mini" style="margin-right: 5px" :disable-transitions="false">{{role.nameZh}}
          </el-tag>
        </div>
      </div>
      <div style="border-top:solid #f5f7fa 1px;margin-top:20px;">
        <div style="margin-top:10px;float:left;">
          <el-button type="primary" @click="updatePassword">修改密码</el-button>
        </div>
        <div style="margin-top:10px;float:right;" v-if="yga">
          <el-button type="primary" @click="toWuLiao">设置物料密码</el-button>
        </div>
      </div>
    </div>
  </el-card>
  <div>
    <el-dialog title="修改密码"  label-width="80px" :visible.sync="dialogFormVisible" >
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="原密码:"  style="width:60%" prop="oldPassword">
           <el-input type="password" v-model="form.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码:"  style="width:60%" prop="newPassword1">
          <el-input type="password" v-model="form.newPassword1" ></el-input>
        </el-form-item>
        <el-form-item label="再次输入密码:"  style="width:60%" prop="newPassword2">
          <el-input type="password" v-model="form.newPassword2" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="toUpdateExit">取 消</el-button>
        <el-button type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置物料私人密码"  label-width="80px" :visible.sync="dialogFormVisible1" >
      <el-form :model="form1" ref="form1" :rules="rules">
        <el-form-item label="登录密码:"  style="width:60%" prop="password">
           <el-input type="password" v-model="form1.password"></el-input>
        </el-form-item>
        <el-form-item label="密码:"  style="width:60%" prop="privateStr1">
           <el-input type="password" v-model="form1.privateStr1"></el-input>
        </el-form-item>
        <el-form-item label="重复密码:"  style="width:60%" prop="privateStr2">
          <el-input type="password" v-model="form1.privateStr2" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="toUpdateExit1">取 消</el-button>
        <el-button type="primary" @click="toAdd('form1')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      item: {},
      username: '',
      dialogFormVisible: false,
      dialogFormVisible1: false,
      uid: '',
      name: '',
      yga: false,
      form:{},
      form1:{},
      rules: {
        newPassword1: [{
          required: true,
          message: '新密码不能为空',
          trigger: 'blur'
        }, {
          pattern: /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{8,}/,
          message: '长度至少8位(字母、数字)',
          trigger: 'blur'
        },
        { min: 8, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
      ],
      privateStr1: [{
        required: true,
        message: '私人密码不能为空',
        trigger: 'blur'
      }, {
        pattern: /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{8,}/,
        message: '长度至少8位(字母、数字)',
        trigger: 'blur'
      },
      { min: 8, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    privateStr2: [{
      required: true,
      message: '私人密码不能为空',
      trigger: 'blur'
    }, {
      pattern: /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{8,}/,
      message: '长度至少8位(字母、数字)',
      trigger: 'blur'
    },
    { min: 8, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
  ],
  password: [{
    required: true,
    message: '登录密码不能为空',
    trigger: 'blur'
  }, {
    pattern: /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{8,}/,
    message: '长度至少8位(字母、数字)',
    trigger: 'blur'
  },
  { min: 8, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
],
      newPassword2: [{
        required: true,
        message: '新密码不能为空',
        trigger: 'blur'
      }, {
        pattern: /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{8,}/,
        message: '长度至少8位(字母、数字)',
        trigger: 'blur'
      },
      { min: 8, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    oldPassword: [{
      required: true,
      message: '旧密码不能为空',
      trigger: 'blur'
    }]
        }
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    toWuLiao() {
      let self = this
      self.dialogFormVisible1 = true;
      self.form1 = {}
    },
    updatePassword() {
      let self = this
      self.dialogFormVisible = true;
      self.form = {}
    },
    toUpdateExit(){
      let self = this
      self.dialogFormVisible = false;
      self.form = {}
    },
    toUpdateExit1(){
      let self = this
      self.dialogFormVisible1 = false;
      self.form1 = {}
    },
    toAdd(formName){
      let self = this
      if(this.form1.privateStr1 != this.form1.privateStr2){
        self.$message.error("两次输入密码不一致")
        return;
      }
      let param = {
        privateStr: this.form1.privateStr2,
        userId:this.uid,
        password: this.form1.password
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postRequest("/personnel/add/private/", param).then(resp => {
            if (resp && resp.status == 200 && resp.data.code == 0) {
              this.$message.success("设置密码成功，重复设置将被覆盖");
              this.toUpdateExit1();
            }else{
              this.$message.error(resp.data.message);
            }
          })
        }else{
          return false;
        }
      });
    },
    update(formName){
      let self = this
      if(this.form.newPassword1 != this.form.newPassword2){
        self.$message.error("两次输入密码不一致")
        return;
      }
      let param = {
        oldPassword: this.form.oldPassword,
        newPassword: this.form.newPassword1,
        userId:this.uid
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postRequest("/personnel/update/password/", param).then(resp => {
            if (resp && resp.status == 200 && resp.data.code == 0) {
              this.$message.success("更新密码成功");
              this.toUpdateExit();
            }else{
              this.$message.error(resp.data.message);
            }
          })
        }else{
          return false;
        }
      });
    },
    getHuiZong() {
      let self = this
      let param = {
        userId: self.uid
      }
      this.postRequest("/personnel/info/", param).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.item = resp.data.data
          let roles = resp.data.data.roles;
          if (roles != '' && roles != 'undefinded' && roles.length > 0) {
            for (var i = 0; i < roles.length; i++) {
              if (roles[i].name === "ROLE_admin" || roles[i].name === "ROLE_yga") {
                self.yga = true;
                break;
              }
            }
          }
        }
      })
    },
  },
  mounted: function() {
    this.$nextTick(function() {})
    this.username = localStorage.getItem('cp_username');
    this.uid = localStorage.getItem('cp_uid');
    this.name = localStorage.getItem('cp_name');
    this.getHuiZong();
  },
};
</script>
