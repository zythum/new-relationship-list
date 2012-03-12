/**
 * 回答问题
 * @author Runshi Wang | runshi@staff.sina.com.cn
 */
$Import('kit.dom.parseDOM');
$Import('kit.dom.firstChild');
$Import('kit.extra.language');
$Import("ui.dialog");
$Import("ui.alert");
$Import("ui.confirm");
$Import("common.trans.relation");

STK.register("common.dialog.answerQuestion", function($){

	//---常量定义区---------------------------------- 
	//todo 定义事件名称
	var $L = $.kit.extra.language;
	var $T = $.templet;
	var dialog, outer, inner, dEvt, options, nodes;
	
	//---模板---------------------------------- 
	var TITLE_TEMP = $L('<span class="tab_title">#L{回答问题}</span>');
	
	var W_VLINE_TEMP = '<em class="W_vline">|</em>';
	
	var TABS_BAR_TEMP = '<a action-type="changeTabs" action-data="uid=#{UID}" class="current W_texta" href="###" onclick="return false;">#{USERNAME}</a>';
	
	var CAPTION_TEMP = ''
		+'#L{正确回答}'
		+'#{USERNAME}'
		+'#L{设置的问题，邀请就会成功发送}';
	
	var FRAME_TEMP = ''
		+'<div class="layer_invite_question">'
			+'<p class="question_title" node-type="caption"></p>'
			+'<dl class="clearfix">'
				+'<dt>#L{提问}：</dt>'
				+'<dd node-type="questions"></dd>'
				+'<dt>#L{回答}：</dt>'
				+'<dd>'
					+'<input class="W_input" node-type="answer" />'
					+'<span class="icon_del" node-type="tips"></span>'
				+'</dd>'
			+'</dl>'
			+'<input node-type="uid" type="hidden" />'
			+'<div class="btn">'
				+'<a class="W_btn_b" action-type="submit" href="###" onclick="return false;"><span>#L{提交}</span></a>'
				+'<a class="W_btn_a" action-type="cancel" href="###" onclick="return false;"><span>#L{路过}</span></a>'
			+'</div>';
		+'</div>';	
	
	var QUESTION_ITEM_TEMP = '<option value="#{VALUE}">#{CONTENT}</option>';
	
	var CAPTION_PASS_TEMP = '已成功回答#{USERS}的提问，还有3个问题等待你回答，加油！';
	
	var TIRED_CLOSE_TEMP = '<a action-type="cancel" href="###" onclick="return false;">不想回答了，关闭所有问题</a>';
	
	
	var count = function(ob){
		var num = 0;
		for(var i in ob) num ++;
		return num;
	}
	
//	/**
//	 * 获取所有问题
//	 */
//	var getQuestions = function(){
//		createFrame();
//		$.common.trans.relation.getTrans("questions", {
//			'onSuccess'  : function(ret, params){
//				createQuestionSelecter(ret.data.questions);
//			}
//		}).request({});
//	}
	
	//---常量定义区---------------------------------- 

	//-------------------------------------------
	
	return function(opts) {
		
		var that = {};
		
		//---变量定义区----------------------------------
		//----------------------------------------------
		
		/**
		 * 创建问题下拉列表
		 */
		var createQuestionSelecter = function(aQuestions){
			return ''
				+'<select>'
				+ $.foreach(aQuestions, function(item, index){
					return $T(QUESTION_ITEM_TEMP, {"VALUE":item.id, "CONTENT":item.question});
				}).join('')
				+ '</select>';
		}
		
		/**
		 * 创建用户的问题
		 */
		var createUsersQuestions = function(){
			tabs = [], questions = [], users = [];
			
			if(count(options) === 1){
				for(var uid in options){
					dialog.setTitle(TITLE_TEMP);
					nodes.questions.innerHTML = createQuestionSelecter(options[uid].questions);
					nodes.uid.value = uid;
					nodes.caption.innerHTML = $T($L(CAPTION_TEMP), {"USERNAME":options[uid].nickname});
				}
			} else {
				for(var uid in options){
					users.push(uid);
					tabs.push( $T(TABS_BAR_TEMP, {"UID":uid,"USERNAME": options[uid].nickname}) );
					questions.push(createQuestionSelecter(options[uid].questions));
				}
				dialog.setTitle(TITLE_TEMP + tabs.join(W_VLINE_TEMP));
				nodes.questions.innerHTML = questions[0];
				nodes.uid.value = users[0];
			}
		}
		
		/**
		 * 创建内容主体
		 */
		var createFrame = function(){
			dialog = $.ui.dialog();
			outer = dialog.getOuter();
			inner = dialog.getInner();
			dialog.setContent($L(FRAME_TEMP));
			dialog.setMiddle();
			nodes = $.kit.dom.parseDOM( $.core.dom.builder(inner).list );
			
			bindDOMFuns.tipsHide();
		}
		
		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {
			/**
			 * 取消(关闭)
			 */
			cancel : function(){
				dialog.hide();
			},
			/**
			 * 切换用户(复数专用)
			 */
			changTabs : function(node){
				var index = $.core.arr.indexOf(node.data.uid, users);
				nodes.uid.value = node.data.uid;
				nodes.questions.innerHTML = questions[index];
			},
			
			/**
			 * 显示提示框
			 */
			tipsShow: function(){
				nodes.tips.style.display = '';
			},
			
			/**
			 * 隐藏提示框
			 */
			tipsHide: function(){
				nodes.tips.style.display = 'none';
			},
			
			/**
			 * 回答问题
			 */
			answerQuestion : function(){
				var params = {
					uid    : nodes.uid.value,
					id     : $.kit.dom.firstChild(nodes.questions).value,
					answer : $.core.str.trim(nodes.answer.value)
				}
				
				if(params.answer == ''){
					bindDOMFuns.tipsShow();
					//nodes.answer.focus();
					return;
				}
				
				nodes.answer.value = '';
				$.common.trans.relation.getTrans("answer", {
					'onSuccess'  : function(ret, params){
						//回答正确
						if(ret.data == '1'){
							bindDOMFuns.cancel();
						} else {
							bindDOMFuns.tipsShow();
							//alert($L('#L{'+ret.msg+'}'));
							$.ui.alert($L('#L{'+ret.msg+'}'));
						}
					},
					'onError' : function(ret) {
						$.ui.alert(ret.msg);
					}
				}).request(params);
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
			options = opts;
		};
		//-------------------------------------------
		
		//---Dom的获取方法定义区---------------------------
		/**
		 * Dom的获取方法
		 * @method parseDOM
		 * @private
		 */
		var parseDOM = function() {
			
		};
		//-------------------------------------------
		
		//---模块的初始化方法定义区-------------------------
		/**
		 * 模块的初始化方法
		 * @method initPlugins
		 * @private
		 */
		var initPlugins = function() {
			createFrame();
			createUsersQuestions();
			
			//---放入页面---------------------------------- 
			$.sizzle("body")[0].appendChild(outer);
			dialog.show();
		};
		//-------------------------------------------
		
		//---DOM事件绑定方法定义区-------------------------
		/**
		 * DOM事件绑定方法
		 * @method bindDOM
		 * @private
		 */
		var bindDOM = function() {
			dEvt = $.core.evt.delegatedEvent(outer);
			dEvt.add("submit", "click", bindDOMFuns.answerQuestion);
			dEvt.add("cancel", "click", bindDOMFuns.cancel);
			dEvt.add("changeTabs", "click", bindDOMFuns.changTabs);
			
			$.addEvent(nodes.answer, "focus", bindDOMFuns.tipsHide);
		};
		//-------------------------------------------
		
		//---自定义事件绑定方法定义区------------------------
		/**
		 * 自定义事件绑定方法
		 * @method bindCustEvt
		 * @private
		 */
		var bindCustEvt = function() {
			
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
			dEvt.destroy();
			$.removeEvent(nodes.answer, "focus", bindDOMFuns.tipsHide);
			dialog = null, outer = null, inner = null, dEvt = null;
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