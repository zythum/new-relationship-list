$Import('core.evt.addEvent');
$Import('core.util.browser');
$Import('core.func.getType');
STK.register('core.dom.ready', function($){
	var funcList = [];
	var inited = false;
	var getType = $.core.func.getType;
	var browser = $.core.util.browser;
	var addEvent = $.core.evt.addEvent;
	
	var checkReady = function(){
		if(!inited){
			if(document.readyState === 'complete'){
				return true;
			}
		}
		return inited;
	};
	// 执行数组里的函数列表
	var execFuncList = function() {
		if (inited == true) {return;}
		inited = true;
		
		for (var i = 0, len = funcList.length; i < len; i++) {
			if (getType(funcList[i]) === 'function') {
				try{
					funcList[i].call();
				}catch(exp){
				
				}
			}
		}
		funcList = [];
	};
	
	
	var scrollMethod = function() {
		if(checkReady()){
			execFuncList();
			return;
		}
		try {
			document.documentElement.doScroll("left");
		}catch(e) {
			setTimeout(arguments.callee, 25);
			return;
		}
		execFuncList();
	};
	
	var readyStateMethod = function(){
		if(checkReady()){
			execFuncList();
			return;
		}
		setTimeout(arguments.callee, 25);
	};
	
	
	
	
	var domloadMethod = function() {
		addEvent(document, 'DOMContentLoaded', execFuncList);
	};
	var windowloadMethod = function(){
		addEvent(window, 'load', execFuncList);
	};
	
	if(!checkReady()){
		if($.IE && window === window.top){
			scrollMethod();
		}
		domloadMethod();
		readyStateMethod();
		windowloadMethod();
	}
	
	return function(oFunc) {// 如果已经DOMLoad了, 则直接调用
		if (checkReady()) {
			if (getType(oFunc) === 'function') {
				oFunc.call();
			}
		} else {// 如果还没有DOMLoad, 则把方法传入数组
			funcList.push(oFunc);
		}
	};
});