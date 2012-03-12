/**
 * Get unique key
 * @id STK.core.util.getUniqueKey
 * @alias STK.core.util.getUniqueKey
 * @return {Number} n
 * @author Robin Young | yonglin@staff.sina.com.cn
 *		Finrila | wangzheng4@staff.sina.com.cn
 * @example
 * STK.core.util.getUniqueKey('') === '141281425000671';
 * @history
 * 2010.12.03 Finrila 修改随机数获取方式，解决性能问题以及不唯一的情况
 */
STK.register('core.util.getUniqueKey', function($) {
	var _loadTime = (new Date()).getTime().toString(), _i = 1;
	return function() {
		return _loadTime + (_i++);
	};
});