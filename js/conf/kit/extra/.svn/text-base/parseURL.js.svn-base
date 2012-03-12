/**
 * 解析页面的当前 URL
 * @id STK.kit.extra.parsURL
 * @author L.Ming | liming1@staff.sina.com.cn
 * @return {Object} 真实的 URL 的对象实例 
 * @example 
 * 
 */
STK.register('kit.extra.parseURL', function($){
	return function(){
		return (STK.historyM && STK.historyM.parseURL)
					? STK.historyM.parseURL()
					: $.core.str.parseURL(location.href);
	};
});