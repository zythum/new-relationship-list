/**
 *  我的个人资料
 * 点击发布微博按钮弹出发布层
 */
$Import('common.dialog.publish');
$Import('common.skin.skinManager');
$Import('kit.extra.merge');
$Import('comp.content.darenCard');
STK.register('comp.content.myPersonalInfo', function($) {
	return function(node) {
        var lang = $.kit.extra.language;
		var sizzle = $.core.dom.sizzle;
		//delete by zhaobo 201106141029
		//var sendMiniBlogLink = sizzle(".sendwb", node)[0];           //发微博按钮
        var delegate = $.core.evt.delegatedEvent(node);

        var  darenDom = sizzle('[node-type=daren]',node)[0];
		 var daren = null;
        daren = darenDom && $.comp.content.darenCard(darenDom,{'uid':$CONFIG['uid']});
		var publish = STK.common.dialog.publish({
			'styleId':'0'
		});
		var sendMiniBlogFunc = function(obj) {	 //发微博点击事件
			$.preventDefault(obj.evt);
			publish.show({
				'title':lang('#L{有什么新鲜事想告诉大家？}'),
				'info':lang('#L{可以直接输入音乐或视频的url地址}'),
			    'defaultValue' : '',
				'content' : ''

			});
			$.core.evt.preventDefault();
			return false;
		};
		//$.addEvent(sendMiniBlogLink, "click", sendMiniBlogFunc);          //注册发微博点击事件*/
		//add by zhaobo
        delegate.add("publish", "click", sendMiniBlogFunc);
		var setSkin = sizzle('[node-type="set_skin"]', node)[0];
		var skinManager;
		var setSkinFunc = function(){
			skinManager = skinManager || $.common.skin.skinManager();
			skinManager.show();
			return false;
		};
		$.addEvent(setSkin, "click", setSkinFunc);          //注册发微博点击事件


		var that = {};
		that.destroy = function() {
			//delete by zhaobo 201106141029
			//$.removeEvent(sendMiniBlogLink, "click", sendMiniBlogFunc);
            delegate.remove("publish", "click");
             !$CONFIG['bigpipe'] && daren && daren.destroy &&daren.destroy();
			$.removeEvent(setSkin, "click", setSkinFunc);
            delegate.destroy();
			publish.destroy();
		}
	}
});
