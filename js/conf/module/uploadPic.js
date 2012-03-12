/**
 * module.uploadPic
 * @id STK.
* @author WK | wukan@staff.sina.com.cn
* @param {object} node 组件节点
* @param {object} opts 包括开始回调和结束回调
 * @example
 * 
*/
$Import('kit.dom.parseDOM');
$Import('common.extra.imageURL');

STK.register('module.uploadPic', function($){
	return function(node,opts) {
		var that = {};
		var nodes;
		var addEvent = $.core.evt.addEvent;
		var IMGMASK = "weibo.com/";
		var UPLOADDOMAIN = "picupload.service.weibo.com";
		//var UPLOADDOMAIN = "picupload.t.sina.com.cn";

		//---变量定义区----------------------------------
		//----------------------------------------------
		var _that = opts;
		var custFuncs = {
			complete : function(ret,opts){
				$.log('complete',ret,_that);

				if(!ret || ret.ret < 0){
					if(_that.err){
						_that.err(ret);
						
					}else{
						_that.complete(ret);
					}
					return;
				}

				var result = custFuncs.parseInfo(ret);
				$.log('result',result,ret,_that)
				_that.complete(result);
			},
			parseInfo : function(opts){
				
				var url = $.common.extra.imageURL(opts.pid);
				var arr = [],name,str;
/*
				arr = imgName.split(/\/|\\/);
				name = arr[arr.length - 1];
				arr = name.split('.');
				if ($.bLength(arr[0]) > 20) {
					arr[0] = $.leftB(arr[0], 20);
					str = [arr[0],'...',arr[1]].join('');
				} else {
					str = name;
				}
*/
//				return {url:url,value:str,pid:opts.pid};
				return {url:url,pid:opts.pid};
			}

		};
		//---DOM事件绑定的回调函数定义区---------------------
		var bindDOMFuncs = {		
			upload : function() {
				var imgName = nodes.fileBtn.value;
				if ($.core.str.trim(imgName) === '') {
					return;
				}
				if(opts.start){
					opts.start.call();
				}
				//upLoad.rendLoad();
				$.core.io.ijax({
					'url' : 'http://'+UPLOADDOMAIN+'/interface/pic_upload.php',
					'form' : nodes.form,
					//'abaurl' : 'http://127.0.0.1/t4/branches_custTmpl/_html/content/upimgback.html',
					'abaurl' : 'http://' + document.domain + '/aj/static/upimgback.html',
					'abakey' : 'cb',
					'onComplete' :custFuncs.complete,
					'onTimeout' : opts.timeout,
					'args' : {
						'marks' : 1,
						'app' : 'miniblog',
						's' : 'rdxt'
					}

				});
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
			if(!node) throw "node is not defined";
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
			if(!nodes.fileBtn)throw '[common.content.uploadPic]: nodes.fileBtn is not defined.';
			if(!nodes.form)throw '[common.content.uploadPic]: nodes.form is not defined.';
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
			addEvent(nodes.fileBtn, 'change', bindDOMFuncs.upload);
		};
		//-------------------------------------------

		//---自定义事件绑定方法定义区------------------------
		/**
		* 自定义事件绑定方法
		* @method bindCustEvt
		* @private
		*/
		var defineEvt = function(){
		};
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
		var API = {
		};
		//-------------------------------------------

		//---组件公开属性或方法的赋值区----------------------
		that.destroy = destroy;

		//-------------------------------------------
		init();
		return that;
	};
});
