/**
 * 产生清理value为null的数据,不修改原始传入的Object对象
 * @param {Object} 未清理前的Object数据
 * @return {Object} 清理后的Object数据
 * @author FlashSoft | fangchao@staff.sina.com.cn
 */
STK.register('core.obj.clear', function($){
	return function(oHash){
		var key, newHash = {};
		for(key in oHash) {
			if(oHash[key] != null) {
				newHash[key] = oHash[key];
			}
		}
		return newHash;
	};
});
