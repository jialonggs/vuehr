<template>
<div class="contents" >
<form id="theForm">
	<div class="head_title"><b>嘉龙售后单
		</b>
	</div>
	<div class="block-title">
		<b>基本信息</b>
	</div>
	<div class="block-area">
		<div class="l-tr">
			<span class="l_tr_title">客户单位：</span>
			<span class="l_tr_content_full" style="width:200px;">{{this.ruleForm.danwei}}&nbsp;</span>
			<span class="l_tr_title">联系人：</span>
			<span class="l_tr_content_full" style="width:200px;">{{this.ruleForm.contactUser}}</span>
		</div>
		<div class="l-tr">
			<span class="l_tr_title">联系电话：</span>
			<span class="l_tr_content_full" style="width:200px;">{{this.ruleForm.shBaoGao.contactPhone}}&nbsp;</span>
			<span class="l_tr_title">前往地址：</span>
			<span class="l_tr_content_full" style="width:200px;">{{this.ruleForm.address}}</span>
		</div>
		<div class="l-tr">
			<span class="l_tr_title">质量总监：</span>
			<span class="l_tr_content_full" style="width:200px;">{{this.ruleForm.shBaoGao.zl}}</span>
		</div>
		<div class="l-tr">
			<span class="l_tr_title">出厂光泽：</span>
			<span class="l_tr_content_full" style="width:200px;">{{this.ruleForm.shBaoGao.gz}}</span>
		</div>
		<span>按贵司来函要求服务事项如下</span>
		<div class="l-tr">
			<span class="l_tr_title">修复内容：</span>
			<span class="l_tr_content_full" style="width:200px;">{{this.ruleForm.shBaoGao.fixContent}}</span>
		</div>
		<div class="l-tr">
      <span class="l_tr_title">备注：</span>
      <span class="l_tr_content_full" style="width:200px;">{{this.ruleForm.remark}}</span>
		</div>
		</div>
		<div class="block-title" style="margin-top:15px;">
			<div style="min-height:150px;">
			 <b>客户评价</b>
			 <div style="margin-top:25px;">
				 <!-- <span>&nbsp;{{this.ruleForm.addUserName}}</span> -->
			 </div>
		 </div>
	    <div style="min-height:150px;">
	      <b>客户签字</b>
	      <div style="margin-top:25px;">
	        <!-- <span>&nbsp;{{this.ruleForm.addUserName}}</span> -->
	      </div>
	    </div>
	   </div>
  <div class="block-title" style="margin-top:20px;">
     <b>图片信息</b>
   </div>
   <div class="block-area">
       <div v-for="item1 in imageUrls" style="margin-top:5px;">
         <img  v-bind:src="item1" style="width:635px"/>
       </div>
   </div>
	</form>
</div>
</template>
<script>
export default {
    data() {
        return {
            ruleForm:{
							shBaoGao:{},
							},
            productData:[],
            houFiveData:[],
            tableData6: [],
						imageUrls:[]
        };
    },
    methods: {
      getInfo(id) {
        let self = this;
        this.getRequest("/after/sale/job/info?id=" + id).then(resp => {
          if (resp && resp.status == 200 && resp.data.code == 0) {
            self.ruleForm = resp.data.data
						var itemBg = resp.data.shBaoGao
						var pic = "";
						if ('undefined' != self.itemBg) {
              pic = itemBg.picUrls
            }
						var picUrls = []
            var te = this.$options.filters['splitRejectRemark'];
            if ('undefined' != pic && pic.length > 0) {
              picUrls = te(pic)
            }
						self.imageUrls = picUrls
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
