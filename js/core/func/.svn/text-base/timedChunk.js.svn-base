/**
 * 分时处理,从"Nicholas C. Zakas"处移植
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @see http://www.nczonline.net/blog/2009/08/11/timed-array-processing-in-javascript/
 * @param {Array} items
 * @param {Object} args
 * 	{
 * 		process : {function},//执行函数
 * 		context : {Object},//上下文
 * 		callback : {function},//返回函数
 * 		delay : {Number},
 * 		execTime : {Number}
 * 	}
 * @return void
 * @example
 * 	STK.core.func.timedChunk([function(){alert(1)},function(){alert(2)},function(){alert(3)}]);
 *  // 1
 *  // 2
 *  // 3
 * 	
 * 	STK.core.func.timedChunk([1,2,3],{
 * 		'process' : function(item){alert(item)},
 * 		'callback': function(items){alert(items)}
 * 	});
 *  // 1
 *  // 2
 *  // 3
 *  // [1, 2, 3]
 */

$Import('core.obj.parseParam');
$Import('core.arr.isArray');
STK.register('core.func.timedChunk', function($){
	var default_opts = {
			'process'	: function(func){
				if(typeof func === 'function'){
					func();
				}
			},
			'context'	: {},
			'callback'	: null,
			'delay'		: 25,
			'execTime'	: 50
		};
	return function(items, args){
		if(!$.core.arr.isArray(items)){
			throw 'core.func.timedChunk need an array as first parameter';
		}
		var todo = items.concat();
		var conf = $.core.obj.parseParam(default_opts, args);
		
		var timer = null;
		var loop = function(){
			var start = +new Date();
			
			do {
				conf.process.call(conf.context, todo.shift());
			}while (todo.length > 0 && (+new Date() - start < conf.execTime));
			
			if (todo.length <= 0) {
				if (conf.callback) {
					conf.callback(items);
				}
			}else{
				setTimeout(arguments.callee, conf.delay);
			}
		};
		
		timer = setTimeout(loop, conf.delay);
	};
});
