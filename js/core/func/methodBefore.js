$Import("core.obj.parseParam");

STK.register('core.func.methodBefore', function($){
	return function(){
		var started = false;
		var methodList = [];
		var that = {};
		that.add = function(oFunc, oOpts){
			var opts = $.core.obj.parseParam({
				args: [],
				pointer: window,
				top: false
			}, oOpts);
			// 插到最前
			if (opts.top == true) {
				methodList.unshift([oFunc, opts.args, opts.pointer]);
			}
			// 插到最后
			else {
				methodList.push([oFunc, opts.args, opts.pointer]);
			}
			return !started;
		};
		that.start = function(){
			var i, len, method, args, pointer;
			if (started == true) {
				return;
			}
			started = true;
			for (i = 0, len = methodList.length; i < len; i++) {
				method = methodList[i][0];
				args = methodList[i][1];
				pointer = methodList[i][2];
				method.apply(pointer, args);
			}
		};
		that.reset = function(){
			methodList = [];
			started = false;
		};
		that.getList = function(){
			return methodList;
		};
		return that;
	};
});
