/**
 * queue [static]
 * @id STK.core.util.stack
 * @alias STK.core.util.stack
 * @return {
		'add':
		'get':
	}
 * @example
	var test = STK.core.util.stack();
	test.add('test');
	test.get() === 'test';
 */
STK.register('core.util.stack', function($){
	return function(){
		var that = {};
		var stak = [];
		that.add = function(item){
			stak.push(item);
			return that;
		};
		that.get = function(){
			if (stak.length > 0) {
				return stak.pop();
			}
			else {
				return false;
			}
		};
		return that;
	}
});
