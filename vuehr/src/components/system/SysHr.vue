<!-- <template>
  <div style="margin-top: 10px" v-loading="fullloading">
    <div style="margin-bottom: 10px;display: flex;justify-content: center;align-items: center">
      <el-input
        placeholder="默认展示部分用户，可以通过用户名搜索更多用户..."
        prefix-icon="el-icon-search"
        size="small"
        style="width: 400px;margin-right: 10px"
        v-model="keywords">
      </el-input>
      <el-button size="small" type="primary" icon="el-icon-search" @click="searchClick">搜索</el-button>
    </div>
    <div style="display: flex;justify-content: space-around;flex-wrap: wrap;text-align: left">
      <el-card style="width: 350px;margin-bottom: 20px" v-for="(item,index) in hrs" :key="item.id"
               v-loading="cardLoading[index]">
        <div slot="header" class="clearfix">
          <span>{{item.name}}</span>
          <el-button type="text"
                     style="color: #f6061b;margin: 0px;float: right; padding: 3px 0;width: 15px;height:15px"
                     icon="el-icon-delete" @click="deleteHr(item.id)"></el-button>
        </div>
        <div>
          <div style="width: 100%;display: flex;justify-content: center">
            <img :src="item.userface" alt="item.name" style="width: 70px;height: 70px;border-radius: 70px">
          </div>
          <div style="margin-top: 20px">
            <div><span class="user-info">用户名:{{item.name}}</span></div>
            <div><span class="user-info">手机号码:{{item.phone}}</span></div>
            <div><span class="user-info">电话号码:{{item.telephone}}</span></div>
            <div><span class="user-info">地址:{{item.address}}</span></div>
            <div class="user-info" style="display: flex;align-items: center;margin-bottom: 3px">
              用户状态:
              <el-switch
                style="display: inline;margin-left: 5px"
                v-model="item.enabled"
                active-color="#13ce66"
                inactive-color="#aaaaaa"
                active-text="启用"
                :key="item.id"
                @change="switchChange(item.enabled,item.id,index)"
                inactive-text="禁用">
              </el-switch>
            </div>
            <div class="user-info">
              用户角色:
              <el-tag
                v-for="role in item.roles"
                :key="role.id"
                type="success"
                size="mini"
                style="margin-right: 5px"
                :disable-transitions="false">{{role.nameZh}}
              </el-tag>
              <el-popover
                v-loading="eploading[index]"
                placement="right"
                title="角色列表"
                width="200"
                @hide="updateHrRoles(item.id,index)"
                :key="item.id"
                trigger="click">
                <el-select v-model="selRoles" multiple placeholder="请选择角色">
                  <el-option
                    v-for="ar in allRoles"
                    :key="ar.id"
                    :label="ar.nameZh"
                    :value="ar.id">
                  </el-option>
                </el-select>
                <el-button type="text" icon="el-icon-more" style="color: #09c0f6;padding-top: 0px" slot="reference"
                           @click="loadSelRoles(item.roles,index)" :disabled="moreBtnState"></el-button>
              </el-popover>
            </div>
            <div><span class="user-info">备注:{{item.remark}}</span></div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template> -->
<template>
<div>
  <el-container>
    <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
      <div style="display: inline">
        <el-input placeholder="通过员工名搜索员工,记得回车哦..." clearable @change="keywordsChange" style="width: 300px;margin: 0px;padding: 0px;" size="mini" :disabled="advanceSearchViewVisible" @keyup.enter.native="searchEmp" prefix-icon="el-icon-search" v-model="keywords">
        </el-input>
        <el-button type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search" @click="searchEmp">搜索
        </el-button>
      </div>
      <div style="margin-left: 5px;margin-right: 20px;display: inline">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddEmpView">
          添加操作人员
        </el-button>
      </div>
    </el-header>
    <el-main style="padding-left: 0px;padding-top: 0px">
      <div>
        <el-table :data="hrs" v-loading="tableLoading" border stripe @selection-change="handleSelectionChange" size="mini" style="width: 100%">
          <el-table-column prop="name" align="center" fixed label="姓名">
          </el-table-column>
          <el-table-column prop="phone" align="center" label="登录账号">
          </el-table-column>
          <el-table-column prop="telephone" align="center" label="电话号码">
          </el-table-column>
          <el-table-column prop="idCard" align="center" label="角色">
            <template slot-scope="scope">
                <el-tag
                  v-for="role in scope.row.roles"
                  :key="role.id"
                  type="success"
                  size="mini"
                  style="margin-right: 5px"
                  :disable-transitions="false">{{role.nameZh}}
                </el-tag>
              </template>
          </el-table-column>
          <el-table-column prop="wedlock" align="center" label="状态">
            <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.enabled === true"
                  type="warning"
                  size="mini"
                  style="margin-right: 5px"
                  :disable-transitions="false">正常
                </el-tag>
                <el-tag
                  v-if="scope.row.enabled === false"
                  type="danger"
                  size="mini"
                  style="margin-right: 5px"
                  :disable-transitions="false">禁用
                </el-tag>
              </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="195">
            <template slot-scope="scope">
                <!-- <el-button @click="" type="primary" style="padding: 3px 4px 3px 4px;margin: 2px"
                           size="mini">编 辑
                </el-button> -->
                <el-button v-show="scope.row.enabled === true" type="danger"  style="padding: 3px 4px 3px 4px;margin: 2px" size="mini"
                           @click="toEnabled(scope.row)">禁 用
                </el-button>
                <el-button v-show="scope.row.enabled === false" type="primary"  style="padding: 3px 4px 3px 4px;margin: 2px" size="mini"
                           @click="toEnabl(scope.row)">启 用
                </el-button>
                <el-button v-show="scope.row.enabled === true" type="info"  style="padding: 3px 4px 3px 4px;margin: 2px" size="mini"
                           @click="toUpdate(scope.row)">编 辑
                </el-button>
              </template>
          </el-table-column>
        </el-table>
        <!-- <div class="pagination" style="display: flex;justify-content: space-between;margin: 2px;float:right;">
          <el-pagination background :page-size="10" :current-page="currentPage" @current-change="currentChange" layout="prev, pager, next" :total="totalCount">
          </el-pagination>
        </div> -->
      </div>
    </el-main>
  </el-container>
  <el-form :model="hr" :rules="rules"  ref="addEmpForm" style="margin: 0px;padding: 0px;">
    <div style="text-align: left" >
      <el-dialog :title="dialogTitle"   style="padding: 0px;" :close-on-click-modal="false" :visible.sync="dialogVisible" width="47%">
        <el-row :gutter="10" >
          <el-col :span="12">
            <div>
              <el-form-item label="手机号码:" prop="name">
                <el-input @blur="selectEmpByPhone" v-model='phone' prefix-icon="el-icon-edit"  style="width:50%" placeholder="请输入员工手机号码"></el-input>
              </el-form-item>
              <el-form-item label="电话号码:" prop="name">
                <el-input v-model='telephone' prefix-icon="el-icon-edit"  style="width:50%" placeholder="请输入员工电话号码"></el-input>
              </el-form-item>
              <el-form-item label="选定角色:" prop="name">
                <el-select v-model="selRoles" multiple placeholder="请选择角色">
                  <el-option
                    v-for="ar in allRoles"
                    :key="ar.id"
                    :label="ar.nameZh"
                    :value="ar.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12" style="border-left:1px solid #00F">
            <div>
            </div>
          </el-col>
        </el-row>
        <div style="display: flex;justify-content: space-around;flex-wrap: wrap;text-align: left">
          <el-card style="width: 350px;margin-bottom: 20px" v-loading="addLoading">
            <div slot="header" class="clearfix">
              <span v-if="this.item.name+'' === 'undefined'">待选定人员...</span>
              <span style="color:red" v-if="this.item.name !== ''">{{item.name}}</span>
            </div>
            <div>
              <div style="width: 100%;display: flex;justify-content: center">
                <img :src="this.userface"  style="width: 70px;height: 70px;border-radius: 70px">
              </div>
              <div style="margin-top: 20px">
                <div><span class="user-info">用户名:<span>{{item.name}}</span></span></div>
                <div><span class="user-info">手机号码:{{item.phone}}</span></div>
                <div><span class="user-info">电话号码:{{item.telephone}}</span></div>
                <!-- <div class="user-info" style="display: flex;align-items: center;margin-bottom: 3px">
                  用户状态:
                  <el-switch
                    style="display: inline;margin-left: 5px"
                    v-model="item.enabled"
                    active-color="#13ce66"
                    inactive-color="#aaaaaa"
                    active-text="启用"
                    :key="item.id"
                    @change="switchChange(item.enabled,item.id,index)"
                    inactive-text="禁用">
                  </el-switch>
                </div> -->
                <div><span class="user-info">备注:{{item.remark}}</span></div>
              </div>
            </div>
          </el-card>
          <span>*特别提醒：员工手机号将作为登录账号，初始密码为：123456。待员工首次登录时需修改登录密码。</span>
        </div>
    <span slot="footer" class="dialog-footer">
    <el-button size="mini"  type="primary" :disabled="this.item.name+'' ==='undefined'|| this.selRoles.length+'' ==='0' || this.addLoading" @click="toAddHr">确 定</el-button>
    <el-button size="mini" @click="cancelEidt">取 消</el-button>
  </span>
      </el-dialog>
    </div>
  </el-form>

  <el-dialog title="修改员工角色"  style="padding: 0px;" :close-on-click-modal="true" :visible.sync="dialogVisible1" width="47%">
        <div>
          <el-form v-model="itemHr" style="margin: 0px;padding: 0px;">
          <el-form-item label="员工姓名:" prop="name">
            <el-input v-model="this.itemHr.name" style="width:50%" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="员工角色:" prop="name">
            <el-tag v-for="userRole in this.itemHr.roles" type="info">{{userRole.nameZh}}</el-tag>
          </el-form-item>
          <el-form-item label="选定角色:">
            <el-select v-model="selRoles" multiple placeholder="请选择角色">
              <el-option
                v-for="ar in allRoles"
                :key="ar.id"
                :label="ar.nameZh"
                :value="ar.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        </div>
<span slot="footer" class="dialog-footer">
<el-button size="mini"  type="primary"  @click="updateRole">确 定</el-button>
<el-button size="mini" @click="toQuxiao">取 消</el-button>
</span>
  </el-dialog>
</div>
</template>
<script>
export default {
  data() {
    return {
      hr: {},
      userface:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1515233756&di=0856d923a0a37a87fd26604a2c871370&imgtype=jpg&er=1&src=http%3A%2F%2Fwww.qqzhi.com%2Fuploadpic%2F2014-09-27%2F041716704.jpg',
      item:{},
      phone:'',
      telephone:'',
      rules:{},
      addLoading: false,
      dialogTitle: '',
      tableLoading: false,
      dialogVisible: false,
      currentPage: 1,
      totalCount: -1,
      advanceSearchViewVisible: false,
      keywords: '',
      fullloading: false,
      hrs: [],
      cardLoading: [],
      eploading: [],
      allRoles: [],
      moreBtnState: false,
      selRoles: [],
      selRolesBak: [],
      itemHr:{},
      itemSelRoles:[],
      dialogVisible1:false
    }
  },
  mounted: function() {
    this.initCards();
    this.loadAllRoles();
  },
  methods: {
    toQuxiao(){
      this.dialogVisible1 = false;
      this.itemHr = item;
      this.selRoles = [];
    },
    toUpdate(item1){
      this.dialogVisible1 = true;
      this.itemHr = item1;
      this.selRoles = []
    },
    updateRole(){
      if(this.selRoles.length <=0){
        this.$message.error("请至少选择一个角色")
        return
      }
      this.updateHrRoles(this.itemHr.id)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    cancelEidt() {
      this.dialogVisible = false;
    },
    currentChange(currentChange) {
      this.currentPage = currentChange;
      this.loadEmps.initCards();
    },
    toEnabled(item){
      this.$confirm('禁用[' + item.name + ']的登录权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.switchChange(false,item.id);
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    toEnabl(item){
      this.$confirm('禁用[' + item.name + ']的登录权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.switchChange(true,item.id);
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    selectEmpByPhone(){
      var _this = this;
      var phone = _this.phone;
      if(phone === '' || phone.length !== 11){
        _this.$message.error("请检查手机号填写是否正确")
        return
      }
      this.getRequest("/employee/basic/empbyphone?phone="+phone).then(resp => {
        if (resp && resp.status == 200) {
          this.item = resp.data.emp;
        }else if(resp.data.emp === null) {
          _this.$message.error("未找到此员工信息,请核对手机号是否正确");
        }else {
          _this.$message.error("系统出错,匹配失败");
        }
      })
    },
    toAddHr(){
      this.addLoading = true;
      var _this = this
      let hr = {
        username:this.item.phone,
        name:this.item.name,
        password:'123456',
        phone:this.item.phone,
        userface:this.userface,
        empId:this.item.id,
        telephone:this.telephone
      };
      this.putRequest("/system/hr/hr/register",hr).then(resp => {
        _this.addLoading = false;
        if (resp && resp.status == 200) {
          var id = resp.data.id;
          if(id == -1){
            _this.$message.error("此员工信息已被绑定请，检查");
          }else if(id == 2){
              _this.$message.error("注册失败");
          }else{
            // 绑定用户角色
            _this.updateHrRoles(id);
          }
        }
      })
    },
    showAddEmpView() {
      this.dialogTitle = "添加操作人员";
      this.dialogVisible = true;
      this.phone = '';
      this.item = {};
      this.selRoles = [];

      // this.getRequest("/employee/basic/maxWorkID").then(resp => {
      //   if (resp && resp.status == 200) {
      //     _this.emp.workID = resp.data;
      //   }
      // })
    },
    keywordsChange(val) {
      if (val == '') {
        this.initCards();
      }
    },
    searchEmp() {
      this.initCards();
    },
    searchClick() {
      this.initCards();
      this.loadAllRoles();
    },
    updateHrRoles(hrId) {
      this.moreBtnState = false;
      var _this = this;
      if (this.selRolesBak.length == this.selRoles.length) {
        for (var i = 0; i < this.selRoles.length; i++) {
          for (var j = 0; j < this.selRolesBak.length; j++) {
            if (this.selRoles[i] == this.selRolesBak[j]) {
              this.selRolesBak.splice(j, 1);
              break;
            }
          }
        }
        if (this.selRolesBak.length == 0) {
          return;
        }
      }
      this.putRequest("/system/hr/roles", {
        hrId: hrId,
        rids: this.selRoles
      }).then(resp => {
        this.addLoading = false;
        if (resp && resp.status == 200) {
          if (resp.data.status == 'success') {
            _this.$message.success("添加成功");
            this.dialogVisible = false;
            _this.initCards();
            if(this.dialogVisible1){
              this.toQuxiao();
            }
          }
        }
      });
    },
    refreshHr(hrId, index) {
      var _this = this;
      _this.cardLoading.splice(index, 1, true)
      this.putRequest("/system/hr/id/" + hrId).then(resp => {
        _this.cardLoading.splice(index, 1, false)
        _this.hrs.splice(index, 1, resp.data);
      })
    },
    loadSelRoles(hrRoles, index) {
      this.moreBtnState = true;
      this.selRoles = [];
      this.selRolesBak = [];
      hrRoles.forEach(role => {
        this.selRoles.push(role.id)
        this.selRolesBak.push(role.id)
      })
    },
    loadAllRoles() {
      var _this = this;
      this.getRequest("/system/basic/roles").then(resp => {
        _this.fullloading = false;
        if (resp && resp.status == 200) {
          _this.allRoles = resp.data;
        }
      })
    },
    switchChange(newValue, hrId) {
      var _this = this;
      this.putRequest("/system/hr/", {
        enabled: newValue,
        id: hrId
      }).then(resp => {
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.initCards();
          _this.$message({
            type: data.status,
            message: data.msg
          });

        }
      })
    },
    initCards() {
      this.fullloading = true;
      this.tableLoading = true;
      var _this = this;
      var searchWords;
      if (this.keywords === '') {
        searchWords = 'all';
      } else {
        searchWords = this.keywords;
      }
      this.getRequest("/system/hr/list?" + "page=" + this.currentPage + "&size=10&keywords=" + searchWords).then(resp => {
        _this.tableLoading = false
        if (resp && resp.status == 200) {
          _this.hrs = resp.data.hrs;
          _this.totalCount = resp.data.count;
          // var length = resp.data.length;
          // _this.cardLoading = Array.apply(null, Array(length)).map(function (item, i) {
          //   return false;
          // });
          // _this.eploading = Array.apply(null, Array(length)).map(function (item, i) {
          //   return false;
          // });
        }
      })
    },
    deleteHr(hrId) {
      var _this = this;
      this.fullloading = true;
      this.deleteRequest("/system/hr/" + hrId).then(resp => {
        _this.fullloading = false;
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.$message({
            type: data.status,
            message: data.msg
          });
          if (data.status == 'success') {
            _this.initCards();
            _this.loadAllRoles();
          }
        }
      })
    }
  }
}
</script>
<style>
.user-info {
  font-size: 12px;
  color: #09c0f6;
}
</style>
