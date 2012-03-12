$Import("kit.dom.cssText");
$Import("common.listener");
$Import("kit.extra.textareaUtils");
$Import("kit.dom.isTurnoff");

/**
 * at提示
 * @id STK.module.at
 * @param  {Object} conf 必选参数, 默认
 * 	{
		'textEl' : node		TextArea对象
	}
 * @return {Object}
 * @author liusong@staff.sina.com.cn
 * @example
 *  var textarea = STK.E("publisher");
	var sugg = STK.C('div');
	document.body.appendChild(sugg);
	var at = STK.module.at({'textEl':textarea});
 	STK.core.evt.custEvent.add(at, 'at', function(type,data){
 		sugg.innerHTML = data.key;
 		sugg.style.cssText = ['z-index:1001;background-color:#ffffff;border:1px solid #000000;position:absolute;left:',data.l,'px;top:',data.t,'px;'].join('')
 	})
 */

STK.register('module.at',function($){
	//全局常量定义
	var	w = window,
		d = document,
		bw = $.core.util.browser,
		font = 'font-family:Tahoma,宋体;',
		selectionStart = $.kit.extra.textareaUtils.selectionStart;
	//默认参数设置
	var spec;
	//全局变量定义
	var clock, oldKey, oldStart, currPos;
	//实体化HTML代码
	var encodeValue = (function(){
		//实体对照表
		var hash  = {
			'<' : '&lt;',
			'>' : '&gt;',
			'\"': '&quot;',
			'\\': '&#92;',
			'&' : '&amp;',
			'\'': '&#039;',
			'\r': '',
			'\n': '<br>',
			' ' : (navigator.userAgent.match(/.+(?:ie) ([\d.]+)/i)||[8])[1]<8?
				['<pre style="overflow:hidden;display:inline;',font,'word-wrap:break-word;"> </pre>'].join(''):
				['<span style="white-space:pre-wrap;',font,'"> </span>'].join('')
		};
		//实休函数返回
		return function(value){
			var ret = value.replace(/(<|>|\"|\\|&|\'|\n|\r| )/g, function(h){
				return hash[h];
			});
			//返回实体文本
			return ret;
		};
	})();
	//获取镜像样式文本
	var getCss = function(){
		//局部变量声名
		var cssArr = [], oldCss = spec.textEl.style.cssText, curr;
		//生成padding及margin样式
		$.foreach(['margin','padding','border'],function(h){
		    $.foreach(["Top","Left","Bottom","Right"], function(c){
				var key;
				if(h != 'border'){
					key = 
					cssArr.push(h, '-', c.toLowerCase(), ':', $.getStyle(spec.textEl, h + c), ';')
					return;
				}
				$.foreach(['Color','Style','Width'],function(e){
					cssArr.push(h, '-', c.toLowerCase(), '-', e.toLowerCase() , ':', $.getStyle(spec.textEl, [h,c,e].join('')), ';')
				})
		    })
		});
		cssArr.push('font-size:' + $.getStyle(spec.textEl, '' +
				'fontSize') + ';');
		return $.kit.dom.cssText([
			oldCss,
			cssArr.join(''), 
			font, '\
			word-wrap: break-word;\
			line-height: 18px;\
			overflow-y:auto;\
			overflow-x:hidden;\
			outline:none;\
		'].join('')).getCss()
	};
	//镜像实体对像
	var mirror = (function(){
		//创建可复用容器
		var list = $.builder(['<div node-type="wrap" style="display:none;">',
				'<span node-type="before"></span>',
				'<span node-type="flag"></span>',
				'<span node-type="after"></span>',
			'</div>'].join('')).list;
		//各部份声名
		var wrap   = list['wrap'][0],
			flag   = list['flag'][0],
			after  = list['after'][0],
			before = list['before'][0],
			isInit = 0,
			clock,
			currentNode,
			cacheCssText;
		var fix = function(d){
				if(bw.MOZ){return -2}
				//如果是苹果系移动设置则进行隐藏内边距修正
				if(bw.MOBILE && bw.SAFARI && (bw.IPAD||bw.ITOUCH||bw.IPHONE)){return -2}
				return 0
			};
		//实体函数集
		return {
			//绑定镜像到textarea对象
			bind : function(){
				//如果是当前对象,不再进行重复初始化,退出
				if(currentNode === spec.textEl){return}
				//获到当前对象坐标
				currPos = $.position(spec.textEl);
				//$.log('pos',pos);
				//坐标样式
				var posCss = ['left:', currPos.l, 'px;top:', currPos.t + 20, 'px;'].join('');
				//$.log('poscss'+posCss);
				//重置缓存对象
				currentNode = spec.textEl;
				//初始化cssText
				var cssText = getCss();
				//修改当前TextArea样式
				currentNode.style.cssText = cssText;
				//缓存镜像样式
				cacheCssText = [
					posCss,
					cssText, '\
					position:absolute;\
					filter:alpha(opacity=0);\
					opacity:0;\
					z-index:-1000;\
				'].join('');
				//初始化镜像容器样式
				wrap.style.cssText = cacheCssText;
				//如果是首次使用则将镜像注入文档流
				if(!isInit){
					isInit = 1;
					d.body.appendChild(wrap);
				}
			},
			//设置镜像内容
			content : function(sBefore, sFlag, sKey, sAfter){
				wrap.style.cssText = [
					cacheCssText, '\
					width:',((parseInt($.getStyle(currentNode,'width'))||
							currentNode.offsetWidth) + fix()),'px;\
					height:',((parseInt($.getStyle(currentNode,'height'))||
							currentNode.offsetHeight)),'px;\
					overflow-x:hidden;\
					overflow-y:',(/webkit/i.test(navigator.userAgent))?'hidden':
							$.getStyle(currentNode,'overflowY'),';\
				'].join('');
				before.innerHTML = encodeValue(sBefore);
				flag.innerHTML = encodeValue(sFlag)||'&thinsp;';
				after.innerHTML = encodeValue([sKey,sAfter].join(''));
				clearTimeout(clock);
				clock = setTimeout(function(){
					var pos = $.position(flag);
					$.custEvent.fire(spec.eId, 'at', {
						't'    : (pos.t - currentNode.scrollTop) - currPos.t,
						'l'    : pos.l - currPos.l,
						'key'  : sKey,
						'flag' : sFlag,
						'textarea' : spec.textEl
					});
				},30)
			},
			//隐藏镜像，避免top过高导致页面下方大片空白,在blur的时候hide
			hide : function() {
				wrap.style.display = 'none';	
			},
			//显示镜像，避免top过高导致页面下方大片空白,在focus的时候show
			show : function() {
				wrap.style.display = '';
			}
		}
	})();
	//@验证
	var checkValue = function(){
		if($.kit.dom.isTurnoff(spec.textEl)){
			clearInterval(clock);
			return;
		}
		//缓存发布器中的内容
		var currValue = spec.textEl.value.replace(/\r/g,'');
		//光标位置
		var start = selectionStart(spec.textEl);
		//无法获取光标位置,退出
		if(start<0 || start == oldStart){return}
		//设置start位置缓存
		oldStart = start;
		//获取光标之前文本
		var before = currValue.slice(0, start);
		//var  matchArray = {'@' :')([a-zA-Z0-9\u4e00-\u9fa5_]{0,20})$'//,
			//'@|#' :')([#%（）&<>+a-zA-Z0-9\u4e00-\u9fa5_]{0,20})$'
			//};
		//如果话题那边要求对特殊字符处理，打开注释就可以。这样维护起来的工作量大，
		//获取@xxx
		//var flag  =spec['flag'];
		//var strMatch = matchArray[flag] ?   matchArray[flag] : matchArray['@'];

		var key = before.match(new RegExp(['(',spec['flag'],')([a-zA-Z0-9\u4e00-\u9fa5_]{0,20})$'].join('')));
		//不符合@验证规则或与缓存相同则不再进行计算,退出
		if(!key){$.custEvent.fire(spec.eId, 'hidden');return}
		//尾部内容
		var after = currValue.slice(start);
		//头部内容
		before = before.slice(0, -key[0].length);
		//初始化镜像内容
		mirror.content(before, key[1], key[2], after);
	};
	return function(conf){
		if(!conf || !conf['textEl']){return}
		//初始化参数
		conf = $.parseParam({
			//textarea对象
			'textEl': null,
			//支持标志位
			'flag'  : '@',
			//默认广播对象
			'eId'   : $.custEvent.define({}, ['at','hidden'])
		},conf);
		//焦点移除后停止验证发布内容
		var gc = function(){
			if(!spec){return}
			clearInterval(clock);
			$.removeEvent(spec.textEl, 'blur', gc);
			//隐藏镜像，避免top太大页面下方产空白生
			mirror.hide();
		};
		//焦点获取后开始验证发布内容
		var focus = function(){
			//$.log('module at focus');
			gc();
			//重置目标参数
			spec = conf;
			//清除key及start缓存
			oldStart = null;
			//初始化镜像
			mirror.bind();
			//focus之后处于监听状态
			mirror.show();
			clock = setInterval(checkValue, 200);
			$.addEvent(conf.textEl, 'blur', gc);
		};
		//事件绑定
		$.addEvent(conf.textEl, 'focus', focus);
		return conf['eId'];
	}
});

