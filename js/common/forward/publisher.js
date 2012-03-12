/**
 * @fileoverview
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
 */
/**
 * 
 * @param {Object} mid		微博ID，必选
 * @param {Object} data		附带数据
 */
// new 发布器
//1、如果没有 DOM，就初始化 DOM；如果有，就直接使用 getDOM/setDOM
//2、初始化 TAB
//3、初始化 发布区
$Import("kit.extra.language");
$Import("kit.dom.parseDOM");
$Import("common.forward.toMicroblog");
$Import("common.forward.toPrivateMsg");
$Import("common.forward.toMicrogroup");
$Import("common.forward.toMail");
$Import("kit.extra.toFeedText");
STK.register("common.forward.publisher", function ($){
	//---常量定义区----------------------------------
	var lang = $.kit.extra.language;
	var forward = $.common.forward;
	// HTML 模板
	var TEMPLATE = lang(''
	+ '<#et userlist data>'
	+ '<div node-type="forward_tab" class="tab tab_bottom tab_forward W_texta">'
		+ '<span class="tab_title">#L{转发到}：</span>'
		+ '<#list data.tab as list>'
			+ '<a href="#" onclick="return false;" action-type="tab_item" action-data="id=${list.id}"'
			+ '<#if (list.id==data.type)>'
			+ ' class="current W_texta"'
//			+ '<#else>'
//			+ ' title="#L{转发到}${list.name}'
			+ '</#if>'
			+ '">${list.name}</a>'
			+ '<#if (list.id != data.tab_count)>'
				+ '<em class="W_vline">|</em>'
			+ '</#if>'
		+ '</#list>'
	+ '</div>'
	+ '<div node-type="forward_client"></div>');
	// Tab 标签信息
	var TAB = [
		{	'id' : 1,	'name' : lang('#L{我的微博}')},
		{	'id' : 2,	'name' : lang('#L{私信}') },
		{	'id' : 3,	'name' : lang('#L{微群}') }
//		,{	'id' : 4,	'name' : lang('#L{邮箱}') }
		];
	return function (mid, data) {
		if(mid == null){
			throw new Error('[common.forward.publisher]Required parameter mid is missing');
		}
		data = data || { 'type' : 1,"styleId":"1" };
		var that = {
			'instances' : {}
		};
		var type = data.type;
		var tab,	// tab 容器
			client;	// 发布器容器
		var container,
			currentTab;
		var delegate,
			lastInstance,
		$toFeedText = $.kit.extra.toFeedText;

		var publisher = {
			'1' : forward.toMicroblog,
			'2' : forward.toPrivateMsg,
			'3' : forward.toMicrogroup,
			'4' : forward.toMail
		};
		
		var defaultData = {
			'appkey' : ''
			,'domInit' : false
			,'forwardNick' : ''
			,'originNick' : ''
			,'origin' : ''
			,'reason' : ''
			,'url' : null
			,'styleId' : "1"
			,'allowComment' : "1"
			,'allowForward' : "1"
			,'allowRootComment' : "1"
			,'uid' : ''
			,'rootuid' : ''
			,'pid':''
			,'domain': ''
		};


		// 产生外框的 DOM，包含 TAB 及下面发布器外容器
		var getDom = function () {
			if(data.domInit == false){
				var template = $.core.util.easyTemplate(TEMPLATE);
				var viewerHTML = template({
					'type'		: type,
					'tab'		: TAB,
					'tab_count'	: TAB.length
				}).toString();
				var dom = $.builder(viewerHTML);
			}
			var list = $.kit.dom.parseDOM(dom.list);
			tab = list.forward_tab;
			client = list.forward_client;
			return dom.box;
		};
		
		// 自定义事件定义
		$.custEvent.define(that, ['hide', 'center', 'forward']);
		
		// 初始化
		var init = function (inner) {
			if(mid == null){
				throw new Error('[common.forward.publisher]Required parameter inner is missing');
			}
			container = inner;
			// Tab 切换的事件代理
			initTab();
			// 根据初始类型，init 默认发布器
			initPublisher(type, {
				'data' : data,
				'client' : client
			});
		};
		
		// TAB 切换
		var switchTab = function (spec) {
			if(currentTab){
				currentTab.className = "";
			}
			currentTab = spec.el;
			currentTab.className = 'current W_texta';
			type = spec.data.id || type;
			initPublisher(type, {
				'data' : data,
				'client' : client
			});
		};
		
		// 初始化 TAB 事件绑定
		var initTab = function () {
			// 记录下当前高亮的 Tab
			currentTab = $.sizzle('a[class="current W_texta"]', container);
			currentTab = (currentTab.length > 0) ? currentTab[0] : null;
			
			var tabController = $.sizzle('div[node-type="forward_tab"]', container);
			tabController = (tabController.length > 0) ? tabController[0] : null;
			// 如果 Tab 容器存在才绑定事件代理
			if(tabController){
				delegate = $.delegatedEvent(tabController);
				delegate.add('tab_item', 'click', function(spec){
					// 如果点击的不是当前 Tab
					if(type != spec.data.id){
						switchTab(spec);
					}
				});
			}
		};
		
		// 根据类型初始化发布器
		var initPublisher = function (type, opts) {
			if(lastInstance != null){
				lastInstance.hide();
			}
			type = type.toString();
			var instance;
			if(that.instances[type] == null){
				var data = {}, result;
				for(var key in defaultData){
					data[key] = opts.data[key];
				}
				data.type = type;
				result = {
					'client' : client,
					'data' : data,
					'inDialog' : true
				};
				if(parseInt(type) != 1) {
					/*if(result.data.origin === lang("#L{此微博已被原作者删除。}")) {
						//多了个句号。由谁来处理？TODO
						result.data.origin = lang("#L{此微博已被原作者删除}");
						result.data.isDel = true;
					}*/
					if(result.data.allowForward === "0") {
						result.data.originNick = "";
						result.data.origin = lang("#L{此微博已被原作者删除}");
					}
					result.data.reason = $toFeedText(result.data.reason);
					result.data.origin = $toFeedText(result.data.origin);
				}
				instance = publisher[type](client, mid, result);
				// 将已经实例化的保存起来
				that.instances[type] = instance;
				$.custEvent.add(instance, 'hide', function (){
					$.custEvent.fire(that, 'hide');
				});
				$.custEvent.add(instance, 'center', function (){
					$.custEvent.fire(that, 'center');
				});
				$.custEvent.add(instance, 'forward', function (evt, data){
					$.custEvent.fire(that, 'forward', data);
				});
			} else {
				instance = that.instances[type];
			}
			instance.show(true);
			lastInstance = instance;
		};
		
		// 销毁
		var destroy = function () {
			for(var key in that.instances){
				var item = that.instances[key];
				item.destory();
				item = null;
			}
			that.instances = null;
			$.custEvent.undefine(that);
			tab = null;
			client = null;
			container = null;
			currentTab = null;
			delegate && delegate.remove('tab_item', 'click');
			delegate = null;
		};
		that.getDom = getDom;
		that.init = init;
		that.destroy = destroy;
		return that;
	};
	
});
