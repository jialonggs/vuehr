
<template>
<div>
  <div v-show="nowTab === 1">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>我的项目</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center;margin-top:20px;">
        <div class="handle-box">
          <el-button type="primary" icon="plus" class="mr10" @click="toadd()">创建项目</el-button>
          <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" icon="search"></el-input>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <el-table :data="data" stripe style="width: 100%" v-loading="tableLoading">
          <el-table-column prop="projectName" label="项目名称">
          </el-table-column>

          <el-table-column label="所属车型">
            <template slot-scope="scope">
            <span >{{scope.row.car.name}}</span>
          </template>
          </el-table-column>
          <el-table-column label="客户单位">
            <template slot-scope="scope">
            <span >{{scope.row.processUnit.clientCompanyName}}</span>
          </template>
          </el-table-column>
          <el-table-column prop="orderNums" label="订单数量">
            <template slot-scope="scope">
          <el-tag v-if="scope.row.orderNums+'' === 'undefined' ||scope.row.orderNums+'' === '' " type="info">0</el-tag>
          <el-tag v-if="scope.row.orderNums+'' !== ''" type="info">{{scope.row.orderNums}}</el-tag>
        </template>
          </el-table-column>
          <el-table-column label="预报价状态">
            <template slot-scope="scope">
            <el-tag v-if="scope.row.yuBaoJia.audit+'' === 'undefined'" type="info">无</el-tag>
            <el-tag v-if="scope.row.yuBaoJia.audit+'' === '0'" >审核中</el-tag>
            <el-tag v-if="scope.row.yuBaoJia.audit+'' === '2'" type="danger">驳回</el-tag>
            <el-tag v-if="scope.row.yuBaoJia.audit+'' === '1'" type="success">通过</el-tag>
          </template>
          </el-table-column>
          <el-table-column prop="shangWuStatus" label="商务报价状态">
            <template slot-scope="scope">
                  <el-tag v-if="scope.row.businessBaoJia.audit+'' === 'undefined'" type="info">无</el-tag>
                  <el-tag v-if="scope.row.businessBaoJia.audit+'' === '0'" >审核中</el-tag>
                  <el-tag v-if="scope.row.businessBaoJia.audit+'' === '2'" type="danger">驳回</el-tag>
                  <el-tag v-if="scope.row.businessBaoJia.audit+'' === '1'" type="success">通过</el-tag>
          </template>
          </el-table-column>
          <el-table-column label="开票状态">
            <template slot-scope="scope">
            <el-tag v-if="scope.row.kaiPiaoStatus +'' ==='0' && scope.row.businessBaoJia.audit+'' !== '1' " type="info">不可开票</el-tag>
            <el-tag v-if="scope.row.kaiPiaoStatus +'' ==='0' && scope.row.businessBaoJia.audit+'' === '1' " type="success">待开票</el-tag>
            <el-tag v-if="scope.row.kaiPiaoStatus +'' ==='1' && scope.row.businessBaoJia.audit+'' === '1' " type="success">开票中</el-tag>
            <el-tag v-if="scope.row.kaiPiaoStatus+'' ==='2'" type="warning">开票完成</el-tag>
          </template>
          </el-table-column>
          <!-- <el-table-column prop="orderSchedule" label="订单进度">
            </el-table-column> -->
          <el-table-column label="创建时间">
            <template slot-scope="scope">
                <span><i class="el-icon-time"></i>{{scope.row.createTime}}</span>
              </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="xiangQing(scope.row)">详情</el-button>
              <el-button
                v-if="scope.row.kaiPiaoStatus +'' !=='2' && scope.row.businessBaoJia.audit+'' === '1'"
                size="mini"
                type="primary"
                @click="toKaiPiao(scope.row)">开票</el-button>
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
  <!-- 详情页 -->
  <div v-show="nowTab === 2">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-menu"></i>项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>我的项目</el-breadcrumb-item>
        <el-breadcrumb-item>项目详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-header style="padding: 0px;display:flex;justify-content:space-between;margin-top:20px;">
    </el-header>
    <el-card class="box-card" style="margin-top:10px;">
      <div slot="header" class="clearfix">
        <span style="line-height: 5px;"><el-tag type="danger">基础信息</el-tag></span>
        <!-- <el-button size="small" style="float: right;" type="primary" @click="">编辑</el-button> -->
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">项目名称</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span class="msg-span">{{itemProject.projectName}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">客户单位</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span class="msg-span">{{itemProject.processUnit.clientCompanyName}} </span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">所属车型</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span class="msg-span">{{itemProject.car.name}} </span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">预报价状态</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span v-if="itemProject.yuBaoJia.audit+'' === 'undefined'" type="info">无</span>
              <span v-if="itemProject.yuBaoJia.audit+'' === '0'">审核中</span>
              <span v-if="itemProject.yuBaoJia.audit+'' === '2'" type="danger">驳回</span>
              <span v-if="itemProject.yuBaoJia.audit+'' === '1'" type="success">通过</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">商务报价状态</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span v-if="itemProject.businessBaoJia.audit+'' === 'undefined'" type="info">无</span>
              <span v-if="itemProject.businessBaoJia.audit+'' === '0'">审核中</span>
              <span v-if="itemProject.businessBaoJia.audit+'' === '2'" type="danger">驳回</span>
              <span v-if="itemProject.businessBaoJia.audit+'' === '1'" type="success">通过</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">订单数量</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span class="msg-span">{{itemProject.orderNums}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">项目状态</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span class="msg-span">进行中</span>
              <!-- <span v-if="itemProject.status ==='1'">完结</span> -->
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">创建时间</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span class="msg-span">{{itemProject.createTime}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text item" v-show="itemProject.status === '3'">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">完结时间</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span class="msg-span">{{itemProject.endtime}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="box-card" style="margin-top:30px;">
      <div slot="header" class="clearfix">
        <span style="line-height: 5px;"><el-tag type="danger">订单列表</el-tag></span>
        <el-button type="primary" @click="toAddOrder">添加订单</el-button>
      </div>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <el-table :data="orderList" style="width: 100%">
            <el-table-column prop="orderName" label="产品名称" width="180">
            </el-table-column>
            <el-table-column label="客户单位" width="180">
              <template slot-scope="scope">
                  <p>{{itemProject.processUnit.clientCompanyName}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="" label="进度" width="180">
              <template slot-scope="scope">
                  <el-tag>药检</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="订单状态">
              <template slot-scope="scope">
                  <el-tag v-if="scope.row.status+'' === ''" type="info">加工中</el-tag>
                  <el-tag v-if="scope.row.status+'' === '1'" type="danger">完成</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作">
              <template slot-scope="scope">
                <!-- <span>{{scope.row.addUserId}}</span>
                <span>{{uid}}</span> -->
                  <el-button
                    v-if="scope.row.addUserId== ''+uid || uid+''==='3'"
                    size="mini"
                    type="primary"
                    @click="toInfo(scope.row.id)">查看详情</el-button>
                </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-card>
    <!--商务报价详情-->
    <el-card class="box-card" style="margin-top:10px;">
      <div slot="header" class="clearfix">
        <span style="line-height: 5px;"><el-tag type="danger">商务报价</el-tag></span>
        <el-button type="primary" @click="toAddShangWu">添加商务报价</el-button>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">客户单位</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span class="msg-span">{{businessBaoJiaInfo.clientCompanyName}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">联系人</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span class="msg-span">{{businessBaoJiaInfo.contactPerson}} </span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">联系电话</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span class="msg-span">{{businessBaoJiaInfo.contactPhone}} </span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">车型</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span class="msg-span">{{businessBaoJiaInfo.carType}} </span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">税率</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span class="msg-span">{{businessBaoJiaInfo.tax}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">含税总价</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span class="msg-span">{{businessBaoJiaInfo.total}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">不含税总价</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span class="msg-span">{{businessBaoJiaInfo.noTaxTotal}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text item" v-if="businessBaoJiaInfo.submitType+''==='1'">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">上传文件</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <a :href="businessBaoJiaInfo.fuJianUrl" download="w3logo" style="color:blue;">下载原文件</a>
            </div>
          </el-col>
        </el-row>
      </div>
      <!--产品列表-->
      <el-card class="box-card" style="margin-top:25px;" v-if="businessBaoJiaInfo.submitType+''==='0'">
        <div slot="header" class="clearfix">
          <span>产品列表</span>
        </div>
        <div>
          <el-table :data="businessBaoJiaInfo.businessProductList" border style="width: 100%">
            <el-table-column fixed prop="productName" label="产品名称">
            </el-table-column>
            <!-- <el-table-column prop="" label="图片">
                <template slot-scope="scope">
            <img class="image" v-bind:src="scope.row.picUrls[0]" style="height:30px;width:30px;">
          </template>
              </el-table-column> -->
            <el-table-column prop="wenlidaima" label="纹理代码">
            </el-table-column>
            <el-table-column prop="productNum" label="数量">
            </el-table-column>
            <el-table-column prop="price" label="含税">
            </el-table-column>
            <el-table-column prop="price" label="单价">
            </el-table-column>
            <el-table-column prop="area" label="面积">
            </el-table-column>
            <el-table-column prop="price" label="不含税价格">
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </el-card>

    <!--预报价-->
    <el-card class="box-card" style="margin-top:10px;">
      <div slot="header" class="clearfix">
        <span style="line-height: 5px;"><el-tag type="danger">预报价</el-tag></span>
        <el-button type="primary" @click="toAddYuBao">添加预报价</el-button>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">客户单位</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span class="msg-span">{{yuBaoJiaInfo.clientCompanyName}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">联系人</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span class="msg-span">{{yuBaoJiaInfo.contactPerson}} </span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">联系电话</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span class="msg-span">{{yuBaoJiaInfo.contactPhone}} </span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">车型</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span class="msg-span">{{yuBaoJiaInfo.carType}} </span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">税率</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span class="msg-span">{{yuBaoJiaInfo.tax}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">含税总价</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span class="msg-span">{{yuBaoJiaInfo.total}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">不含税总价</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <span class="msg-span">{{yuBaoJiaInfo.noTaxTotal}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="text item" v-if="yuBaoJiaInfo.submitType+''==='1'">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-tag type="info">上传文件</el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="grid-content bg-purple-light">
              <a :href="yuBaoJiaInfo.fuJianUrl" download="w3logo" style="color:blue;">下载原文件</a>
            </div>
          </el-col>
        </el-row>
      </div>
      <!--产品列表-->
      <el-card class="box-card" style="margin-top:25px;" v-if="yuBaoJiaInfo.submitType+''==='0'">
        <div slot="header" class="clearfix">
          <span>产品列表</span>
        </div>
        <div>
          <el-table :data="yuBaoJiaInfo.businessProductList" border style="width: 100%">
            <el-table-column fixed prop="productName" label="产品名称">
            </el-table-column>
            <!-- <el-table-column prop="" label="图片">
                <template slot-scope="scope">
            <img class="image" v-bind:src="scope.row.picUrls[0]" style="height:30px;width:30px;">
          </template>
              </el-table-column> -->
            <el-table-column prop="wenlidaima" label="纹理代码">
            </el-table-column>
            <el-table-column prop="productNum" label="数量">
            </el-table-column>
            <el-table-column prop="price" label="含税">
            </el-table-column>
            <el-table-column prop="price" label="单价">
            </el-table-column>
            <el-table-column prop="area" label="面积">
            </el-table-column>
            <el-table-column prop="price" label="不含税价格">
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </el-card>
    <div class="handle-box" style="float:right;margin-top:25px;">
      <el-button type="primary" icon="plus" class="mr10" @click="goBack()">返回列表</el-button>
    </div>
  </div>
  <!-- 添加表单 -->
  <el-dialog title="项目信息" :visible.sync="dialogFormVisible" width='40%'>
    <div class="form-box">
      <el-form ref="projectfrom" :model="projectfrom" :rules="rules" label-width="120px">
        <el-form-item label="选择车型:" prop="carId">
          <template>
    <el-select v-model="selec_car" filterable  placeholder="请选择">
      <el-option
        v-for="item in cars"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    </template>
        </el-form-item>
        <el-form-item label="选择客户单位:" prop="unitId">
          <template>
    <el-select v-model="projectfrom.unitId" filterable  placeholder="请选择">
      <el-option
        v-for="item in units"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    </template>
        </el-form-item>
        <el-form-item label="项目名称：" prop="projectName">
          <el-input placeholder="请输入项目名称" v-model="projectfrom.projectName"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" v-model="projectfrom.remark"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="this.addloading" @click="addProject('projectfrom')">确 定</el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
    </div>
  </el-dialog>

  <el-dialog title="开票申请" :visible.sync="dialogFormVisible2" width='80%' v-loading="tableLoading2">
    <div class="form-box">
      <div>
        开票类型 :<el-tag v-if="itemKaiPiao.financeBiLi+'' !== '100'" type="warning">欠款开票</el-tag>
        <el-tag v-if="itemKaiPiao.financeBiLi+'' === '100'" type="success">到款开票</el-tag>
      </div>
      <div style="margin-top:5px;">
        到款比例 :<el-tag  type="warning">{{itemKaiPiao.financeBiLi}}</el-tag>
      </div>
      <div style="margin-top:5px;">
        到款金额 :<el-tag  type="default">{{itemKaiPiao.financeJinE}}</el-tag>
      </div>
      <div style="margin-top:5px;">
        最终优惠价:<el-tag  type="default">{{itemKaiPiao.businessBaoJia.finalBaoJia}}</el-tag>
      </div>
      <div>
        <p>剩余开票金额: <el-tag type="danger">{{itemKaiPiao.needKaiPiao}}</el-tag></p>
      </div>
      <div style="width:100%;height:1px;border-top:1px solid;margin-bottom:15px;"></div>
      <el-form ref="kaiPiao" :rules="rules" :model="this.kaiPiao" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="开票单位名称：" prop="unitName">
                <el-input v-model="kaiPiao.unitName"></el-input>
              </el-form-item>
              <el-form-item label="欠款开票原因：" prop="shangWuRemark">
                <el-input v-model="kaiPiao.shangWuRemark"></el-input>
              </el-form-item>

                <!-- <el-form-item label="合同页：" prop="heTongYe">
                  <el-input v-model="kaiPiao.heTongYe"></el-input>
                </el-form-item>
                <el-form-item label="名 称：" prop="unitName">
                  <el-input v-model="kaiPiao.unitName"></el-input>
                </el-form-item>
                <el-form-item label="地 址：" prop="unitDiZhi">
                  <el-input v-model="kaiPiao.unitDiZhi"></el-input>
                </el-form-item>
                <el-form-item label="开户银行：" prop="unitYinHang">
                  <el-input v-model="kaiPiao.unitYinHang"></el-input>
                </el-form-item>  -->
            </div>
            <div v-if="imageUrls.length > 0" style="border: 1px dashed #d9d9d9;max-height:358px;margin-bottom:5px;">
              <el-row :gutter="20" style="margin-top:10px;">
                <el-col :span="6" v-for="imageUrl in imageUrls ">
                  <el-card :body-style="{ padding: '0px' }" class="mould-card">
                    <img class="image" v-bind:src="imageUrl" style="max-height:358px;">
                    <div style="text-align:center;">
                      <el-button type="text" @click="delMouldImage(imageUrl)"><i class="el-icon-error" style="color:red;"></i></el-button>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="类型：" prop="ziLiaoType">
                <el-radio-group v-model="kaiPiao.ziLiaoType">
                  <el-radio label="沿用老资料" value="0"></el-radio>
                  <el-radio label="新开票信息" value="1"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="开票信息资料：">
                <el-form-item label="上传文件：" >
                  <div v-show="wen_jian_url_2 !== ''">
                    <p style="color: blue;">上传成功</p>
                  </div>
                  <div v-show="wen_jian_url_2 === ''">
                      <vue-core-image-upload :class="['el-button', 'el-button--primary']"
                      :crop="false"
                       inputOfFile="imageFile"
                       :url="upload"
                      extensions="png,ppt,docx,txt,jpg,xlsx,pdf"
                      :max-file-size="5242880"
                      :data="wenjianData" text="上传文件"
                      :multiple="true"
                      :multiple-size="30"
                      credentials="true"
                      @imageuploaded="imageupwenjian2" @errorhandle="handleError">
                      </vue-core-image-upload>
                  </div>
                </el-form-item>
                <!-- <div>
                  <vue-core-image-upload :crop="false" inputOfFile="imageFile" :url="upload" extensions="png,gif,jpeg,jpg" :class="['el-button', 'el-button--primary']" :max-file-size="5242880" :data="imageData" text="上传图片" :multiple="true" :multiple-size="30" credentials="true"
                    @imageuploaded="imageuploaded" @errorhandle="handleError">
                  </vue-core-image-upload>
                </div> -->
              </el-form-item>
              <!-- <el-form-item label="税 号：" prop="unitShuiHao">
                <el-input v-model="kaiPiao.unitShuiHao"></el-input>
              </el-form-item>
              <el-form-item label="电 话：" prop="unitTel">
                <el-input v-model="kaiPiao.unitTel"></el-input>
              </el-form-item>
              <el-form-item label="账 号：" prop="unitZhangHao">
                <el-input v-model="kaiPiao.unitZhangHao"></el-input>
              </el-form-item> -->
            </div>
          </el-col>
        </el-row>
        <div style="width:100%;height:1px;border-top:1px solid;margin-bottom:15px;"></div>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="货物或应税劳务名称：" prop="laoWuMingCheng" label-width="160px">
                <el-input v-model="kaiPiao.laoWuMingCheng"></el-input>
              </el-form-item>
              <el-form-item label="规格型号：" prop="guiGeXingHao">
                <el-input v-model="kaiPiao.guiGeXingHao"></el-input>
              </el-form-item>
              <el-form-item label="单 位：" prop="danWei">
                <el-input v-model="kaiPiao.danWei"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="数 量：" prop="shuLiang">
                <el-input v-model="kaiPiao.shuLiang"></el-input>
              </el-form-item>
              <el-form-item label="含税金额：" prop="jinE">
                <el-input-number v-model="kaiPiao.jinE" controls-position="right"  :min="1" ></el-input-number>
                <!-- <el-input-number v-model="kaiPiao.jinE"></el-input-number> -->
                <!-- <el-input v-model="kaiPiao.jinE"></el-input> -->
              </el-form-item>
              <el-form-item label="上传文件：" >
                <div v-show="wen_jian_url !== ''">
                  <p style="color: blue;">上传成功</p>
                </div>
                <div v-show="wen_jian_url === ''">
                    <vue-core-image-upload :class="['el-button', 'el-button--primary']"
                    :crop="false"
                     inputOfFile="imageFile"
                     :url="upload"
                    extensions="png,ppt,docx,txt,jpg,xlsx,pdf"
                    :max-file-size="5242880"
                    :data="wenjianData" text="上传文件"
                    :multiple="true"
                    :multiple-size="30"
                    credentials="true"
                    @imageuploaded="imageupwenjian" @errorhandle="handleError">
                    </vue-core-image-upload>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <div style="width:100%;height:1px;border-top:1px solid;margin-bottom:15px;"></div>
        <el-row :gutter="20">
          <!-- <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="到款时间：" prop="faPiaoNum" label-width="160px">
                <el-input v-model="kaiPiao.faPiaoNum"></el-input>
              </el-form-item>
              <el-form-item label="到款金额：" prop="remark">
                <el-input v-model="kaiPiao.remark"></el-input>
              </el-form-item>
            </div>
          </el-col> -->
          <!-- <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="是否付清：" prop="isFuQing">
                <el-switch v-model="kaiPiao.isFuQing"></el-switch>
              </el-form-item>
              <el-form-item label="付款方式：" prop="fuKuanType">
                <el-radio-group v-model="kaiPiao.fuKuanType">
                  <el-radio label="现金" value="0"></el-radio>
                  <el-radio label="汇票" value="1"></el-radio>
                  <el-radio label="汇款" value="2"></el-radio>
                  <el-radio label="支票" value="3"></el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col> -->
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addKaiPiao">提 交</el-button>
      <el-button @click="quxiaoKai">取 消</el-button>
    </div>
  </el-dialog>

</div>
</template>
<script>
import JLApiUtils from '../../utils/JLApiUtils.js';
import VueCoreImageUpload from 'vue-core-image-upload';
export default {
  components: {
    VueCoreImageUpload
  },
  data() {
    return {
      wen_jian_url:'',
      wen_jian_url_2:'',
      upload:'',
      wenjianData: {
          userId: '',
          imgPakage: 'yu_bao_jia'
      },
      selec_car: '',
      cars: [],
      units: [],
      tableLoading2: false,
      dialogFormVisible2: false,
      kaiPiao: {
        projectId: '',
        projectName: ''
      },
      orderList: [],
      itemProject: {
        yuBaoJia: {
          audit: ''
        },
        businessBaoJia: {
          audit: ''
        },
        car:{
          name:''
        },
        processUnit:{
          cilentCompanyName:''
        }
      },
      imageData: {
        userId: '',
        imgPakage: 'sfm_shou'
      },
      imageUrls:[],
      nowTab: 1,
      username: '',
      name: '',
      uid: '',
      tableLoading: false,
      addloading: false,
      dialogFormVisible: false,
      projectfrom: {
        projectName: '',
        cilentCompanyName: '',
        remark: '',
        unitId:'',
        addUserId: '',
        addUserName: ''
      },
      currentPage: 1,
      itemKaiPiao: {
        "businessBaoJia":{}
      },
      totalnum: 0,
      pagesize: 10,
      select_word: '',
      tableData: [],
      businessBaoJiaInfo: {},
      yuBaoJiaInfo: {},
      // 上部分
      rules: {
        jinE: [{
            required: true,
            message: '请输开票金额',
            trigger: 'blur'
          },
        ]
      }
    }
  },
  methods: {
    // 上传图片失败
    handleError() {
      this.$notify.error({
        title: '上传失败',
        message: '图片上传出现异常'
      });
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
    imageuploaded(data) {
      let self = this;
      if (data.url.length !== 'undefined' && data.url.length > 0) {
        let url = data.url
        let urls = self.imageUrls;
        for (var i = 0; i < url.length; i++) {
          urls.push(url[i]);
        }
        self.imageUrls = urls;
      }
    },
    imageupwenjian2(data) {
      this.$message.success("上传成功");
      let urls = [];
      urls = data.url;
      if(urls != 'undefinded' && urls.length > 0 ){
        this.wen_jian_url_2 = urls[0];
      }
    },
    imageupwenjian(data) {
      this.$message.success("上传成功");
      let urls = [];
      urls = data.url;
      if(urls != 'undefinded' && urls.length > 0 ){
        this.wen_jian_url = urls[0];
      }
    },
    toAddOrder(){
      this.$router.push('/order/add')
    },
    toAddYuBao(){
      this.$router.push('/offer/per/add')
    },
    toAddShangWu(){
      this.$router.push('/offer/bus/add')
    },
    // 获表
    getAllCarsList() {
      let _this = this
      this.getRequest("/car/all").then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          var re = resp.data.data.allcarlist;
          let item = []
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
            this.cars = item;
          }
        }
      })
    },
    quxiaoKai() {
      let self = this;
      self.dialogFormVisible2 = false;
      self.kaiPiao = {
        projectId: '',
        projectName: ''
      };
    },
    toKaiPiao(item) {
      let self = this;
      self.dialogFormVisible2 = true;
      self.kaiPiao = {
        projectId: '',
        projectName: '',
        addUserId: '',
        addUserName: '',
        wenJianUrl:'',
        ziLiaoUrl:'',
      };
      this.wen_jian_url = "";
      this.wen_jian_url_2 = "";
      self.imageUrls = [];
      self.itemKaiPiao = item;
    },
    addKaiPiao() {
      let self = this;
      let parmas = {}
      parmas = this.kaiPiao;
      if (this.kaiPiao.jinE == 'undefined' || this.kaiPiao.jinE == '') {
        this.$message.error("请填写金额");
        return;
      }
      if(this.kaiPiao.jinE > this.itemKaiPiao.needKaiPiao){
        this.$message.error("开票金额有误")
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
      parmas.xinXiUrl = url;
      parmas.projectId = self.itemKaiPiao.id;
      parmas.projectName = self.itemKaiPiao.projectName;
      parmas.addUserId = this.uid;
      parmas.addUserName = this.name;
      parmas.wenJianUrl = this.wen_jian_url;
      parmas.ziLiaoUrl = this.wen_jian_url_2;

      parmas.financeBiLi = self.itemKaiPiao.financeBiLi;
      parmas.financeJinE = self.itemKaiPiao.financeJinE;
      parmas.finalBaoJia = self.itemKaiPiao.businessBaoJia.finalBaoJia;
      parmas.needKaiPiao = self.itemKaiPiao.needKaiPiao;
      self.tableLoading2 = true;
      this.postRequest("/kai/piao/add", parmas).then(resp => {
        self.tableLoading2 = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          this.$message.success("执行成功")
          this.dialogFormVisible2 = false;
          this.getCollectMouldList();
        } else {
          this.$message.error("执行失败")
        }
      })
    },
    toInfo(id) {
      this.$router.push('/plant/order/info/' + id)
    },
    goBack() {
      this.nowTab = 1;
    },
    xiangQing(item) {
      this.nowTab = 2;
      this.itemProject = item;
      this.orderList = item.orders
      this.businessBaoJiaInfo = item.businessBaoJia
      this.yuBaoJiaInfo = item.yuBaoJia
    },
    toadd() {
      this.dialogFormVisible = true;
      this.addloading = false;
    },
    addProject(formName) {
      this.addloading = true;
      let self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          self.projectfrom.addUserId = self.uid;
          self.projectfrom.addUserName = self.name;
          self.projectfrom.carId = self.selec_car;
          this.postRequest("/project/list/add/project", self.projectfrom).then(resp => {
            if (resp && resp.status == 200 && resp.data.code == 0) {
              var id = resp.data.data.id;
              this.dialogFormVisible = false;
              this.$message.success("添加成功")
              this.tableLoading = true;
              this.getCollectMouldList();
            } else {
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
      this.getRequest("/project/list/listbypage?page=" + this.currentPage + "&size=" + this.pagesize).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200 && resp.data.code == 0) {
          _this.tableData = resp.data.data.projectlist
          _this.totalnum = resp.data.data.count
        }
      })
    },
    // 获表
    getAllUnitByCarList(carId) {
      let _this = this
      this.getRequest("/unit/list/bycarid?carId=" + carId).then(resp => {
        if (resp && resp.status == 200 && resp.data.code == 0) {
          var re = resp.data.data.unitlist;
          let item = []
          if (re != 'undefined' && re.length > 0) {
            for (var i = 0; i < re.length; i++) {
              let elem = {
                label: '',
                value: ''
              }
              elem.label = re[i].clientCompanyName
              elem.value = re[i].id
              item.push(elem);
            }
            this.units = item;
          }
        }else {
          this.$message.error("未找到该车型下的单位，请先进行添加")
        }
      })
    },

  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableLoading = true;
      this.getCollectMouldList();
      this.getAllCarsList();
    })
    this.username = localStorage.getItem('cp_username');
    this.uid = localStorage.getItem('cp_uid');
    this.name = localStorage.getItem('cp_name');
    this.wenjianData.userId = this.uid = localStorage.getItem('cp_uid');
    this.upload = JLApiUtils.upload;
  },
  watch: {　　　　　　　　
    selec_car(curVal, oldVal) {
      if(curVal !== '' && curVal !== 'undefined')　{
        this.getAllUnitByCarList(curVal);
      }　　　　　　　　　　　　　　　　　
    }
  },
  computed: {
    data() {
      const self = this;
      return self.tableData.filter(function(d) {
        if (d.projectName.indexOf(self.select_word) > -1 ||
          d.cilentCompanyName.indexOf(self.select_word) > -1
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
