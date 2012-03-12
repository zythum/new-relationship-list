/**
 * @fileoverview
 * 微博单条页的转发功能，不带 TAB 切换功能
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
 * @example
	var forward = $.common.forward.layer({
		styleId : "1"
	});
	forward.init('编辑器的外容器节点', '转发所需的各种数据');
	forwardDialog.show(1);	// 1表示转发到微博，2表示转发到私信，3表示转发到微群，4表示转发到邮箱（4暂未开启）
 */
$Import("kit.extra.language");
$Import("common.forward.toMicroblog");
$Import("common.forward.toPrivateMsg");
$Import("common.forward.toMicrogroup");
$Import("common.forward.toMail");
STK.register("common.forward.layer", function ($){
	//---常量定义区----------------------------------
	var lang = $.kit.extra.language;
	var forward = $.common.forward;

	return function (opts) {
		opts = opts || {};
		var that = {
			'instances' : {}
		};
		var type,
			client,	// 发布器容器
			lastInstance,
			mid,
			forwardData,
			isInit;

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
			,'url' : ''
			,'styleId' : "1"
			,'allowComment' : "1"
			,'allowForward' : "1"
			,'allowRootComment' : "1"
			,'uid' : ''
			,'rootuid' : ''
			,'pid':''
			
		};

		// 自定义事件定义
		$.custEvent.define(that, ['hide', 'center', 'forward']);
		
		// 初始化
		function init (node, opts) {
			if(node == null){
				throw new Error('[common.forward.layer]init() required parameter mid is missing.');
			}
			if(opts == null){
				throw new Error('[common.forward.layer]init() required parameter opts is missing.');
			}
			client = node;
			mid = opts.mid;
			forwardData = opts;
			if(isInit == null){
				client.innerHTML = '';
				isInit = true;
			}
		}
		
		// 根据类型初始化发布器
		var initPublisher = function (type) {
			if(lastInstance != null){
				lastInstance.hide();
			}
			type = type.toString();
			var instance;
			if(that.instances[type] == null){
				var data = {}, result;
				for(var key in defaultData){
					data[key] = forwardData[key];
				}
				data.type = type;
				result = {
					'client' : client,
					'data' : data,
					'styleId': opts.styleId,
					'inDialog' : false
				};
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
				instance.reset && instance.reset();
			}
			instance.show();
			lastInstance = instance;
		};
		var shine = function(type){
			that.instances[type || "1"].shine();
		};
		// 销毁
		var destory = function () {
			for(var key in that.instances){
				var item = that.instances[key];
				item.destory();
				item = null;
			}
			that.instances = null;
			$.custEvent.undefine(that);
			tab = null;
			client = null;
			lastInstance = null;
			mid = null;
			opts = null;
		};
		that.init = init;
		that.shine = shine;
		that.show = initPublisher;
		that.destory = destory;
		return that;
	};
	
});
