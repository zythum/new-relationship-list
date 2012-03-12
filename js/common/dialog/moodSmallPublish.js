/**
 *   心情微博发布气泡弹层
 *   在feed列表中，发心情按钮使用的弹层
 * @id
 * @param {Object} node 组件最外节点
 * @return {Object} 实例
 * @author xionggq | guoqing5@staff.sina.com.cn
 * @create at 2011-12-02
 */
$Import('common.extra.shine');
$Import('ui.dialog');
$Import('common.trans.mood');
$Import('kit.extra.language');
$Import('common.mood.moodPublish');
$Import('common.channel.mood');
$Import('common.mood.shareFeed');

STK.register('common.dialog.moodSmallPublish', function($) {
	//---常量定义区----------------------------------

	//-------------------------------------------
	return function(opts) {
		/**
		 * that是外抛的对象
		 */
		var that = {};
		/**
		 * 语言转换的函数
		 */
		var $L = $.kit.extra.language;
		/**
		 * LOADING用来显示等待文案
		 */
		var LOADING = $L('<div class="W_loading" style="width:325px;padding-top:15px;padding-bottom:15px;text-align:center"><span>#L{正在加载，请稍候}...</span></div>');
		/**
		 * dia是实例化的dialog
		 * bubbleListDom用来存储builder生成的节点
		 * publisher是调用common.mood.moodPublish后存储的句柄
		 */
		var dig = null, bubbleListDom = null, publisher = null , shareFeed;
		opts = $.parseParam({
			//'template':LOADING,
			'isHold': true
		}, opts);
		/**
		 * 实例化使用的函数
		 */
		var init = function() {
			dig = $.ui.dialog(opts);
			dig.setTitle($L("#L{Hey！今天心情如何？}"));
			dig.setContent(LOADING);
			$.custEvent.define(that, ["success","error"]);
			setDialogContent();
		}
		/**
		 * 出错的时候alert显示错误信息
		 */
		var getBubbleError = function(json) {
			$.ui.alert(json.msg);
			dig && dig.hide();
		};
		/**
		 * 发布成功之后，向外层抛一个成功的自定义事件
		 * 使用通用样式提示用户发布成功
		 * 使用channel告诉右侧模块，更改发布状态
		 */
		var  publishSuc = function(evt,json)
		{
			 $.custEvent.fire(that,"success",json);
			 hide();
			 //弹出操作成功
			 $.ui.litePrompt($L('#L{发布成功}') , {'type':'succM','timeout':'1000'});
			 $.common.channel.mood.fire("changeMoodState" , {state : "published"});
		};
		/**
		 * 出错的时候向外层抛出自定义事件，告知出错了
		 */
		var publishError = function(evt,json)
		{
			 $.custEvent.fire(that,"error",json);
			  //hide();
		};
		/**
		 * 设置弹层中的内容，发请求获取心情内容和textarea一并填入dialog
		 */
		var setDialogContent = function() {
			$.common.trans.mood.getTrans('simppublish', {
				'onSuccess' : function(json) {
					var html = json.data.html;
					dig.setContent(html);
					var innerNode = dig.getDomList().inner[0];
					var outerNode = dig.getDomList().layoutContent[0];
					bubbleListDom = $.builder(outerNode).list;
					publisher = $.common.mood.moodPublish(innerNode);
					shareFeed = $.common.mood.shareFeed({
						node : innerNode,
						layoutNode : outerNode						
					});
					$.custEvent.add(publisher, "success", publishSuc);
					$.custEvent.add(publisher, "error", publishError);
					dig.setMiddle();
				},
				'onError' : getBubbleError,
				'onFail' : getBubbleError
			}).request();
		};
		/**
		 * 外抛hide方法
		 */
		var hide = function() {
			dig && dig.hide();
		};
		/**
		 * 外抛show方法
		 */
		var show = function() {
			dig && dig.show();
			dig && dig.setMiddle();
		};
		/**
		 * 外抛destroy，用来进行弹层销毁
		 */
		var destroy = function() {
			shareFeed && shareFeed.destroy && shareFeed.destroy(); 
			dig && dig.destroy && dig.destroy();
			dig = bubbleListDom = shareFeed = undefined;
		};
		/**
		 * 外抛重置方法
		 */
		 var reset = function() {
			publisher && publisher.reset && publisher.reset();	 
		 };
		init();
		that.show = show;
		that.hide = hide;
		that.destroy = destroy;
		that.reset = reset;
		return that;
	};
});
