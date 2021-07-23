<script>
import Vue from 'vue'

export default {
  onLaunch: function () {
		uni.getSystemInfo({
			success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
							Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
							Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif
					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif       
					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
			}
	})
	
  },
  onShow: function () {
    
  },
  onHide: function () {
   
  },
	methods:{
		
		
	}
}
</script>

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";
	page {
		font-family: 'PingFangSC-Regular', 'monospace', 'sans', 'serif', 'Microsoft YaHei';
		font-weight: 400;
		margin:0;
		padding: 0;
		box-sizing: border-box;
	}
	/*每个页面公共css */
	.contont {
		font-family: 'PingFangSC-Regular', 'monospace', 'sans', 'serif', 'Microsoft YaHei';
		font-weight: 400;
	}
	/* 粗体 */
	 .bold {
	  font-family: PingFangSC, PingFangSC-Medium;
	  font-weight: 500;
	 }
	 /* 常规字体 */
	 .regular {
	  font-family: 'PingFangSC-Regular';
	  font-weight: 400;
	 }
	 
</style>
