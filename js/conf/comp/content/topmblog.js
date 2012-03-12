/**
 * @author chenjian2
 * V4热门转发与热门评论
 */
$Import("kit.extra.parseURL");
$Import('common.feed.feedList.topFeedList');
$Import('common.feed.groupAndSearch.include.calendar');
STK.register('comp.content.topmblog', function($){
	return function(node){
		var that = {};
		var nodes;
		var pageQuery;
		var feedList;
		
		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {
			showCalendar : function(){
				new $.common.feed.groupAndSearch.include.calendar((nodes.date_select.getAttribute('value') || ''), {
					source : nodes.date_select,
					hidePastMonth : true,
					callback:function(data){
						window.location.href = $.core.util.URL(window.location.href).setParam("t",data).toString();
					}
				});
			}
		};
		//-------------------------------------------
		
		//---组件的初始化方法定义区-------------------------
		
		/**
		 * 初始化方法
		 * @method init
		 * @private
		 */
		var init = function() {
			argsCheck();
			parseDOM();
			initPlugins();
			bindDOM();
		};
		//-------------------------------------------
		
		//---参数的验证方法定义区---------------------------
		/**
		 * 参数的验证方法
		 * @method init
		 * @private
		 */
		var argsCheck = function() {
			if (node == null || (node != null && !$.core.dom.isNode(node))) {
				throw "[comp.centent.topmblog]:argsCheck()-The param node is not a DOM node.";
			}
			pageQuery = (function(){
				var url = $.kit.extra.parseURL();
				var query = $.core.json.queryToJson(url.query);
				isGroupAll = (query.gid == null);
				isFilterAll = (query.is_ori != 1 && query.is_pic != 1 && query.is_video != 1 && query.is_music != 1
								 && query.is_foward != 1 && query.is_text != 1 && query.key_word == null
								 && query.start_time == null && query.end_time == null);
				return query;
			})();
		};
		//-------------------------------------------
		
		//---Dom的获取方法定义区---------------------------
		/**
		 * Dom的获取方法
		 * @method parseDOM
		 * @private
		 */
		var parseDOM = function() {
			nodes = {
				'feedList': $.core.dom.sizzle('[node-type="feed_list"]', node)[0],
				'date_select': $.core.dom.sizzle('[node-type="date_select"]', node)[0]
			};
		};
		//-------------------------------------------
		
		//---模块的初始化方法定义区-------------------------
		/**
		 * 模块的初始化方法
		 * @method initPlugins
		 * @private
		 */
		var initPlugins = function() {
			if (nodes.feedList) {
				feedList = $.common.feed.feedList.topFeedList(nodes.feedList, {
					'page': pageQuery.page,
					'end_id':  pageQuery.end_id
				});
			}
		};
		//-------------------------------------------
		
		//---DOM事件绑定方法定义区-------------------------
		/**
		 * DOM事件绑定方法
		 * @method bindDOM
		 * @private
		 */
		var bindDOM = function() {
			$.addEvent(nodes.date_select, "click", bindDOMFuns.showCalendar);
		};
		//-------------------------------------------

		//---组件公开方法的定义区---------------------------
		/**
		 * 组件销毁方法
		 * @method destroy
		 */
		var destroy = function() {
			$.removeEvent(nodes.date_select, "click", bindDOMFuns.showCalendar);
			feedList && feedList.destroy();
		};
		//-------------------------------------------
		
		//---执行初始化---------------------------------
		init();
		//-------------------------------------------
		
		//---组件公开属性或方法的赋值区----------------------
		that.destroy = destroy;
		//-------------------------------------------
		
		return that;
	}
});
