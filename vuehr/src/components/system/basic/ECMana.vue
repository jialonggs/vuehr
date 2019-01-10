<template>
  <div>
    <h1>移动端轮播图管理</h1>
    <!-- 具体模具信息 -->
    <div>
      <div class="table">
        <el-card class="box-card" style="margin-top:25px;">
          <div class="form-box">
            <el-form :model="form" ref="form" label-width="120px" >
              <el-form-item label="上传图片：">
                <div>
                  <vue-core-image-upload :crop="false" inputOfFile="imageFile" :url="upload" extensions="png,gif,jpeg,jpg" :class="['el-button', 'el-button--primary']" :max-file-size="5242880" :data="imageData" text="上传图片" :multiple="true" :multiple-size="30" credentials="true"
                    @imageuploaded="imageuploaded" @errorhandle="handleError">
                  </vue-core-image-upload>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div style="border: 1px dashed #d9d9d9;width:100%;min-height:358px;">
            <el-row :gutter="20" style="margin-top:10px;">
              <el-col :span="6" v-for="imageUrl in imageUrls ">
                <el-card :body-style="{ padding: '0px' }" class="mould-card">
                  <img class="image" v-bind:src="imageUrl" style="height:420px;">
                  <!-- <div style="text-align:center;">
                    <el-button type="text" @click="delMouldImage(imageUrl)"><i class="el-icon-error" style="color:red;"></i></el-button>
                  </div> -->
                </el-card>
              </el-col>
            </el-row>
          </div>
          <div class="card-bottom">
            <!-- <el-button type="primary" style="float:left !important" @click="toMojuLieBiao">返回</el-button> -->
            <el-button  type="primary" @click="addMouldInfos()">提交</el-button>
            <!-- <el-button v-show="part_disable === true" type="primary" @click="to_update_partinfo('form')">更新</el-button> -->
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import timeFilter from '../../../utils/timeFilter.js'
import VueCoreImageUpload from 'vue-core-image-upload';
import JLApiUtils from '../../../utils/JLApiUtils.js';
export default {
  components: {
    VueCoreImageUpload
  },
  data() {
    return {
      pkGuid: '',
      shouMoId: '',
      mouldPartLoading: false,
      updateId: '',
      partsInfos: [],
      nowTab: 1,
      mojuCard: false,
      moJuDisable: false,
      form: {
        mouldNum: 1,
        addUserId: '',
        addUserName: '',
        shouMoId: '',
        picUrls: ''
      },
      upload: '',
      imageData: {
        userId: '',
        imgPakage: 'sfm_shou'
      },
      imageUrls: [],
      // 上传
      tableLoading: false,
      changeDisable: true,
      toAddDisable: false,
      currentPage: 1,
      totalnum: 0,
      pagesize: 10,
      select_word: '',
      tableData: [],
      username: '',
      uid: '',
      batch: '',
      upadteDisabled: false,
      tiem_disablse: false,
      part_disable: false,
      chomgzi_dis: false,
      update_disablse: false,
      base_disablse: false,
      doc_collect_id: '',
      dialogFormVisible: false,
      itemForm: {},
      ruleForm: {
        createTime: '',
        addUserName: '',
        addUserId: '',
        woodenCaseNum: '0',
        palletNum: '0',
        diaoHuanNum: '0',
        clientCompanyName: '',
        freightType: '',
        carNum: '',
        jianBao: false,
        driverPhone: ''
      },
    }
  },
  methods: {
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

    toAddMould() {
      this.$confirm('是否替换APP开机图片?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        this.toAddMouldRecord();
      }).catch(() => {
        //this.getCollectMouldList();
        // this.$message({
        //   type: 'info',
        //   message: '已取消'
        // });
      });
    },
    getCollectMouldList(){
      this.getRequest("/config/get/pic").then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          var url = resp.data.data.url
          this.imageUrls.push(url);
        }
      })
    },

    // 添加模具信息
    addMouldInfos() {
      let self = this;
          if (self.imageUrls.length == 0) {
            self.$message.error("请上传必要图片");
            return;
          }
          let url = "";
          for (var i = 0; i < self.imageUrls.length; i++) {
            if (i == self.imageUrls.length - 1) {
              url = url + self.imageUrls[i]
            } else {
              url = self.imageUrls[i] + "|" + url
            }
          }
          var paramsData = {
            'picUrls': url
          };
          this.postRequest("/config/add/pic", paramsData).then(resp => {
            if (resp && resp.status == 200 && resp.data.code == 0) {
              self.$message.success("添加成功");
            } else {
              self.$message.error('添加失败');
            }
          })
    },
    imageuploaded(data) {
      let self = this;
      self.imageUrls = [];
      if (data.url.length !== 'undefined' && data.url.length > 0) {
        let url = data.url
        let urls = self.imageUrls;
        for (var i = 0; i < url.length; i++) {
          urls.push(url[i]);
        }
        self.imageUrls = urls;
      }
    },
    // 上传图片失败
    handleError() {
      this.$notify.error({
        title: '上传失败',
        message: '图片上传出现异常'
      });
    },
    todelImage(url) {
      let self = this
      if (url == 'undefined' || url.length == "") {
        self.$message.error("删除图片不存在");
        return
      }
      this.getRequest("/config/delfile/delImage?url=" + url).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.$message.success("删除成功");
          let urls = self.imageUrls;
          let newUrls = [];
          for (var i = 0; i < urls.length; i++) {
            if (url != urls[i]) {
              newUrls.push(urls[i])
            }
          }
          self.imageUrls = newUrls;
        } else {
          self.$message.error("删除照片失败");
        }
      })

    },
    delMouldImage(url) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.todelImage(url);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

  },
  mounted: function() {
    this.$nextTick(function() {
      this.imageData.userId = localStorage.getItem('cp_uid');
      this.tableLoading = true;
      this.getCollectMouldList();
    })
    this.username = localStorage.getItem('cp_username');
    this.uid = localStorage.getItem('cp_uid');
    this.name = localStorage.getItem('cp_name');

  },
  created: function(){
    this.upload = JLApiUtils.upload;
  },
  computed: {
  }
}
</script>
<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.card-bottom {
  padding: 18px 20px;
  border-top: 1px solid #e6ebf5;
  box-sizing: border-box;
  text-align: right;
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
