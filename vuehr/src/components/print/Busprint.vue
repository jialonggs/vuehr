<template>
<div class="contents" >
<form id="theForm">
	<div class="head_title"><b>嘉龙商务报价单
		</b>
	</div>
	<div class="block-title">
		<b>基本信息</b>
	</div>
	<div class="block-area">
		<div class="l-tr">
			<span class="l_tr_title">客户单位：</span>
			<span class="l_tr_content_full" style="width:200px;">{{this.ruleForm.clientCompanyName}}&nbsp;</span>
			<span class="l_tr_title">联系人：</span>
			<span class="l_tr_content_full" style="width:200px;">{{this.ruleForm.contactPerson}}</span>
		</div>
		<div class="l-tr">
			<span class="l_tr_title">联系电话：</span>
			<span class="l_tr_content_full" style="width:200px;">{{this.ruleForm.contactPhone}}&nbsp;</span>
			<span class="l_tr_title">车型：</span>
			<span class="l_tr_content_full" style="width:200px;">{{this.ruleForm.carType}}</span>
		</div>
		<div class="l-tr">
      <span class="l_tr_title">备注：</span>
      <span class="l_tr_content_full" style="width:200px;">{{this.ruleForm.remark}}</span>
		</div>
		</div>
 <div class="block-title">
		<b>商务信息</b>
	</div>
  <div class="logs1">
   <table>
      <tr style="width:100%">
      <td style="width:100%">
        1、此报价为纯蚀纹费用，不包含运杂费、纹理试模费、
        国定假日加班费,及预检不合格需要嘉龙帮助额外产生的相关费用。
      </td>
     </tr>
    <tr>
      <td width="640px;">2、型腔蚀纹区域如进行过焊接，
        可能会导致纹理质量不佳。贵司交付模具至我司时，
        应书面告知模具是否存在材质不同、是否烧焊，不得隐瞒，
        否则导致蚀纹工作未能开展或者中途停止，本司免责。</td>
     </tr>
      <tr>
       <td>3、纹理加工后，因本司原因导致纹理及模具出现问题而发生的所有赔款，
         最高赔偿为对应模具的蚀纹报价额。</td>
     </tr>
    <tr>
       <td >4、提模要求：模具提走时款项务必全额到帐；贵司请务必亲自送货取货，
         因运输造成的责任，本司免责。</td>
     </tr>
     <tr>
        <td >5、纹理后可能会涉及多次试模。</td>
      </tr>
      <tr>
         <td >6、模具运到嘉龙后，自动视为项目启动。但若中途模具移走，需额外支付相关费用。</td>
       </tr>
       </tbody>
     </table>
 </div>

	<div class="block-title">
		<b>产品详情</b>
	</div>
	<div class="block-area" style="height:300px;">
		<div style="" class="tb-cls">
			<table width="100%">
				<thead>
					<tr>
					<th align="center">产品名称</th>
					<th align="center">图片</th>
					<th align="center">纹理代码</th>
					<th align="center">数量</th>
					<th align="center">含税（16%）小计</th>
					</tr>
				</thead>
				<tbody id="expense_detail_sum_body">
          <tr v-for="item in this.productData">
						<td align="center">{{item.productName}}</td>
            <td style="text-align:center;" id="zztaxExp">
              <img  v-bind:src="item.picUrls[0]" style="width:30px;height:30px;"/>
            </td>
						<td style="text-align:center;" id="zztaxExp">{{item.wenlidaima}}</td>
						<td style="text-align:center;" id="grtaxExp">{{item.productNum}}</td>
						<td style="text-align:center;" id="totalExp">{{item.total}}</td>
					</tr>
			</tbody>
    </table>
		</div>
	</div>
  <div class="block-title" style="margin-top:15px;">
    <div style="float:left;min-height:150px;">
      <b>嘉龙负责人</b>
      <div style="margin-top:25px;">
        <span>&nbsp;{{this.ruleForm.addUserName}}</span>
      </div>
      <div style="margin-top:5px;">
        <span>&nbsp;{{this.ruleForm.createTime | formatDateTime}}</span>
      </div>
    </div>
     <div style="float:right;min-height:150px;">
       <b>客户单位</b>
     </div>
   </div>

   <div class="block-title" v-if="this.houFiveData.length>0">
     <b>产品详情</b>
   </div>
   <div class="block-area"  v-if="this.houFiveData.length>0">
     <div style="" class="tb-cls">
       <table width="100%">
         <thead>
           <tr>
           <th align="center">产品名称</th>
           <th align="center">图片</th>
           <th align="center">纹理代码</th>
           <th align="center">数量</th>
           <th align="center">含税（16%）小计</th>
           </tr>
         </thead>
         <tbody id="expense_detail_sum_body">
            <tr v-for="item in this.houFiveData">
             <td align="center">{{item.productName}}</td>
              <td style="text-align:center;" id="zztaxExp">
                <img  v-bind:src="item.picUrls[0]" style="width:30px;height:30px;"/>
              </td>
             <td style="text-align:center;" id="zztaxExp">{{item.wenlidaima}}</td>
             <td style="text-align:center;" id="grtaxExp">{{item.productNum}}</td>
             <td style="text-align:center;" id="totalExp">{{item.total}}</td>
           </tr>
       </tbody>
      </table>
     </div>
   </div>
  <div class="block-title" style="margin-top:20px;">
     <b>产品照片</b>
   </div>
   <div class="block-area">
     <div :index="index" v-for="(list, index) in this.productData" style="margin-top:10px;">
       <div>
         <span>{{list.productName}}的图片为:</span>
       </div>
       <div v-for="item1 in list.picUrls" style="margin-top:5px;">
         <img  v-bind:src="item1" style="width:635px"/>
       </div>
     </div>
   </div>
	</form>
</div>
</template>
<script>
export default {
    data() {
        return {
            ruleForm:{},
            productData:[],
            houFiveData:[],
            tableData6: []
        };
    },
    methods: {
      getInfo(id) {
        let self = this;
        this.getRequest("/audit/bus/info?id=" + id).then(resp => {
          if (resp && resp.status == 200 && resp.data.code == 0) {
            self.ruleForm = resp.data.data.businfo
            let product = resp.data.data.businfo.businessProductList
            let remarks = resp.data.data.businfo.rejectRemark;
            var te = this.$options.filters['splitRejectRemark'];
            this.remarks = te(remarks);
            if ('undefined' != self.product && product.length > 0) {
              let productItem = [];
              let productItem1 = [];
              for (var i = 0; i < product.length; i++) {
                if( i>=4 ){
                  let picUrls = [];
                  let item = {}
                  item = product[i]
                  var te = this.$options.filters['splitUrl'];
                  picUrls = te(product[i].picUrls)
                  item.picUrls = picUrls;
                  productItem1.push(item);
                }else{
                  let picUrls = [];
                  let item = {}
                  item = product[i]
                  var te = this.$options.filters['splitUrl'];
                  picUrls = te(product[i].picUrls)
                  item.picUrls = picUrls;
                  productItem.push(item);
                }
              }
              self.productData = productItem
              self.houFiveData = productItem1
            }
          } else {
            self.$message.error("获取失败");
          }
        })
      }
    },
    created: function() {
      this.urlId = this.$route.params.id;
      this.getInfo(this.urlId);
    }
};
</script>

<style scoped>
.body{font-size:12px;height:auto;font-family: Arial;overflow:auto !important;}
.contents{width:640px;border:0px solid black;margin:0 auto;padding-top:5px; overflow:auto !important;}
.head_title{text-align:center	;font-size:20px;margin-bottom:5px;}
.top_title{font-size:15px;width:100%}
.block-area{
		border:1px solid black;
		padding:2px;
}
.block-title{
		clear:both;
		padding-top:10px;
}
.l-tr{}
.l_tr_title{
		text-align:right;
		display:inline-block;
		vertical-align:top;
		width:100px;
		margin:0px;
		padding-bottom:5px;
}
.l_tr_content{
		text-align:left;
		display:inline-block;
		vertical-align:top;
		width:100px;
		margin:0px;
		padding-bottom:5px;
}

.l_tr_content_full{
		text-align:left;
		display:inline-block;
		vertical-align:top;
		width:500px;
		margin:0px;
		padding-bottom:5px;
}

.div_content_full{
		font-size:15px;
		text-align:left;
		display:inline-block;
		vertical-align:top;
		width:640px;
		margin:0px;
		padding-bottom:5px;
		line-height:22px;
}
.div_p{
		text-indent:2em;
}
.first_title{
		text-align:left	;
		font-size:18px;
		margin-bottom:5px;
		font-weight:bold
}
.div_font_bold{
		font-weight:bold;
}
.div_font_u{
		text-decoration:underline;
}

.tb-cls {margin-top:10px;margin-left:0px;}
.tb-cls table{border-collapse:collapse;}
.tb-cls table th{height:20px;line-height:20px;color:#000;border:1px solid #C9C9C9;}
.tb-cls-th-left{border-left:1px solid #514F49;}
.tb-cls-th-right{border-right:1px solid #514F49;}
.tb-cls table td{	height:20px;line-height:20px;border:1px solid #C6C690;padding:0px 5px;}


.logs {border:1px solid #666666;margin:2px;padding:20px 10px;background-color:#FFF;}
.logs table {width:100%;}
.logs td {border-bottom:1px dotted #EEE;line-height:24px;}

.logs1 {border:1px solid #666666;margin:2px;padding:20px 10px;background-color:#FFF;}
.logs1 table {width:100%;}
.logs1 td {border-bottom:1px dotted #EEE;line-height:24px;}


.btn {height:25px;min-width:70px;
			line-height:20px;
			padding:2px 10px;
			text-align:center;
			margin-top:5px;
			/* background:url('../images/bg_buttom.png') repeat-x; */
			cursor:pointer;
			color:#FFF;
			display:inline-block;}
.handle-banner {
	height:auto;
	text-align:left;
	left:0px;top:0px;
	background-color:#F2F2F2;
	padding:5px 0px 5px 150px;
	z-index:900;
}
</style>
