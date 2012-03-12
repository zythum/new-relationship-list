/**
 * timer manager [static]
 * @id STK.core.util.timer
 * @alias STK.core.util.timer
 * @method {String} add(fun)
 * @method {Timer} remove(key)
 * @method {Timer} pause(key)
 * @method {Timer} play(key)
 * @method {Timer} stop(key)
 * @method {Timer} start(key)
 * @method {Timer} loop(key)
 * @method {String} get(sKey)
 * @method {String} set(sKey,value)
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
	var key = STK.core.util.timer.add(function(){console.log('test')});
	STK.core.util.timer.pause(key);
	STK.core.util.timer.play(key);
	STK.core.util.timer.stop(key);
	STK.core.util.timer.start(key);
	STK.core.util.timer.loop(key);
	STK.core.util.timer.remove(key);
 */
STK.register('core.util.timer', function($){
	return (function(){
		var that = {};
		
		
		var list = {};
		
		var refNum = 0;
		var clock = null;
		var allpause = false;
		
		var delay = 25;
		
		var loop = function(){
			for (var k in list) {
				if (!list[k]['pause']) {
					list[k]['fun']();
				}
			}
			return that;
		};
		
		that.add = function(fun){
			if (typeof fun != 'function') {
				throw ('The timer needs add a function as a parameters');
			}
			var key = '' +
			(new Date()).getTime() +
			(Math.random()) * Math.pow(10, 17);
			
			list[key] = {
				'fun': fun,
				'pause': false
			};
			if (refNum <= 0) {
				that.start();
			}
			refNum++;
			return key;
		};
		
		that.remove = function(key){
			if (list[key]) {
				delete list[key];
				refNum--;
			}
			if (refNum <= 0) {
				that.stop();
			}
			return that;
		};
		
		that.pause = function(key){
			if (list[key]) {
				list[key]['pause'] = true;
			}
			return that;
		};
		
		that.play = function(key){
			if (list[key]) {
				list[key]['pause'] = false;
			}
			return that;
		};
		
		that.stop = function(){
			clearInterval(clock);
			clock = null;
			return that;
		};
		
		that.start = function(){
			clock = setInterval(loop, delay);
			return that;
		};
		
		that.loop = loop;
		that.get = function(key){
			if (key === 'delay') {
				return delay;
			}
			if (key === 'functionList'){
				return list;
			}
		};
		
		that.set = function(key,value){
			if(key === 'delay'){
				if(typeof value === 'number'){
					delay = Math.max(25,Math.min(value,200));
				}
			}
		};
		return that;
	})();
});
