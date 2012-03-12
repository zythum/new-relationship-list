/**
 * Judge a json is part of other json.
 * @id STK.core.json.include
 * @alias STK.core.json.include
 * @param {Json} json2
 * @param {Json} json1
 * @return {Boolean} TRUE/FALSE
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var j1 = {'a':1,'b':2,'c':3};
 * var j2 = {'a':1}
 * STK.core.json.include(j1,j2) === TRUE;
 */
STK.register('core.json.include',function($){
	return function(json2,json1){
		for ( var k in json1 ){
			if (typeof json1[k] === 'object'){
				if ( json1[k] instanceof Array ) {
					if ( json2[k] instanceof Array ){
						if ( json1[k].length === json2[k].length ){
							for ( var i = 0, len = json1[k].length; i < len; i += 1 ){
								if ( !arguments.callee( json1[k][i], json2[k][i] ) ){
									return false;
								}
							}
						} else {
							return false;
						}
					} else {
						return false;
					}
				} else {
					if ( typeof json2[k] === 'object' ) {
						if ( !arguments.callee( json1[k], json2[k] ) ){
							return false;
						}
					} else {
						return false;
					}
				}
			} else if ( typeof json1[k] === 'number' || typeof json1[k] === 'string' ) {
				if ( json1[k] !== json2[k] ){
					return false;
				}
			} else if ( json1[k] !== undefined && json1[k] !== null ) {
				if ( json2[k] !== undefined && json2[k] !== null ){
					if ( !json1[k].toString || !json2[k].toString ) {
						throw 'json1[k] or json2[k] do not have toString method';
					}
					if ( json1[k] .toString() !== json2[k].toString()) {
						return false;
					}
				} else {
					return false;
				}
			}
		}
		return true;
	};
});