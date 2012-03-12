var STK = (function() {
	var that = {};
	var errorList = [];
	//$Import
    that.inc = function (ns, undepended) {
		return true;
	};
	//STK.register
    that.register = function (ns, maker) {
		var NSList = ns.split('.');
		var step = that;
		var k = null;
		while(k = NSList.shift()){
			if(NSList.length){
				if(step[k] === undefined){
					step[k] = {};
				}
				step = step[k];
			}else{
				if(step[k] === undefined){
					try{
						step[k] = maker(that);
					}catch(exp){
						errorList.push(exp);
					}
				}
			}
		}
	};
	//STK.regShort
	that.regShort = function (sname, sfun) {
		if (that[sname] !== undefined) {
			throw '[' + sname + '] : short : has been register';
		}
		that[sname] = sfun;
	};
	//STK.IE
	that.IE = /msie/i.test(navigator.userAgent);
	//STK.E
	that.E = function(id) {
		if (typeof id === 'string') {
			return document.getElementById(id);
		} else {
			return id;
		}
	};
	//STK.C
	that.C = function(tagName) {
		var dom;
		tagName = tagName.toUpperCase();
		if (tagName == 'TEXT') {
			dom = document.createTextNode('');
		} else if (tagName == 'BUFFER') {
			dom = document.createDocumentFragment();
		} else {
			dom = document.createElement(tagName);
		}
		return dom;
	};
	
	that.log = function(str){
		errorList.push('[' + ((new Date()).getTime() % 100000) + ']: ' + str);
	};
	
	that.getErrorLogInformationList = function(n){
		return errorList.splice(0, n || errorList.length);
	};
	return that;
})();
$Import = STK.inc;