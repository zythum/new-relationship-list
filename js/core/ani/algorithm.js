/**
 * tween动画运算库
 * @id STK.core.ani.algorthm
 * @return {Number} 随着时间参数而改变的运算数值
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example 
		var res = core.ani.algorithm.compute('linear', 0, 100, 50, 500, 5, {});
 *
		core.ani.algorithm.addAlgorithm('test',function(t, b, c, d, s){
			return c * t / d + b;
		})
 */
STK.register('core.ani.algorithm', function($){
	
	var algorithm = {
		'linear' : function(t, b, c, d, s){
			return c * t / d + b;
		},
		
		'easeincubic' : function(t, b, c, d, s){
			return c * (t /= d) * t * t + b;
		},
		
		'easeoutcubic' : function(t, b, c, d, s){
			if ((t /= d / 2) < 1) {
				return c / 2 * t * t * t + b;
			}
			return c / 2 * ((t -= 2) * t * t + 2) + b;
		},
		
		'easeinoutcubic' : function(t, b, c, d, s){
			if (s == undefined) {
				s = 1.70158;
			}
			return c * (t /= d) * t * ((s + 1) * t - s) + b;
		},
		
		'easeinback' : function(t, b, c, d, s){
			if (s == undefined) {
				s = 1.70158;
			}
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		},
		
		'easeoutback' : function(t, b, c, d, s){
			if (s == undefined) {
				s = 1.70158;
			}
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		},
		
		'easeinoutback' : function(t, b, c, d, s){
			if (s == undefined) {
				s = 1.70158;
			}
			if ((t /= d / 2) < 1) {
				return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
			}
			return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
		}
	};
	return {
		'addAlgorithm' : function(name, fn){
			if ( algorithm[name] ){
				throw '[core.ani.tweenValue] this algorithm :' + name + 'already exist';
			}
			algorithm[name] = fn;
		},
		'compute' : function(type, propStart, proDest, timeNow, timeDest, extra, params){
			if ( typeof algorithm[type] !== 'function' ){
				throw '[core.ani.tweenValue] this algorithm :' + type + 'do not exist';
			}
			return algorithm[type](timeNow, propStart, proDest, timeDest,  extra, params);
		}
	};
});
