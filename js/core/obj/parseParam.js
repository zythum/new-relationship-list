/**
 * 合并参数，不影响源
 * @id STK.core.obj.parseParam
 * @alias STK.core.obj.parseParam
 * @param {Object} oSource 需要被赋值参数的对象
 * @param {Object} oParams 传入的参数对象
 * @param {Boolean} isown 是否仅复制自身成员，不复制prototype，默认为false，会复制prototype
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * var cfg = {
 * 	name: '123',
 *  value: 'aaa'
 * };
 * cfg2 = STK.core.obj.parseParam(cfg, {name: '456'});
 * //cfg2 == {name:'456',value:'aaa'}
 * //cfg == {name:'123',value:'aaa'}
 */
STK.register('core.obj.parseParam', function($){
	return function(oSource, oParams, isown){
		var key, obj = {};
		oParams = oParams || {};
		for (key in oSource) {
			obj[key] = oSource[key];
			if (oParams[key] != null) {
				if (isown) {// 仅复制自己
					if (oSource.hasOwnProperty[key]) {
						obj[key] = oParams[key];
					}
				}
				else {
					obj[key] = oParams[key];
				}
			}
		}
		return obj;
	};
});
