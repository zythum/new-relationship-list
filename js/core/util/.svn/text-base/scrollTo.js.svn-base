/**
 * 获取滚动条的上下位置
 * @id STK.core.util.scrollTo
 * @alias STK.core.util.scrollTo
 * @param {Element} target 需要现实的元素
 * @param {Object} spec {
 * 			'box' : 滚动条所在元素,默认页面滚动条,
			'top' : 距顶高度,默认0,
			'step' : 速度10为一次到目标,默认2,
			'onMoveStop' : 移动执行完的函数
 * 		}
 * @return {void}
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * STK.core.util.scrollTo($('test'));
 */

$Import('core.obj.parseParam');
$Import("core.dom.position");
$Import('core.util.timer');
$Import('core.dom.isNode');
STK.register('core.util.scrollTo',function($){
	return function(target,spec){
		if(!$.core.dom.isNode(target)){
			throw 'core.dom.isNode need element as the first parameter';
		}
		var conf = $.core.obj.parseParam({
			'box' : document.documentElement,
			'top' : 0,
			'step' : 2,
			'onMoveStop' : null
		},spec);
		conf.step = Math.max(2,Math.min(10,conf.step));
		var orbit = [];
		var targetPos = $.core.dom.position(target);
		var boxPos;
		if(conf['box'] == document.documentElement){
			boxPos = {'t':0};
		}else{
			boxPos = $.core.dom.position(conf['box']);
		}
		
		var pos = Math.max(0, (targetPos ? targetPos['t'] : 0) - (boxPos ? boxPos['t'] : 0) - conf.top);
		var cur = conf.box === document.documentElement ? (conf.box.scrollTop || document.body.scrollTop || window.pageYOffset) : conf.box.scrollTop;
		while(Math.abs(cur - pos) > conf.step && cur !== 0){
			orbit.push(Math.round(cur + (pos - cur)*conf.step/10));
			cur = orbit[orbit.length - 1];
		}
		if(!orbit.length){
			orbit.push(pos);
		}
		var tm = $.core.util.timer.add(function(){
			if(orbit.length){
				if(conf.box === document.documentElement){
					window.scrollTo(0,orbit.shift());
				}else{
					conf.box.scrollTop = orbit.shift();
				}
				
			}else{
				if(conf.box === document.documentElement){
					window.scrollTo(0,pos);
				}else{
					conf.box.scrollTop = pos;
				}
				$.core.util.timer.remove(tm);
				if(typeof conf.onMoveStop === 'function'){
					conf.onMoveStop();
				}
			}
		});
	};
});