/**
 * 弹出汽泡
 * @id STK.module.bubble
 * @param  {Object} spec 非必选参数, 默认
 * 		{
			'l'               : 0,           最终l位置
			't'               : 0,           最终t位置
			'w'               : 200,         最终显示宽度
			'h'               : 20,          最终显示高度
			'count'           : 8,           运动步数
			'sor'             : 1.5,         单步运动修正
			'gap'             : 20,          单步间隔时间(毫秒)
			'zIndex'          : 500,         显示层级
			'alphaTo'         : 0.8,         最终显示透明度(0~1)
			'alphaFrom'       : 0.05,        起始透明度(0~1)
			'backgroundColor' : '#ffffff',   背景颜色
			'template'        : templete,    模板
			'borderWidth'     : '1px',       边框宽度
			'borderStyle'     : 'solid',     边框样式
			'borderColor'     : '#000000'    边框颜色
		}
 * @return {Object} {show:function(){},hidden:function(){},rect:function(){}}
 * @author liusong@staff.sina.com.cn
 * @example
 * 	var bubble = STK.module.bubble({l:100,t:100,w:500,h:500});
 * 	bubble.show();
 * 	setTimeout(bubble.hidden, 3000);
 */
STK.register('module.tips',function($){
	var templete = '<div node-type="outer" style="visibility:hidden"></div>',
		u;
	//队列计算
	var queue = function(form, to, count, sor){
        var m = Math.max(form, to), n = Math.min(form, to), que = [m], snap = m - n, i = 1;
		que[count] = n;
		for(i; i<count; i++){ que[i] = (snap = snap/sor) + n}
		return form>to? que: que.reverse();
	};
	return function(spec){
		//默认参数配置
		var conf = $.parseParam({
			'l'               : 0,
			't'               : 0,
			'w'               : 200,
			'h'               : 20,
			'count'           : 8,
			'sor'             : $.IE? 1.5: 1.2,
			'gap'             : 20,
			'zIndex'          : 500,
			'alphaTo'         : 0.8,
			'alphaFrom'       : 0.05,
			'template'        : templete,
			'wipe'            : 'pop',
			'backgroundColor' : '#ffffff',
			'border'          : '1px solid #000000',
			'boxShadowFrom'   : 10,
			'boxShadowTo'     : 50,
			'borderRadius'    : '3px'
		},spec||{});
		//变量声明
		var b      = document.body,
			dom    = $.builder(conf.template),
			list   = dom.list,
			outer  = list.outer[0],
			css    = ['position:absolute;background-color:',conf['backgroundColor'],';z-index:',conf['zIndex'],';border:', conf['border'],';'].join(''),
			radius = ['-moz-border-radius:',conf['borderRadius'], ';-webkit-border-radius:',conf['borderRadius'], '-o-border-radius:',conf['borderRadius'],';'].join(''),
			aQue, xQue, yQue, wQue, hQue, sQue, index, deep, clock, callback;
		//单步设置
		var step = function(){
				var cssText = [
					css,
					'left:'   , (xQue[index] == u? conf['l']: xQue[index]), 'px;',
					'top:'    , (yQue[index] == u? conf['t']: yQue[index]), 'px;',
					'width:'  , (wQue[index] == u? conf['w']: wQue[index]), 'px;',
					'height:' , (hQue[index] == u? conf['h']: hQue[index]), 'px;',
					'filter:alpha(opacity=', (aQue[index]*100), ');',
					'opacity:' , aQue[index], ';',
					radius, sQue[index]
				];
				outer.style.cssText = cssText.join('');
				if(index == (deep>0? conf['count']: 0)){
					clearInterval(clock);
					outer.style.visibility = "hidden";
					if(typeof callback == "function"){callback()}
					return;
				}
				index+=deep;
			};
		var timer = function(){
			if(index == null){ index = deep>0? 0: conf['count'] };
			clearInterval(clock);
			clock = setInterval(step, conf['gap']);
		};
		var wipe = {};
			wipe.pop = function(){
				wQue = queue(0, conf['w'], conf['count'], conf['sor']);
				hQue = queue(0, conf['h'], conf['count'], conf['sor']);
				xQue = $.foreach(wQue, function(n, i){return (conf['w']-n)/2+conf['l']});
				yQue = $.foreach(hQue, function(n, i){return (conf['h']-n)/2+conf['t']});
			};
			wipe.up = function(){
				xQue = wQue = [];
				hQue = queue(0, conf['h'], conf['count'], conf['sor']);
				yQue = $.foreach(hQue, function(n){return conf['t'] + conf['h'] - n});
			};
			wipe.down = function(){
				xQue = wQue = yQue = [];
				hQue = queue(0, conf['h'], conf['count'], conf['sor']);
			};
			wipe.left = function(){
				yQue = hQue = [];
				wQue = queue(0, conf['w'], conf['count'], conf['sor']);
				xQue = $.foreach(wQue, function(n){return conf['l'] + conf['w'] - n});
			};
			wipe.right = function(){
				yQue = hQue = xQue = [];
				wQue = queue(0, conf['w'], conf['count'], conf['sor']);
				aQue = queue(conf['alphaFrom'], conf['alphaTo'], conf['count'], conf['sor']);
			};
		//控制体集合
		var it = {};
			/**
			 * 设置显示参数
			 * @method rect
			 */
			(it.rect = function(nX, nY, nW, nH){
				conf = $.parseParam(conf,{
					'l' : nX,
					't' : nY,
					'w' : nW,
					'h' : nH
				});
				wipe[conf['wipe']]();
				aQue = queue(conf['alphaFrom'], conf['alphaTo'], conf['count'], conf['sor']);
				sQue = $.foreach(queue(conf['boxShadowFrom'],conf['boxShadowTo'],conf['count'],conf['sor']),function(n){
					var shadow = ['0 0 ',Math.ceil(n),'px #777'].join('');
					return ['-moz-box-shadow:',shadow, ';-webkit-box-shadow:',shadow, ';box-shadow:',shadow,';'].join('')
				});
			})();
			/**
			 * 显示汽泡
			 * @method show
			 * @param {Function} fCallback 非必选参数，汽泡显示运动完成后回调函数
			 */
			it.show = function(fCallback){
				callback = fCallback;
				deep = 1;
				timer();
			};
			/**
			 * 隐藏汽泡
			 * @method hidden
			 * @param {Function} fCallback 非必选参数，汽泡隐藏运动完成后回调函数
			 */
			it.hidden = function(fCallback){
				callback = fCallback;
				deep = -1;
				timer();
			};
		b.appendChild(outer);
		return it;
	}
});