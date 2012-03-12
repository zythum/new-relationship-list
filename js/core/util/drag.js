/**
 * 拖拽分发坐标的函数
 * @id STK.core.util.drag
 * @alias STK.core.util.drag
 * @param {Element} actEl
 * @param {Object} spec
 * @return {Object} drag Object
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var a = STK.core.util.drag(STK.E('outer'));
 * STK.core.evt.custEvent.add(a.getActObj(),'dragStart',function(e,data){console.log(e,data)});
 * STK.core.evt.custEvent.add(a.getActObj(),'dragEnd',function(e,data){console.log(e,data)});
 * STK.core.evt.custEvent.add(a.getActObj(),'draging',function(e,data){console.log(e,data)});
 */
$Import('core.obj.parseParam');
$Import('core.dom.isNode');
$Import('core.evt.custEvent');
$Import('core.util.scrollPos');
$Import("core.evt.addEvent");
$Import("core.evt.removeEvent");

STK.register('core.util.drag',function($){
	
	var stopClick = function(e){
		e.cancelBubble = true;
		return false;
	};
	
	var getParams = function(args,evt){
		args['clientX'] = evt.clientX;
		args['clientY'] = evt.clientY;
		args['pageX'] = evt.clientX + $.core.util.scrollPos()['left'];
		args['pageY'] = evt.clientY + $.core.util.scrollPos()['top'];
		return args;
	};
	
	return function(actEl,spec){
		if(!$.core.dom.isNode(actEl)){
			throw 'core.util.drag need Element as first parameter';
		}
		var conf = $.core.obj.parseParam({
			'actRect' : [],
			'actObj' : {}
		},spec);
		var that = {};
		
		var dragStartKey = $.core.evt.custEvent.define(conf.actObj,'dragStart');
		var dragEndKey = $.core.evt.custEvent.define(conf.actObj,'dragEnd');
		var dragingKey = $.core.evt.custEvent.define(conf.actObj,'draging');
		
		var startFun = function(e){
			var args = getParams({},e);
			document.body.onselectstart = function(){return false;};
			$.core.evt.addEvent(document,'mousemove',dragFun);
			$.core.evt.addEvent(document,'mouseup',endFun);
			$.core.evt.addEvent(document,'click',stopClick,true);
			if(!$.IE){
				e.preventDefault();
				e.stopPropagation();
			}
			//custEvent fire
			$.core.evt.custEvent.fire(dragStartKey,'dragStart',args);
			//end custEvent fire
			return false;
		};
		
		var dragFun = function(e){
			var args = getParams({},e);
			e.cancelBubble = true;
			//custEvent fire
			$.core.evt.custEvent.fire(dragStartKey,'draging',args);
			//end custEvent fire
		};
		
		var endFun = function(e){
			var args = getParams({},e);
			document.body.onselectstart = function(){return true;};
			$.core.evt.removeEvent(document,'mousemove',dragFun);
			$.core.evt.removeEvent(document,'mouseup',endFun);
			$.core.evt.removeEvent(document,'click',stopClick,true);
			//custEvent fire
			$.core.evt.custEvent.fire(dragStartKey,'dragEnd',args);
			//end custEvent fire
		};
		
		$.core.evt.addEvent(actEl,'mousedown',startFun);
		
		that.destroy = function(){
			$.core.evt.removeEvent(actEl,'mousedown',startFun);
			conf = null;
		};
		
		that.getActObj = function(){
			return conf.actObj;
		};
		
		return that;
	};
	
});