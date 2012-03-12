/**
 * queue [static]
 * @id STK.core.util.queue
 * @alias STK.core.util.queue
 * @return {
		'add':
		'get':
	}
 * @example
	var test = STK.core.util.queue();
	test.add('test');
	test.get() === 'test';
 */
STK.register('core.util.queue', function($){
	return function(){
		var that = {};
		var que = [];
		that.add = function(item){
			que.push(item);
			return that;
		};
		that.get = function(){
			if (que.length > 0) {
				return que.shift();
			}
			else {
				return false;
			}
		};
		return that;
	};
});
