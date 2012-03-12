/**
 * 我的心情，大家的心情使用的弹层
 */
$Import('ui.dialog');
$Import('kit.dom.parseDOM');
$Import('kit.extra.language');
$Import('common.mood.moodPageSearch');

STK.register('common.dialog.moodList' , function($) {
	return function(opts) {
		/**
		 * that是外抛的对象，dia是弹层，$L是语言转换函数
		 * nodes用来缓存节点，pageSearch是调用common.mood.moodPageSearch后生成的对象
		 */
		var that = {} , dia , $L = $.kit.extra.language , nodes , pageSearch;
		/**
		 * LOADING用来显示等待 
		 */
		var LOADING = $L('<div node-type="pageNodeOuter"><div class="W_loading" style="width:325px;padding-top:15px;padding-bottom:15px;text-align:center"><span>#L{正在加载，请稍候}...</span></div></div>');
		/**
		 * trans和transName需要传递进来，用来获取分页的内容
		 */
		var argsCheck = function() {
			if(!opts.trans) {
				throw 'moodList need trans sendRequest';
			}
			if(!opts.transName) {
				throw 'moodList need transName';	
			}
		};
		/**
		 * 生成dialog，并绑定delegatedEvent
		 */
		var parseDOM = function() {
			dia = $.ui.dialog();
			dia.setTitle($L('#L{心情列表}'));
			dia.setContent(LOADING);
			var innerNode = dia.getInner();
			nodes = $.kit.dom.parseDOM($.builder(innerNode).list);
		};
		/**
		 *  实例化分页的插件common.mood.moodPageSearch
		 */
		var initPlugin = function() {
			pageSearch = $.common.mood.moodPageSearch({
				fromWhere : "dialog",
				contentNode : nodes.pageNodeOuter,
				delegateNode : nodes.pageNodeOuter,
				trans : opts.trans,
				transName : opts.transName,
				extra : {
					style : "simp"
				}
			});
		};
		/**
		 * 自定义事件控制的居中方法，用来设置弹层居中 
		 */
		var setMiddleFun = function() {
			dia && dia.setMiddle && dia.setMiddle();			
		};
		/**
		 * 绑定自定义事件，设置dialog居中显示
		 */
		var bindCustEvt = function() {
			$.custEvent.add(pageSearch, "setMiddle", setMiddleFun);
		};
		/**
		 * 实例化函数
		 */
		var init = function() {
			argsCheck();
			parseDOM();
			initPlugin();
			bindCustEvt();
		};
		/**
		 * 销毁函数
		 */
		var destroy = function() {
			pageSearch && pageSearch.destroy && pageSearch.destroy();	
			nodes = dia = pageSearch = undefined;
		};
		/**
		 * 外抛显示函数
		 */
		that.show = function() {
			dia && dia.show();
			dia && dia.setMiddle();				
		};
		/**
		 * 外抛隐藏函数
		 */
		that.hide = function() {
			dia && dia.hide();
		};
		/**
		 * 外抛销毁函数
		 */
		that.destroy = destroy;
		init();
		return that;
	};		
});
