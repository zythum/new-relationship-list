/**
 * 添加标签小浮层
 * 
 * @author Runshi Wang | runshi@staff.sina.com.cn
 */

$Import('module.layer');
$Import('kit.extra.language');
$Import('kit.dom.parseDOM');
$Import('common.trans.setting');
$Import('ui.alert');


STK.register('common.layer.addTags', function($){
	//---常量定义区---------------------------------- 
	var $L = $.kit.extra.language;
	
	var arrTags;
	var FRAME_TEMP = ''
		+'<div node-type="outer" class="W_layer"><div class="bg"><table border="0" cellspacing="0" cellpadding="0"><tr><td>'
		+'<div node-type="inner" class="content">'
		+'</div>'
		+'</td></tr></table></div></div>';
	
	var CONTENT_TEMP = ''
		+'<div class="layer_add_topic">'
			+'<div class="tagsAdd_con clearfix">'
			+'<input node-type="tag_name" type="text" class="W_input" />'
			+'</div>'
			+'<p class="tagsAdd_note W_textb">'+$L("#L{哪些词语最能描述你？}")+'</p>'
			+'<div class="tagsAdd_btn"><a class="W_btn_b"  href="#" onclick="return false;" node-type="submit"><span>'+$L("#L{添加}")+'</span></a><a node-type="close" href="#" onclick="return false;" class="W_btn_a"><span>'+$L("#L{取消}")+'</span></a></div>'
			+'</div>'
		+'</div>';
	
	var DIALOG = {
		'empty'    : $L("#L{请输入标签}"),
		'forbiden' : $L("#L{含有非法字符，请修改 }"),
		'limit'    : $L("#L{单个标签最多可输入7个汉字(14个字符)}"),
		'full'     : $L("#L{最多可添加10个标签 }")
	}
	
	//-------------------------------------------
	
	return function(opts) {

		//---变量定义区----------------------------------
		var that = {};
		that.isOpened = false; //是否打开
		var nodes, addTags, outer, inner, tagsArea, tagsAreaPs, alert, lsner;
	
		var nodeCache;
		var options = {
			parent :   null
		}
		
		var warn = function(message, spec){
			//clearTimeout(lsner);
			alert = $.ui.alert(message, $.parseParam({icon:"success", OK: function(){
				nodes.tag_name.focus();
			}}, spec || {}));
			//lsner = setTimeout(function(){
			//	alert.dia.hide();
			//	nodes.tag_name.focus();
			//}, 2000);
		};
		//----------------------------------------------
		
		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {
			getTags : function(){
				var v = $.core.str.trim(nodes.tag_name.value);
				
				if(v == ''){
					warn(DIALOG.empty, {icon:"warn"});
					nodes.tag_name.value = '';
					return false;
				}
				
				v = $.core.str.dbcToSbc(v);
					
				if(/,|;|\uFF0C|\uFF1B|\u3001|\s/.test(v) ){
				
					arr = v.split(/,|;|\uFF0C|\uFF1B|\u3001|\s/);
					arr = $.core.arr.unique($.core.arr.clear(arr));
					
					for(var i in arr){
						if($.core.str.bLength(arr[i]) > 14){
							warn(DIALOG.limit, {icon:"warn"})
							return false;
						}
					}
					
					v = arr.join(',');
					
					nodes.tag_name.value = v;
					
				} else {
					
					if($.core.str.bLength(v) > 14){
						warn(DIALOG.limit, {icon:"warn"})
						return false;
					}
					
				}
			
				if(/[^a-zA-Z0-9\u4e00-\u9fa5,]/g.test(v)){
					warn(DIALOG.forbiden, {icon:"warn"})
					return false;
				}
				
				return v;
			},
			/**
			 * 标签提交
			 */
			tagSubmit : function(){
				var tags = bindDOMFuns.getTags();
				if(!tags) return;
				
				$.common.trans.setting.getTrans("addTagsLayerSubmit", {
					'onComplete'  : bindDOMFuns.addTagHandle
				}).request({
					"tags" : tags
				});
			},
			/**
			 * 关闭窗体
			 */
			addTagsClose : function(){
				addTags.hide();
				that.isOpened = false;
			},
			/**
			 * 打开窗体
			 */
			addTagsOpen : function(){
				addTags.show();
				bindDOMFuns.clean();
				that.isOpened = true;
				nodes.tag_name.focus();
			},
			/**
			 * 提交后的响应
			 * 若成功，通知 "histags" 进行标签的添加
			 */
			addTagHandle : function(ret, params){
				if(ret.code == "100000"){
					$.custEvent.fire(tagsArea, 'addTag', ret);
				} else {
					warn(ret.msg, {icon:"warn"});
					//bindDOMFuns.addTagsClose();
					//bindDOMFuns.clean();
				}
			},
			clean : function(){
				nodes.tag_name.value = '';
			}
		};
		//-------------------------------------------
		
		//---自定义事件绑定的回调函数定义区--------------------
		var bindCustEvtFuns = {
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
			tagsArea = options.parent;
			
			tagsAreaPs = $.position(tagsArea);
			tagsAreaPs.w = tagsArea.offsetWidth;
			tagsAreaPs.h = tagsArea.offsetHeight;
		};
		//-------------------------------------------
		
		//---模块的初始化方法定义区-------------------------
		/**
		 * 模块的初始化方法
		 * @method initPlugins
		 * @private
		 */
		var initPlugins = function() {
			if(nodeCache){
				addTags = nodeCache;
			} else {
				addTags = $.module.layer(FRAME_TEMP);
				nodeCache = addTags;
			}
			
			outer = addTags.getOuter();
			inner = addTags.getInner();
			
			addTags.html(CONTENT_TEMP);
			
			nodes = $.kit.dom.parseDOM( $.core.dom.builder(inner).list );
			
			//---放入页面---------------------------------- 
			$.sizzle("body")[0].appendChild(outer);
			
			//bindDOMFuns.addTagsOpen();
			
			outer.style.top = tagsAreaPs.t + tagsAreaPs.h - 20 + 'px';
			outer.style.left = tagsAreaPs.l + 'px';
			
			nodes.tag_name.focus();
		};
		//-------------------------------------------
		
		//---DOM事件绑定方法定义区-------------------------
		/**
		 * DOM事件绑定方法
		 * @method bindDOM
		 * @private
		 */
		var bindDOM = function() {
			$.addEvent(nodes.close, "click", bindDOMFuns.addTagsClose);
			$.addEvent(nodes.submit, "click", bindDOMFuns.tagSubmit);
			$.core.evt.hotKey.add(nodes.tag_name, ['enter'], bindDOMFuns.tagSubmit);
		};
		//-------------------------------------------
		
		//---自定义事件绑定方法定义区------------------------
		/**
		 * 自定义事件绑定方法
		 * @method bindCustEvt
		 * @private
		 */
		var bindCustEvt = function() {
			$.custEvent.define(addTags, 'addTagLayerShow');
			$.custEvent.add(addTags, 'addTagLayerShow', bindCustEvtFuns.show);
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
			$.removeEvent(nodes.close, "click", bindDOMFuns.addTagsClose);
			$.removeEvent(nodes.submit, "click", bindDOMFuns.tagSubmit);
			nodes = null, addTags = null, outer = null, inner = null, tagsArea = null, tagsAreaPs = null;
		};
		//-------------------------------------------
		
		//---执行初始化---------------------------------
		init();
		//-------------------------------------------
		
		//---组件公开属性或方法的赋值区----------------------
		that.destroy = destroy;
		that.show = bindDOMFuns.addTagsOpen;
		that.hide = bindDOMFuns.addTagsClose;
		that.clean = bindDOMFuns.clean;
		//-------------------------------------------
		
		return that;
	};
});