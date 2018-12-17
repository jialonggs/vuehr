<template>
<div>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>创建订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-container>
      <el-main style="padding-left: 0px;padding-top: 20px">
        <div class="" style="margin-bottom:20px;">
          <el-button v-show="techId && ruleForm.plantStatus+''!=='1' " type="primary" @click="fenPei">分配工作</el-button>
          <p v-show="!techId">等待工艺卡提交....</p>
        </div>
        <div>
          <el-button v-if="this.nanDuDengJi+'' ==='待设定'" size="mini" type="warning" @click="toNanDu">设置难度</el-button>
        </div>
        <div style="margin-top:20px;">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="line-height: 5px;"><el-tag type="danger">加工步骤</el-tag></span>
            </div>
            <div>
              <span v-if="this.orderFlow === ''" >待分配</span>
              <el-card v-if="this.orderFlow !== ''" class="box-card" style="margin-top:15px;">
                <span>{{this.orderFlow.flowName}}</span>
                <el-steps align-center>
                  <el-step v-for="step in this.orderFlow.stepslist" :title="step.stepName" :description="step.remark"></el-step>
                </el-steps>
              </el-card>
            </div>
          </el-card>
        </div>
        <div style="margin-top:20px;">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="line-height: 5px;"><el-tag type="danger">基本信息</el-tag></span>
            </div>
            <div>
              <el-row :gutter='30'>
                <el-col :span="8" style="border-right: 1px dashed rgb(217, 217, 217);">
                  <el-row style="margin-bottom:15px;">
                    <el-col :span="12">
                      <div class="grid-content bg-purple">
                        <el-tag type="info">所属项目</el-tag>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="grid-content bg-purple-light">
                        <span class="msg-span">{{this.itemOrder.project.projectName}}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row style="margin-bottom:15px;">
                    <el-col :span="12">
                      <div class="grid-content bg-purple">
                        <el-tag type="info">客户单位</el-tag>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="grid-content bg-purple-light">
                        <span class="msg-span">{{this.itemOrder.project.processUnit.clientCompanyName}}</span>
                      </div>
                    </el-col>
                  </el-row>

                  <el-row style="margin-bottom:15px;">
                    <el-col :span="12">
                      <div class="grid-content bg-purple">
                        <el-tag type="info">经办人</el-tag>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="grid-content bg-purple-light">
                        <span class="msg-span">{{this.itemOrder.project.addUserName}}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row style="margin-bottom:15px;">
                    <el-col :span="12">
                      <div class="grid-content bg-purple">
                        <el-tag type="info">创建时间</el-tag>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="grid-content bg-purple-light">
                        <span class="msg-span">{{this.itemOrder.project.createTime}}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row style="margin-bottom:15px;">
                    <el-col :span="12">
                      <div class="grid-content bg-purple">
                        <el-tag type="info">预计完工时间</el-tag>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="grid-content bg-purple-light">
                        <span class="msg-span">{{this.itemOrder.expectedTime}}</span>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="8" style="border-right: 1px dashed rgb(217, 217, 217);">
                  <el-row style="margin-bottom:15px;">
                    <el-col :span="12">
                      <div class="grid-content bg-purple">
                        <el-tag type="info">加工工艺师</el-tag>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="grid-content bg-purple-light">
                        <el-tag v-if="this.itemOrder.orderUsers.length+'' ==='0'"  type="warning">待分配</el-tag>
                        <el-tag v-for="item in this.itemOrder.orderUsers"  type="primary">{{item.userName}}</el-tag>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row style="margin-bottom:15px;">
                    <el-col :span="12">
                      <div class="grid-content bg-purple">
                        <el-tag type="info">质量总监</el-tag>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="grid-content bg-purple-light">
                        <el-tag v-if="this.itemOrder.qualityOrderUsers.length+'' ==='0'"  type="warning">待分配</el-tag>
                        <el-tag v-for="item in this.itemOrder.qualityOrderUsers"  type="primary">{{item.userName}}</el-tag>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row style="margin-bottom:15px;">
                    <el-col :span="12">
                      <div class="grid-content bg-purple">
                        <el-tag type="info">车间主管</el-tag>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="grid-content bg-purple-light">
                        <span class="msg-span">{{this.itemOrder.managerName}}</span>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="8">
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
        <div v-loading="base_loading" style="margin-top:10px;">
          <!-- <el-card style="margin-top:10px;">
            <el-row :gutter="30">
              <el-col :span="24">
                <el-row :gutter="30">
                  <el-col :span="12"> -->
                    <el-card class="box-card">
                      <div slot="header" class="clearfix">
                        <span style="line-height: 5px;"><el-tag type="danger">订单基础信息</el-tag></span>
                      </div>
                      <el-col :span="24">
                        <div class="grid-content bg-purple-dark">
                          <div class="text item">
                            <el-row>
                              <el-col :span="8">
                                <div class="grid-content bg-purple">
                                  <el-tag type="info">订单名称</el-tag>
                                </div>
                              </el-col>
                              <el-col :span="16">
                                <div class="grid-content bg-purple-light">
                                  <span class="msg-span">{{ruleForm.orderName}}</span>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="text item">
                            <el-row>
                              <el-col :span="8">
                                <div class="grid-content bg-purple">
                                  <el-tag type="info">加工类型</el-tag>
                                </div>
                              </el-col>
                              <el-col :span="16">
                                <div class="grid-content bg-purple-light">
                                  <span class="msg-span">{{ruleForm.machiningType}}</span>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="text item">
                            <el-row>
                              <el-col :span="8">
                                <div class="grid-content bg-purple">
                                  <el-tag type="info">紧急程度</el-tag>
                                </div>
                              </el-col>
                              <el-col :span="16">
                                <div class="grid-content bg-purple-light">
                                  <el-tag v-if="this.itemOrder.urgency+'' === '0'" type="primary">不急</el-tag>
                                  <el-tag v-if="this.itemOrder.urgency+'' === '1'" type="danger">正常</el-tag>
                                  <el-tag v-if="this.itemOrder.urgency+'' === '2'" type="primary">急C</el-tag>
                                  <el-tag v-if="this.itemOrder.urgency+'' === '3'" type="danger">急B</el-tag>
                                  <el-tag v-if="this.itemOrder.urgency+'' === '4'" type="primary">急A</el-tag>
                                  <el-tag v-if="this.itemOrder.urgency+'' === '5'" type="danger">紧急C</el-tag>
                                  <el-tag v-if="this.itemOrder.urgency+'' === '6'" type="primary">紧急B</el-tag>
                                  <el-tag v-if="this.itemOrder.urgency+'' === '7'" type="danger">紧急A</el-tag>
                                  <el-tag v-if="this.itemOrder.urgency+'' === '8'" type="danger">特急</el-tag>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="text item">
                            <el-row>
                              <el-col :span="8">
                                <div class="grid-content bg-purple">
                                  <el-tag type="info">实际面积</el-tag>
                                </div>
                              </el-col>
                              <el-col :span="16">
                                <div class="grid-content bg-purple-light">
                                  <span class="msg-span">{{ruleForm.realityArea}}</span>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="text item">
                            <el-row>
                              <el-col :span="8">
                                <div class="grid-content bg-purple">
                                  <el-tag type="info">倍数</el-tag>
                                </div>
                              </el-col>
                              <el-col :span="16">
                                <div class="grid-content bg-purple-light">
                                  <span class="msg-span">{{ruleForm.beiShu}}</span>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="text item">
                            <el-row>
                              <el-col :span="8">
                                <div class="grid-content bg-purple">
                                  <el-tag type="info">是否有备忘</el-tag>
                                </div>
                              </el-col>
                              <el-col :span="16">
                                <div class="grid-content bg-purple-light">
                                  <span v-if="ruleForm.hasRemark" class="msg-span">有</span>
                                  <span v-if="!ruleForm.hasRemark" class="msg-span">无</span>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="text item">
                            <el-row>
                              <el-col :span="8">
                                <div class="grid-content bg-purple">
                                  <el-tag type="info">备注</el-tag>
                                </div>
                              </el-col>
                              <el-col :span="16">
                                <div class="grid-content bg-purple-light">
                                  <span class="msg-span"></span>
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                        </div>
                      </el-col>
                    </el-card>
                  <!-- </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-card> -->
        </div>
        <div>
          <el-card class="box-card" style="margin-top:10px;">
            <div slot="header" class="clearfix">
              <span style="line-height: 5px;"><el-tag type="danger">工艺卡信息</el-tag></span>
              <el-tag v-if="this.itemOrder.techNum+''!=='0'"  type="warning">有{{this.itemOrder.techNum}}个工艺卡提交</el-tag>
            </div>
            <el-col :span="24">
              <div class="grid-content bg-purple-dark">
                <el-table v-if="this.itemOrder.techCardList.length > 0"  :data="this.itemOrder.techCardList" stripe style="width: 100%" v-loading="tableLoading">
                  <el-table-column label="纹理代码" >
                    <template slot-scope="scope">{{ scope.row.piWenDaiMa}}</template>
                  </el-table-column>
                  <el-table-column label="难度系数" >
                    <template slot-scope="scope">{{ scope.row.nanDuXiShu}}</template>
                  </el-table-column>
                  <el-table-column label="贴花步数" >
                    <template slot-scope="scope">{{ scope.row.tieHuaBuShu}}</template>
                  </el-table-column>
                  <el-table-column label="工艺参数" >
                    <template slot-scope="scope">{{ scope.row.gongYiCanShu}}</template>
                  </el-table-column>
                  <el-table-column label="添加人" >
                    <template slot-scope="scope">{{ scope.row.addUserName}}</template>
                  </el-table-column>
                  <el-table-column label="创建时间" prop="createTime">
                    <template slot-scope="scope">{{ scope.row.createTime | formatDateTime}}</template>
                  </el-table-column>
                  <!-- <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="primary"
                        @click="toAdd(scope.row)">查看详情</el-button>
                  </template>
                  </el-table-column> -->
                </el-table>
                <!-- <div class="text item">
                  <el-row>
                    <el-col :span="8">
                      <div class="grid-content bg-purple">
                        <el-tag type="info">难度系数</el-tag>
                      </div>
                    </el-col>
                    <el-col :span="16">
                      <div class="grid-content bg-purple-light">
                        <span class="msg-span">{{techCard.nanDuXiShu}}</span>
                      </div>
                    </el-col>
                  </el-row>
                </div> -->
                <!-- <div class="text item">
                  <el-row>
                    <el-col :span="8">
                      <div class="grid-content bg-purple">
                        <el-tag type="info">贴花步数</el-tag>
                      </div>
                    </el-col>
                    <el-col :span="16">
                      <div class="grid-content bg-purple-light">
                        <span class="msg-span">{{techCard.tieHuaBuShu}}</span>
                      </div>
                    </el-col>
                  </el-row>
                </div> -->
                <!-- <div class="text item">
                  <el-row>
                    <el-col :span="8">
                      <div class="grid-content bg-purple">
                        <el-tag type="info">工艺参数</el-tag>
                      </div>
                    </el-col>
                    <el-col :span="16">
                      <div class="grid-content bg-purple-light">
                        <el-input v-model="techCard.gongYiCanShu" type="textarea" autosize="true" placeholder="请输入工艺参数" style="width:90%;"></el-input>
                        </div>
                    </el-col>
                  </el-row>
                </div> -->
                <!-- <div class="text item">
                  <el-row>
                    <el-col :span="8">
                      <div class="grid-content bg-purple">
                        <el-tag type="info">备注</el-tag>
                      </div>
                    </el-col>
                    <el-col :span="16">
                      <div class="grid-content bg-purple-light">
                        <span class="msg-span">{{techCard.remark}}</span>
                      </div>
                    </el-col>
                  </el-row>
                </div> -->
              </div>
            </el-col>
          </el-card>
        </div>

        <!-- 添加订单基础信息 -->
        <div v-loading="base_loading">

          <!-- 控制单详情 -->
          <div style="margin-top:20px;">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span style="line-height: 5px;"><el-tag type="danger">控制单详情</el-tag></span>
                <!-- <el-button size="small" style="float: right;" type="primary" @click="">编辑</el-button> -->
              </div>
              <div class="text item">
                <el-row :gutter='30'>
                  <el-col :span="8" style="border-right: 1px dashed rgb(217, 217, 217);">
                    <el-row style="margin-bottom:15px;">
                      <el-col :span="12">
                        <div class="grid-content bg-purple">
                          <el-tag type="info">气孔</el-tag>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                          <span class="msg-span">{{exform.qiKong}}</span>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-bottom:15px;">
                      <el-col :span="12">
                        <div class="grid-content bg-purple">
                          <el-tag type="info">缺口</el-tag>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                          <span class="msg-span">{{exform.queKou}}</span>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-bottom:15px;">
                      <el-col :span="12">
                        <div class="grid-content bg-purple">
                          <el-tag type="info">裂缝</el-tag>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                          <span class="msg-span">{{exform.lieFeng}}</span>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-bottom:15px;">
                      <el-col :span="12">
                        <div class="grid-content bg-purple">
                          <el-tag type="info">焊疤</el-tag>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                          <span class="msg-span">{{exform.hanBa}}</span>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-bottom:15px;">
                      <el-col :span="12">
                        <div class="grid-content bg-purple">
                          <el-tag type="info">电火花</el-tag>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                          <span class="msg-span">{{exform.dianHuoHua}}</span>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-bottom:15px;">
                      <el-col :span="12">
                        <div class="grid-content bg-purple">
                          <el-tag type="info">油丝石</el-tag>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                          <span class="msg-span">{{exform.youShiSi}}</span>
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="8" style="border-right: 1px dashed rgb(217, 217, 217);">
                    <el-row style="margin-bottom:15px;">
                      <el-col :span="12">
                        <div class="grid-content bg-purple">
                          <el-tag type="info">区域</el-tag>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                          <span class="msg-span">{{exform.quYu}}</span>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-bottom:15px;">
                      <el-col :span="12">
                        <div class="grid-content bg-purple">
                          <el-tag type="info">同光泽处理区域</el-tag>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                          <span v-if="exform.tongGZ" class="msg-span">有</span>
                          <span v-if="!exform.tongGZ" class="msg-span">无</span>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-bottom:15px;">
                      <el-col :span="12">
                        <div class="grid-content bg-purple">
                          <el-tag type="info">最后试模件</el-tag>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                          <span class="msg-span">{{exform.zuiHouShiMoJian}}</span>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-bottom:15px;">
                      <el-col :span="12">
                        <div class="grid-content bg-purple">
                          <el-tag type="info">CKD件</el-tag>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                          <span class="msg-span">{{exform.ckd}}</span>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-bottom:15px;">
                      <el-col :span="12">
                        <div class="grid-content bg-purple">
                          <el-tag type="info">光件</el-tag>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                          <span class="msg-span">{{exform.guangJian}}</span>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-bottom:15px;">
                      <el-col :span="12">
                        <div class="grid-content bg-purple">
                          <el-tag type="info">分型线光边</el-tag>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                          <span class="msg-span">{{exform.fenXingBian}}</span>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-bottom:15px;">
                      <el-col :span="12">
                        <div class="grid-content bg-purple">
                          <el-tag type="info">合模线光边</el-tag>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                          <span class="msg-span">{{exform.heMoBian}}</span>
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="8">
                    <el-row style="margin-bottom:15px;">
                      <el-col :span="12">
                        <div class="grid-content bg-purple">
                          <el-tag type="info">深度</el-tag>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                          <span class="msg-span">{{exform.heMoBian}}</span>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-bottom:15px;">
                      <el-col :span="12">
                        <div class="grid-content bg-purple">
                          <el-tag type="info">碰穿边</el-tag>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                          <span class="msg-span">{{exform.pengChuanBian}}</span>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-bottom:15px;">
                      <el-col :span="12">
                        <div class="grid-content bg-purple">
                          <el-tag type="info">碰穿孔</el-tag>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                          <span class="msg-span">{{exform.pengChuanBian}}</span>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-bottom:15px;">
                      <el-col :span="12">
                        <div class="grid-content bg-purple">
                          <el-tag type="info">备注</el-tag>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                          <!-- <span class="msg-span">{{exform.remark}}</span> -->
                        </div>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </div>
        </div>
        <!-- 模具详情 -->
        <div style="margin-top:20px;">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="line-height: 5px;"><el-tag type="danger">模具详情</el-tag></span>
            </div>
            <div>
              <el-row :gutter="30">
                <el-col :span="6" v-for="part in select_part">
                  <el-card :body-style="{ padding: '0px' }" class="mould-card">
                    <img class="image" v-bind:src="part.collectPartinfoEntity.picurl[0]" style="height:260px;">
                    <div style="padding: 14px;">
                      <h4>{{part.collectPartinfoEntity.mouldName}}</h4>
                      <span>备注：{{part.collectPartinfoEntity.remark}}</span>
                      <div class="bottom clearfix">
                        <time class="time">{{part.collectPartinfoEntity.createTime}}</time>
                      </div>
                      <!-- <i style="float:right"class="el-icon-delete" @click="toDeleted(part.collectPartinfoEntity.id)"></i> -->
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>

        <!-- 产品照片 -->
        <div style="margin-top:20px;">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="line-height: 5px;"><el-tag type="danger">产品照片</el-tag></span>
            </div>
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
            <div>
            </div>
          </el-card>
        </div>
        <!-- 分配明细 -->
        <div>
          <el-dialog width="60%" title="分配工作" :visible.sync="innerVisible" :close-on-click-modal="false" append-to-body>
            <el-form ref="elform" :model="elform" :rules="rules" label-width="30%">
              <!-- <el-form-item label="所需贴花步数：">
                <el-tag type="info">3</el-tag>
                <el-tag type="info">{{this.itemOrder.techCardList[0].tieHuaBuShu}}</el-tag>
              </el-form-item> -->
              <el-form-item label="选择加工流程：" prop="productName">
                <el-select @change="test" v-model='elform.flowId' placeholder="请输选择加工流程" style="width:50%;">
                  <el-option v-for="item in restaurants3" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="选择质量监管人员：" prop="qualityUsers">
                <el-select v-model="zhiliang" multiple placeholder="选择质量监管人员：" style="width:50%;">
                  <el-option v-for="ar in restaurants5" :key="ar.value" :label="ar.label" :value="ar">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="选择加工人员：" prop="wenlidaima">
                <el-button type="primary" @click="outerVisible = true">添加</el-button>
              </el-form-item>
            </el-form>
            <div style="border: 1px dashed #d9d9d9;width:100%;min-height:358px;">
              <span>{{selectFlow.flowName}}</span>
              <el-steps align-center>
                <el-step v-for="step in selectFlow.stepslist" :title="step.stepName" :description="step.remark"></el-step>
              </el-steps>

              <span style="margin-top:10px;">工艺师列表</span>
              <div style="margin-top:10px;">
                <el-table :data="Ygas" border style="width: 100%">
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
                  <el-table-column fixed="right" label="操作" width="300">
                    <template slot-scope="scope">
         <!-- <el-button type="text" size="small" @click.native.prevent="toEidtor(scope.$index, productData)">编辑</el-button> -->
         <el-button
           @click.native.prevent="deleteRow(scope.$index, Ygas)"
           type="text"
           size="small">
           移除
         </el-button>
       </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="toFenPei">确 定</el-button>
              <el-button @click="toQuXiao">取 消</el-button>
            </div>
            <div slot="footer" class="dialog-footer">
            </div>
            <el-dialog width="40%" title="分配贴花面积" :visible.sync="outerVisible" append-to-body>
              <el-form :model="form" label-width="30%">
                <el-form-item label="选择工艺师:">
                  <el-select v-model="itemYga" placeholder="请选工艺师">
                    <el-option v-for="item in restaurants4" :key="item.value" :label="item.label" :value="item"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="贴花面积比例:">
                  <el-select v-model="form.biLi" placeholder="请选择加工面积比例">
                    <el-option label="10%" value="10"></el-option>
                    <el-option label="20%" value="20"></el-option>
                    <el-option label="30%" value="30"></el-option>
                    <el-option label="40%" value="40"></el-option>
                    <el-option label="50%" value="50"></el-option>
                    <el-option label="60%" value="60"></el-option>
                    <el-option label="70%" value="70"></el-option>
                    <el-option label="80%" value="80"></el-option>
                    <el-option label="90%" value="90"></el-option>
                    <el-option label="100%" value="100"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button style="float:right" type="primary" @click="selectYga">确 定</el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
          </el-dialog>
          <el-dialog title="提交订单难度等级" :visible.sync="dialogFormVisible12" v-loading="tableLoading">
            <el-form :model="form1">
              <el-form-item label="难度等级：">
                <el-input v-model="form1.nanDuDengJi" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible12 = false">取 消</el-button>
              <el-button type="primary" @click="nanDu">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-main>
    </el-container>
  </div>
</div>
</template>
<script>
import VueCoreImageUpload from 'vue-core-image-upload';
export default {
  data() {
    return {
      dialogFormVisible12: false,
      techCard: {
        piWenDaiMa: '待添加',
        nanDuXiShu: '待添加',
        tieHuaBuShu: '待添加',
        gongYiCanShu: '待添加',
        guangZhe: '待添加',
        chaiLiao: '待添加',
        tiaoZheng: '待添加',
        remark: '待添加'
      },
      itemOrder: {},
      itemYga: {},
      Ygas: [],
      outerVisible: false,
      form: {},
      techId: false,
      liuCheng: [],
      userLogo: '',
      udapteBoolean: false,
      elform: {},
      zhiliang: [],
      selRoles: [],
      allRoles: [],
      selRolesBak: [],
      innerVisible: false,
      urlId: '',
      qrCode: '',
      imageUrl: '',
      contr_loading: false,
      base_loading: false,
      exform: {
        addUserId: '',
        addUserName: '',
        orderId: '',
        qiKong: '无',
        queKou: '无',
        lieFeng: '无',
        hanBa: '无',
        dianHuoHua: '无',
        youShiSi: '无',
        heMoBian: '0',
        fenXingBian: '0',
        tongGZ: false,
        zuiHouShiMoJian: '0',
        ckd: '0',
        guangJian: '0'
      },
      orderFlow:{},
      flowData: [],
      filterText: '',
      tree_loading: false,
      item_order_id: '2',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      select_part: [],
      data3: [],
      nowTab: 1,
      username: '',
      name: '',
      uid: '',
      form1: {},
      tableLoading: false,
      selectFlow: {},
      imageUrls: [],
      restaurants1: [],
      restaurants2: [],
      restaurants3: [],
      restaurants4: [],
      restaurants5: [],
      restaurants6: [],
      nanDuDengJi: '',
      imageData: {
        userId: '',
        imgPakage: 'order_pm'
      },
      ruleForm: {
        orderName: '',
        addUserId: '',
        addUserName: '',
        projectId: '',
        hasRemark: false,
        picUrls: '',
        urgency: '0',
        remark: '',
        realityArea: '0',
        machiningType: ''
      },
      restaurants: [],
      rules: {
        orderName: [{
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
        machiningType: [{
          required: true,
          message: '请选择工艺类型',
          trigger: 'blur'
        }],
        managerId: [{
          required: true,
          message: '请选择车间负责人',
          trigger: 'blur'
        }],
        realityArea: [{
          required: true,
          message: '请输入加工面积',
          trigger: 'blur'
        }],
        projectId: [{
          required: true,
          message: '请选择所属项目',
          trigger: 'blur'
        }],
        urgency: [{
          required: true,
          message: '请选择订单紧急成度',
          trigger: 'blur'
        }],

      }
    }
  },
  components: {
    VueCoreImageUpload
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  methods: {
    toNanDu() {
      this.dialogFormVisible12 = true;
      this.form1 = {};
    },
    nanDu() {
      let params = {
        nanDuDengJi: this.form1.nanDuDengJi,
        orderId: this.urlId
      }
      this.tableLoading = true
      this.postRequest("/plant/nan/du", params).then(resp => {
        this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.$message.success("设置成功")
          this.form1.nanDuDengJi = '';
          this.nanDuDengJi = this.form1.nanDuDengJi;
          this.dialogFormVisible12 = false;
        } else {
          this.$message.error("设置失败")
        }
      })
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    selectYga() {
      let item = this.itemYga;
      let itemYags = this.Ygas;
      let tieHuaBuShu = this.selectFlow.tieHuaNum
      // let tieHuaBuShu = 3;
      // let tieHuaBuShu = this.itemOrder.techCard.tieHuaBuShu
      let workArea = this.itemOrder.workArea
      let biLi = this.form.biLi
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
        yga.oneceTieHuaArea = yga.allTieHuaArea / tieHuaBuShu
        yga.jingFengArea = workArea * 0.1 * biLi / 100
        yga.orderNeedArea = workArea
        this.Ygas.push(yga);
      } else {
        yga.userId = item.value;
        yga.userName = item.label;
        yga.biLi = biLi;
        yga.allTieHuaArea = workArea * 0.9 * biLi / 100
        yga.oneceTieHuaArea = yga.allTieHuaArea / tieHuaBuShu
        yga.jingFengArea = workArea * 0.1 * biLi / 100
        yga.orderNeedArea = workArea
        this.Ygas.push(yga);
      }
      this.$message.success("添加成功")
      this.itemYga = {};
      this.form = {};
      this.outerVisible = false;
    },
    test(item) {
      let self = this;
      for (let i = 0; i < self.flowData.length; i++) {
        if (item === self.flowData[i].id) {
          self.selectFlow = self.flowData[i];
        }
      }
    },
    toQuXiao() {
      this.innerVisible = false;
      this.resetForm('elform');
    },
    fenPei() {
      this.selectFlow = {};
      this.elform = {}
      this.selRoles = [];
      this.zhiliang = [];
      this.innerVisible = true;
    },
    toFenPei() {
      let self = this;
      if (this.Ygas.length == 0) {
        self.$message.error("至少选择一位工艺师");
        return
      }
      //this.tieHuaBuShu = this.selectFlow.tieHuaNum
      // if (this.selectFlow.tieHuaNum + '' !== 3 + '') {
      //  if (this.selectFlow.tieHuaNum + '' !== this.itemOrder.techCard.tieHuaBuShu + '') {
      //   self.$message.error("所选流程贴花步数与技术卡步数不匹配");
      //   return
      // }
      let qu = []
      if (this.zhiliang.length == 0) {
        self.$message.info("至少选择一位质量总监");
        return
      }
      for (let i = 0; i < this.zhiliang.length; i++) {
        let id = this.zhiliang[i].value;
        let name = this.zhiliang[i].label;
        let zi = {
          id: id,
          name: name
        }
        qu.push(zi);
      }
      let yags = this.Ygas;
      if (yags.length <= 0) {
        self.$message.info("请完成面积分配");
        return
      }
      let biLi = 0;
      for (var i = 0; i < yags.length; i++) {
        biLi = biLi + parseInt(yags[i].biLi);
      }
      if (biLi + '' !== "100") {
        self.$message.error("分配总比例不等于100%");
        return
      }
      let params = {
        orderId: this.urlId,
        orderName: this.itemOrder.orderName,
        addUserId: this.uid,
        addUserName: this.name,
        ygas: this.Ygas,
        qualityUsers: qu,
        flow: this.selectFlow,
      }
      this.jsonPostRequest("/plant/fen/pei", params).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          self.$message.success("分配任务成功")
          this.$router.push('/plant/new/order')
        } else {
          self.$message.error("分配任务失败")
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleSelect(item) {},
    loadAllliucheng() {
      let self = this
      this.getRequest("/work/flow/list/steps").then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          let item = []
          let morens = resp.data.data.flowlist
          self.flowData = morens;
          if (morens != 'undefined' && morens.length > 0) {
            for (var i = 0; i < morens.length; i++) {
              let elem = {
                label: '',
                value: ''
              }
              elem.label = morens[i].flowName
              elem.value = morens[i].id
              item.push(elem);
            }
            self.restaurants3 = item;
          }
        } else {
          console.log("获取列表数据失败");
        }
      });
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
    loadAllZhiliang() {
      let self = this
      this.getRequest("/config/mangers?role=ROLE_zhiliang").then(resp => {
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
            self.restaurants5 = item;
          }
        } else {
          console.log("获取列表数据失败");
        }
      });
    },
    splitUrl(item) {
      let picurl = item.picUrls;
      let urlArray = [];
      if (picurl != "undefined" && picurl != "") {
        urlArray = picurl.split('|');
      }
      return urlArray;
    },
    getOrderInfo(urlId) {
      let self = this;
      this.getRequest("/config/info?orderId=" + urlId).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          console.log(resp);
          let orderFlow = resp.data.data.orderinfo.orderFlow
          if(orderFlow != '' && orderFlow!=='undefined'){
            this.orderFlow = JSON.parse(orderFlow.flowJson)
          }
          this.nanDuDengJi = resp.data.data.orderinfo.nanDuDengJi
          this.itemOrder = resp.data.data.orderinfo;
          this.ruleForm = resp.data.data.orderinfo;
          this.techId = resp.data.data.orderinfo.techId;
          let techCard = resp.data.data.orderinfo.techCard;
          if (techCard !== '') {
            this.techCard = techCard;
          }
          this.qrCode = resp.data.data.orderinfo.qrCode;
          this.exform = resp.data.data.orderinfo.controlOrderFrom;
          let moulds = resp.data.data.orderinfo.mouldInfoList;
          if ( moulds.length > 0) {
            for (let i = 0; i < moulds.length; i++) {
              let part = {
                collectPartinfoEntity: {}
              }
              part.collectPartinfoEntity = moulds[i];
              this.addSelected(part);
            }
          }
          if(resp.data.data.orderinfo.picUrls !== ""){
            this.imageUrls = this.splitUrl(resp.data.data.orderinfo);
          }
        } else {
          console.log("获取订单详情失败");
        }
      });
    },
    addSelected(item) {
      let self = this
      let sel = self.select_part
      if (sel.length === 0) {
        if (item.collectPartinfoEntity.picurl instanceof Array) {
          sel.push(item);
        } else {
          item.collectPartinfoEntity.picurl = self.splitUrl(item.collectPartinfoEntity)
          sel.push(item);
        }
      } else {
        let flag = true
        for (let i = 0; i < sel.length; i++) {
          if (sel[i].collectPartinfoEntity.id === item.collectPartinfoEntity.id) {
            flag = false;
            break;
          }
        }
        if (flag) {
          if (item.collectPartinfoEntity.picurl instanceof Array) {
            sel.push(item);
          } else {
            item.collectPartinfoEntity.picurl = self.splitUrl(item.collectPartinfoEntity)
            sel.push(item);
          }
        }
      }
    },
  },
  mounted: function() {
    this.$nextTick(function() {})
    this.username = localStorage.getItem('cp_username');
    this.uid = localStorage.getItem('cp_uid');
    this.name = localStorage.getItem('cp_name');
    this.loadAllliucheng();
    this.loadAllYuanGongA();
    this.loadAllZhiliang();
  },
  created: function() {
    this.urlId = this.$route.params.id;
    this.getOrderInfo(this.urlId);
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
