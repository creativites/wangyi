<template>
	<div id="app" style="height:100%">
		<!--最外层写布局组件标签-->
		<view-box>
			<!--slot="header"是view-box的插槽-->
			<x-header class="header" slot="header" :left-options="{showBack:true,backText:'返回'}" title="网易新闻">
				<div slot="right" >搜索</div>
			</x-header>
			<!--lock-y="true"锁定y方向-->
			<sc :lock-y=true  style="position: absolute;width: 100%; z-index: 100;top: 46px;left: 0;overflow: hidden;">
				<div>
					<!--顶部导航条-->
					<tab class="wy-tab" >
						<tab-item selected>推荐</tab-item>
						<tab-item>要闻</tab-item>
						<tab-item>游戏</tab-item>
						<tab-item>科技</tab-item>
						<tab-item>娱乐</tab-item>
						<tab-item>体育</tab-item>
					</tab>
				</div>
			</sc>
			<!--滚动条刷新加载组件-->
			<scroller style="margin-top: 90px;"
		    class = "my-scroller"
		    :on-refresh="refresh"
		    :on-infinite="infinite"
		    refresh-text = "looding"
		    ref="myRef"
		    >
				<!--轮播组件，挂数据，自动，循环-->
				<swiper  :list="swiperList" :auto="true" :loop="true">
				</swiper>
				<!--滚动（跑马灯）组件-->
				<marquee class="wy-marquee">
					<marquee-item v-for="item in marqueeList">{{item.title}}</marquee-item>
				</marquee>
				<!--图文列表组件-->
				<panel :list="dataList" style="margin-bottom: 0px;">
				</panel>
				<!--<panel :list="moreDataList" style="margin-bottom: 0px;">
				</panel>-->
			</scroller>
			<!--底部插槽-->
			<tabbar slot="bottom" style="position: fixed">
				<!--tabbar主体内容，只允许tabbar-item-->
				<tabbar-item>
					<!--图标插槽-->
					<img src="./assets/icon_nav_button.png" alt="" slot="icon">
					<!--图标下方文字插槽-->
					<span slot="label">首页</span>
				</tabbar-item>
				<tabbar-item>
					<img src="./assets/icon_nav_msg.png" alt="" slot="icon">
					<span slot="label">推荐</span>
				</tabbar-item>
				<tabbar-item>
					<img src="./assets/icon_nav_cell.png" alt="" slot="icon">
					<span slot="label">我的</span>
				</tabbar-item>
			</tabbar>
			
		</view-box>
		<!-- <router-view/> -->
	</div>
</template>

<script>
	//引入ViewBox布局组件，
	import { ViewBox, XHeader, Tabbar, TabbarItem, Scroller as sc, Tab, TabItem, Swiper, Marquee, MarqueeItem, Panel } from 'vux'
	var refArr = ["A","B01","B02", "B03", "B04", "B05", "BO6", "B07", "B08", "B09", "B10"];
	var key = 0;
	var start=0;
	var end=start+9;
	var keyIndex=0;
	var initLoaded=false; //初始化数据是否加载完成
	export default {
		name: 'App',
		methods: {
		    refresh(){
	          console.log("下拉刷新");
		      //下拉刷新
		      initLoaded=false;
		      keyIndex=key++ % refArr.length;
		      console.log(refArr[keyIndex]);
		      var url = "http://3g.163.com/touch/jsonp/sy/recommend/0-9.html"
		      this.$jsonp(url, {
		        miss: "00",
		        refresh: refArr[keyIndex]
		      }).then(data => {
		        console.log(data);
		        //首页新闻列表的数据
		        this.dataList = data.list.filter(item => {
		          return item.addata === null;
		        }).map(item => {
		            return {
		              src: item.picInfo[0].url,
		              title: item.title,
		              desc: item.digest,
		              url: item.link
		            }
		        })
		        //设置提示文本
	 			this.$vux.toast.text("刷新了" + this.dataList.length +"数据", "top");
		        //停止下拉刷新
		        this.$refs.myRef.finishPullToRefresh();
		        initLoaded=true;
		      })
		    },
		    infinite(){
		       console.log("上拉加载");
		      //上啦加载
		      if(!initLoaded){
		        this.$refs.myRef.finishInfinite();
		        return;
		      }
		      //上啦加载
		      var url = `http://3g.163.com/touch/jsonp/sy/recommend/${start}-${end}.html`;
		      this.$jsonp(url, {
		        miss: "00",
		        refresh: refArr[keyIndex]
		      }).then(data => {
		      	console.log("more:"+data);
		        //将数据添加到页面上去
		        this.moreDataList = data.list.filter(item => {
		            return item.addata === null && item.picInfo[0];
		          }).map(item => {
		            return {
		              src: item.picInfo[0].url,
		              title: item.title,
		              desc: item.digest,
		              url: item.link
		          }
		        })
		        this.dataList.push(...this.moreDataList);
		        start += 10;
		        end = start + 9;
		        this.$refs.myRef.finishInfinite();
		      })
		    }
	  	},
		components: { //把各种组件挂在组件属性上
			ViewBox, 	//总体布局组件
			XHeader, 	//头部组件
			Tabbar,		//底部组件
			TabbarItem,
			sc,				//顶部导航拖动，as可以重新定义一个名字
			Tab,			//顶部导航
			TabItem,
			Swiper,		//轮播组件
			Marquee,	//滚动（跑马灯）组件
			MarqueeItem,
			Panel			//图文列表组件
		},
		data: function() {
			return {
				swiperList: [], //轮播组件数据
				dataList: [],		//图文列表组件数据
				marqueeList: [], //滚动组件数据
				moreDataList:[]
			}
		},
		//vue实例创建完成后执行
		created() {
			initLoaded=false;
			var url = "http://3g.163.com/touch/jsonp/sy/recommend/0-9.html";
			this.$jsonp(url).then(data => {
				//取出轮播图数据
				//filter筛选符合条件的数组数据，map映射生成新数组（遍历替换）
				this.swiperList = data.focus.filter(item => {
					return item.addata === null;
				}).map(item => {
					return {
						url: item.link,
						img: item.picInfo[0].url,
						title: item.title
					}
				})
				console.log(this.swiperList);
				//首页新闻列表的数据
				this.dataList = data.list.filter(item => {
					return item.addata === null;
				}).map(item => {
					return {
						src: item.picInfo[0].url,
						title: item.title,
						desc: item.digest,
						url: item.link
					}
				})
				//滚动新闻数据
				this.marqueeList = data.list.filter(item => {
					return item.addata === null;
				}).map(item => {
					return {
						title: item.title,
					}
				})
				initLoaded=true;
			})
		}
	}
</script>
<!--使用less编译css-->
<style lang="less">
	/*引入less编译器*/
	@import '~vux/src/styles/reset.less';
	html,
	body {
		height: 100%;
		width: 100%;
		overflow-x: hidden;
	}
	
	#app {
		.header {
			width: 100%;
			position: absolute;
			z-index: 9;
			left: 0;
			top: 0;
		}
		.wy-tab {
			/*height: 44px;*/
			position: relative;
			/*margin-top: 46px;*/
		}
		.wy-marquee {
			margin: 10px
		}
		/*新闻项布局*/
		.weui-media-box__hd, weui-media-box__hd img{
        width: 102px; 
        height: 78px
	     }
	     .weui-media-box__bd{
	      height:78px
	     }
     /*下拉加载*/
     .my-scroller{
		    /*top: 90px*/
		 }
		 /*.looding-layer{
		  padding-bottom: 53px
		 }*/
	}
</style>