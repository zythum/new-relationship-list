/**
 * @fileoverview
 * 转发浮层，事实上这里是通过 dialog 封装了 common.forward.publisher
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
 */

/**
 * example:
	var forward = $.common.dialog.forward();
	forward.show(weiboId,{
		'type' : 1,	// 可选，1=转发到微博[默认值]，2=转发到私信，3=转发到围裙，4=转发到邮箱
		'originNick' : '原作昵称',
		'origin' : '被转发原文',
		'url' : '当前微博URL',
		'forwardNick' : '转发昵称',	（如果有）
		'reason' : '转发理由',		（如果有）
		'pid' : '图片ID'				（如果有）
	});
	forward.hide();
	forward.destroy();
 */
$Import("kit.extra.language");
$Import("ui.dialog");
$Import("common.forward.publisher");
$Import("kit.extra.toFeedText");
STK.register('common.dialog.forward',function($){
	//---常量定义区---------------------------------- 
	var MSG = {
		'title' : '#L{转发微博}',
		'commentPerson' : '#L{同时评论给}',
		'originPerson' : '#L{同时评论给原文作者}',
		'notice' : '#L{请输入转发理由}',
		'defUpdate' : '#L{转发微博}'
	};
	
	var lang = $.kit.extra.language;

	
	//-------------------------------------------
	
	return function(spec){
		var that = {};

		var conf, mid, publisher, dialog;
		
		conf = $.parseParam({
			'styleId' : '1'
		}, spec);
		var inner;
		
		// 自定义事件定义
		$.custEvent.define(that, ['forward', 'hide', 'show']);

		/*------------end lazyInit-------------*/
		
		var show = function(weiboId, opts){
			if(typeof weiboId !== 'string' && typeof weiboId !== 'number'){
				throw new Error('$.common.dialog.forward.show need string (or number) as weiboId');
			}
			mid = weiboId;
			if(opts.pic){
				opts.pid = opts.pic
			}
			var args = $.parseParam({
				'appkey': '',
				'type' : 1,
				'origin' : '',
				'reason' : '',
				'originNick' : '',
				'forwardNick' : '',
				'title' : lang(MSG.title),
				'domInit' : false,
				'url' : null,
				'styleId' : "1",
				'allowComment' : "1",
				'allowForward' : "1",
				'allowRootComment' : "1",
				'uid' : '',
				'rootuid' : '',
				'pid' : '',
				'domain': ''
			}, opts);
			dialog = $.ui.dialog();
			dialog.setTitle(args.title);
			// 初始化发布器
			publisher = new $.common.forward.publisher(mid, args);
			// 取得发布器 DOM
			dialog.appendChild(publisher.getDom());
			dialog.setBeforeHideFn(function(){
				inner.className = "detail";
				publisher.destroy();
				dialog.clearBeforeHideFn();
			});
			inner = dialog.getInner();
			inner.className = "detail layer_forward";
			inner.style.height = "260px";
			dialog.show();
			center();
			// 完成发布器的实例化
			publisher.init(inner);
			inner.style.height = "";
			$.custEvent.add(publisher, 'hide', function (){
				hide();
			});
			$.custEvent.add(publisher, 'center', function (){
//				center();
			});
			$.custEvent.add(publisher, 'forward', function (evt, data){
				$.custEvent.fire(that, 'forward', data);
			});
			
			$.custEvent.add(dialog,'hide',function(){
				var layer = dialog;
				var callee = arguments.callee;
				/*alert(layer.getOuter().parentNode.nodeName);
				setTimeout(function(){
					alert(layer.getOuter().parentNode.parentNode);
				}, 5000);*/
//				var _loop = setInterval(function(){
//					if(layer.getInner().children.length == 0 && layer.getOuter().parentNode.nodeName.toLowerCase() !== "body"){
//					if(layer.getInner().children.length == 0){
						$.custEvent.remove(layer,'hide',callee);
						dialog = null;
						layer = null;
						$.custEvent.fire(that, 'hide');
//						clearInterval(_loop);
//						_loop = undefined;
//					}
//				}, 100);
			});
			
			$.custEvent.fire(that, 'show', {
				box   : dialog
			});
		};
		// 隐藏
		var hide = function(){
			destroy();
			dialog.hide();
		};
		// 隐藏
		var center = function(){
			dialog.setMiddle(inner);
		};
		// 销毁
		var destroy = function(){
			publisher.destroy();
		};
		
		that.show = show;
		that.destroy = destroy;
		//-------------------------------------------
		return that;
	};
});
