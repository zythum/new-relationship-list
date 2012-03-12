/**
 * 语音页面
 * @author qiyuheng | yuheng@staff.sina.com.cn
 */

$Import('common.trans.mobile');
$Import('kit.extra.language');
$Import('kit.dom.parseDOM');
$Import('ui.alert');

STK.register('comp.mobile.msg',function($){

	//---常量定义区----------------------------------

	var ERROETPL = '<#et tpl data>' +
			'<div class="M_notice_del"><span class="icon_del"></span><span class="txt">${data.txt}</span></div>' +
		'</#et>';
	//-------------------------------------------

	return function(node, opts) {
		var that = {};
		var nodes = {};
		var delegate = $.core.evt.delegatedEvent(node);
		var lang = $.kit.extra.language;
		var trans = $.common.trans.mobile;
		var askTimer, numCache, step;
		var RUNTIME = 3000;



		//---变量定义区----------------------------------

		//----------------------------------------------

		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuns = {
			bindPhone : function(){
				
				var check = nodes.agree.checked;
				var num = $.core.str.trim(nodes.phoneInput.value);
				
				if(!check){
					$.ui.alert(lang('#L{您没有勾选我已阅读并同意《新浪微博客手机增值服务条款》}'),{
						'title' : lang('#L{提示}'),
						'icon' : 'warn',
						'textSmall' : '',
						'OK' : $.funcEmpty,
						'OKText' : lang('#L{确定}'),
						'timeout' : 0
					});

					return ;
				}

				if(!(/^1[3|8|5]\d{9}$/.test(num))){
					nodes.tipbox.innerHTML = $.core.util.easyTemplate(ERROETPL,{
						'txt' : lang('#L{请输入正确的手机号！}')
					})
					return ;
				}

				numCache = num;
				trans.getTrans('bind',{
					'onSuccess' : function(){
						window.location.reload();
					},
					'onError' : function(data){
						nodes.tipbox.innerHTML = $.core.util.easyTemplate(ERROETPL,{
							'txt' : data.msg
						});
					},
					'onComplete' : function(){}
				}).request({'number':num});
			},
			changeNum : function(){
				clearInterval(askTimer);
				nodes.bind.style.display = "";
				nodes.checking && (nodes.checking.style.display = "none");
				nodes.succ && (nodes.succ.style.display = "none");
				nodes.phoneInput.value = '';
				nodes.phoneInput.focus();
			},
			bindLayer : function(){
				$.core.evt.preventDefault();
				var pos = $.core.dom.position(nodes.layerBtn);
				nodes.lawLayer.style.left = pos.l + 'px';
				nodes.lawLayer.style.top = pos.t +nodes.layerBtn.offsetHeight + 'px';
				nodes.lawLayer.style.display = (nodes.lawLayer.style.display == "none")?"":"none";
			},
			closeLayer : function(){
				$.core.evt.preventDefault();
				nodes.lawLayer.style.display = "none";
			},
			changeNotice : function(data){
				var flag = (data.data.flag == 0)?1:0;
				trans.getTrans('notice',{
					'onSuccess' : function(){
						custFuncs.changeTag(data.el,flag);
					},
					'onComplete' : function(){}
				}).request({'flag':flag});

			},
			changePrivacy : function(data){
				var flag = (data.data.flag == 0)?1:0;
				trans.getTrans('privacy',{
					'onSuccess' : function(){
						custFuncs.changeTag(data.el,flag);
					},
					'onComplete' : function(){}
				}).request({'flag':flag});
			},

			cancel : function(){
				trans.getTrans('unbind',{
					'onSuccess' : function(){
						window.location.reload();
					},
					'onComplete' : function(){}
				}).request({});
			}
		};
		//-------------------------------------------

		var custFuncs = {
			startAsk : function(){
				askTimer = setInterval(function(){
					trans.getTrans('check',{
						'onSuccess' : function(data){
							if(data.data){
								setTimeout(function(){
									window.location.reload();
								},0)
							}
						},
						'onComplete': function(){}
					}).request({});
				}, RUNTIME);
			},
			changeTag : function(node, flag){
				var num = flag?23:0;
				node.setAttribute('action-data',("flag=" + flag ));
				node.style.left = num + 'px';
			}
		};

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
		};
		//-------------------------------------------

		//---Dom的获取方法定义区---------------------------
		/**
		 * Dom的获取方法
		 * @method parseDOM
		 * @private
		 */
		var parseDOM = function() {
			nodes = $.kit.dom.parseDOM($.core.dom.builder(node).list);
			nodes.step && (step = nodes.step.getAttribute('step'));
		};
		//-------------------------------------------

		//---模块的初始化方法定义区-------------------------
		/**
		 * 模块的初始化方法
		 * @method initPlugins
		 * @private
		 */
		var initPlugins = function() {

		};
		//-------------------------------------------

		//---DOM事件绑定方法定义区-------------------------
		/**
		 * DOM事件绑定方法
		 * @method bindDOM
		 * @private
		 */
		var bindDOM = function() {
			$.core.evt.addEvent(nodes.bindBtn, 'click', bindDOMFuns.bindPhone);
			$.core.evt.addEvent(nodes.layerBtn, 'click', bindDOMFuns.bindLayer);
			$.core.evt.addEvent(nodes.close, 'click', bindDOMFuns.closeLayer);

			delegate.add('notice', 'click', bindDOMFuns.changeNotice);
			delegate.add('privacy', 'click', bindDOMFuns.changePrivacy);
			delegate.add('cancel', 'click', bindDOMFuns.cancel);
			delegate.add('change', 'click', bindDOMFuns.changeNum);

			if(step == 2){
				custFuncs.startAsk();
			}
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