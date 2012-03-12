/**
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @id STK.core.obj.cut
 * @alias STK.core.obj.cut
 * @param {Object} obj 原对象
 * @param {Array} list 删除列表
 * @return {Object} 被剪切后的新对象
 * @example
 * var cfg = {
 *  name: '123',
 *  value: 'aaa',
 *  test: true
 * };
 * var cfg2 = $.core.obj.cut(cfg,['test']);
 * //cfg2 == {name:'123','value':'aaa'};
 */

$Import('core.arr.isArray');
$Import('core.arr.inArray');

STK.register('core.obj.cut',function($){
	return function(obj, list){
		var ret = {};
		if(!$.core.arr.isArray(list)){
			throw 'core.obj.cut need array as second parameter';
		}
		for(var k in obj){
			if(!$.core.arr.inArray(k,list)){
				ret[k] = obj[k];
			}
		}
		return ret;
	};
});