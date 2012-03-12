/**
 * 他的标签
 * 
 * @id STK.comp.content.hisTags
 * @author Runshi Wang | runshi@staff.sina.com.cn
 * 
 */
$Import('kit.dom.parseDOM');
$Import('common.layer.addTags');
//$Import('kit.extra.language');

STK.register("comp.content.hisTags", function($) {
	
	//var $L = $.kit.extra.language;
	var $T = $.templet;
	
	//---常量定义区---------------------------------- 
	var TAG_TEMP = '<span><a href="#{url}" weight="#{weight}" tagid="#{tagid}" class="ft12 ft_b">#{tagname}</a></span>';
	//-------------------------------------------
	
	return function(node, opts) {
		var that = {}, dEvt;
		
		//---变量定义区----------------------------------
		var nodes, tagsListNum;
		var options = {
			limit :  10
		}
		//----------------------------------------------
		
		
		var isTagsFull = function(){
			
			if(options.limit <= tagsListNum && nodes.addTag){
				$.removeNode($.core.dom.next(nodes.addTag));
				$.removeNode(nodes.addTag);
				return true;
			}
			
			return false;
		}
		
		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {
			
		};
		//-------------------------------------------
		
		//---自定义事件绑定的回调函数定义区--------------------
		var bindCustEvtFuns = {
			addTag : function(type, sTag){
				if( !$.core.obj.isEmpty(sTag) && !isTagsFull() ){
					nodes.tags_list.innerHTML = $T(TAG_TEMP, sTag) + nodes.tags_list.innerHTML;
					tagsListNum ++;
					isTagsFull();
				}
			}
		};
		//----------------------------------------------
		
		//---广播事件绑定的回调函数定义区---------------------
		var bindListenerFuns = {
			
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
			bindCustEvt();
			bindListener();
		};
		//-------------------------------------------
		
		//---参数的验证方法定义区---------------------------
		/**
		 * 参数的验证方法
		 * @method init
		 * @private
		 */
		var argsCheck = function() {
			options = $.parseParam(options, opts);
		};
		//-------------------------------------------
		
		//---Dom的获取方法定义区---------------------------
		/**
		 * Dom的获取方法
		 * @method parseDOM
		 * @private
		 */
		var parseDOM = function() {
			nodes = $.kit.dom.parseDOM( $.core.dom.builder(node).list );
			tagsListNum = $.sizzle.find("a", nodes.tags_list).set.length;
		};
		//-------------------------------------------
		
		//---模块的初始化方法定义区-------------------------
		/**
		 * 模块的初始化方法
		 * @method initPlugins
		 * @private
		 */
		var initPlugins = function() {
			isTagsFull();
		};
		//-------------------------------------------
		
		//---DOM事件绑定方法定义区-------------------------
		/**
		 * DOM事件绑定方法
		 * @method bindDOM
		 * @private
		 */
		var bindDOM = function() {
			dEvt = $.core.evt.delegatedEvent(node);
			dEvt.add("addTag", "click", function(){
				$.common.layer.addTags({parent:node});
			});
		};
		//-------------------------------------------
		
		//---自定义事件绑定方法定义区------------------------
		/**
		 * 自定义事件绑定方法
		 * @method bindCustEvt
		 * @private
		 */
		var bindCustEvt = function() {
			$.custEvent.define(node, 'addTag');
			$.custEvent.add(node, 'addTag', bindCustEvtFuns.addTag);
		};
		//-------------------------------------------
		
		//---广播事件绑定方法定义区------------------------
		var bindListener = function() {
			
		};
		//-------------------------------------------
		
		//---组件公开方法的定义区---------------------------
		/**
		 * 组件销毁方法
		 * @method destroy
		 */
		var destroy = function() {
			
		};
		//-------------------------------------------
		
		//---执行初始化---------------------------------
		init();
		//-------------------------------------------
		
		//---组件公开属性或方法的赋值区----------------------
		that.destroy = destroy;
		//-------------------------------------------
		
		return that;
	};
});