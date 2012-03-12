/**
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 * 
 * 我的首页: 个人信息
 * 实现微博增删时，微博数动态改变
 * @id STK.comp.content.personInfo
 * @param {Node} node 组件最外节点
 * node内需要有包含[node-type="weibo"]的节点turn {Object} 实例 
 * @example 
 * var p = STK.comp.content.personInfo(STK.E('pl_content_personInfo'));
 * //销毁时
 * p.destroy();
 */
$Import('common.channel.feed');
$Import('kit.dom.parseDOM');
$Import('comp.content.darenCard');
 $Import('common.channel.relation');

STK.register('comp.content.personInfo', function($){
	return function(node){
		var that  = {},
			feedChannel = $.common.channel.feed,
            relaChannel = $.common.channel.relation,
			nodes,
			//达人弹层对象 add byxionggq
            daren =null;
		
		var getWeiboNum = function(){
			var num = parseInt(nodes['weibo'].innerHTML, 10) || 0;
			return num;
		};
        var getNum = function(type){
			return parseInt(nodes[type].innerHTML, 10) || 0;
		};
		var bindListenerFuns = {
			/**
			 * 用于更新微博总数
			 */
			updateWeiboNum: function(aNum){
				return function(){
					var num = getWeiboNum();
					nodes['weibo'].innerHTML = num + aNum;
				};
			},
            updateNum: function(type, aNum){
				return function(){
					if(nodes[type]){
                        nodes[type].innerHTML = getNum(type) + aNum;
                    }
				};
			}
		};
		
		var bindListener = function() {
			feedChannel.register('forward', bindListenerFuns.updateWeiboNum(1));
			feedChannel.register('publish', bindListenerFuns.updateWeiboNum(1));
			feedChannel.register('delete', bindListenerFuns.updateWeiboNum(-1));
            relaChannel.register('follow', bindListenerFuns.updateNum('follow', 1));
			relaChannel.register('unfollow', bindListenerFuns.updateNum('follow', -1));
			relaChannel.register('removeFans', bindListenerFuns.updateNum('fans', -1));
		};
		/**
		 * 初始化方法
		 * @method init
		 * @private
		 */
		var init = function() {

                argsCheck();
			parseDOM();
			bindListener();

		};
		
		var argsCheck = function(){
			if (!$.core.dom.isNode(node)) {
				throw "[STK.comp.content.personInfo]:node is not a Node!";
			}
		};
		
		var parseDOM = function() {
			var buildDom = $.core.dom.builder(node);
			nodes = $.kit.dom.parseDOM(buildDom.list);
            var darenDom = $.sizzle("[node-type='daren']",node);
           daren = darenDom[0] && $.comp.content.darenCard(darenDom[0],{'uid':$CONFIG["oid"]});
		};
		
		/**
		 * 组件销毁方法
		 * @method destroy
		 */
		var destroy = function() {
			feedChannel.remove('publish', bindListenerFuns.updateWeiboNum);
            feedChannel.register('forward', bindListenerFuns.updateWeiboNum);
			feedChannel.register('delete', bindListenerFuns.updateWeiboNum);
            relaChannel.register('follow', bindListenerFuns.updateNum);
			relaChannel.register('unfollow', bindListenerFuns.updateNum);
			relaChannel.register('removeFans', bindListenerFuns.updateNum);
             daren && daren.destroy &&daren.destroy();
			feedChannel = null;
            relaChannel = null;
			nodes = null;
		};
		init();
		
		that.destroy = destroy;
		return that;
	};
});