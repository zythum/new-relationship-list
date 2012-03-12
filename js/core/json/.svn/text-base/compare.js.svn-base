/**
 * compare two json whether equal.
 * @id STK.core.json.compare
 * @alias STK.core.json.compare
 * @param {Json} json2
 * @param {Json} json1
 * @return {Boolean} TRUE/FALSE
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var j1 = {'a':1,'b':2,'c':3};
 * var j2 = {'a':1,'b':2,'c':3};
 * STK.core.json.compare(j1,j2) === TRUE;
 */
$Import('core.json.include');
STK.register('core.json.compare',function($){
	return function(json1,json2){
		if($.core.json.include(json1,json2) && $.core.json.include(json2,json1)){
			return true;
		}else{
			return false;
		}
	};
});