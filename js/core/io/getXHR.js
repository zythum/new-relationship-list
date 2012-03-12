/**
 * make a xmlhttprequest object
 * @id STK.core.io.getXHR
 * @alias STK.core.io.getXHR
 * @return {xmlhttprequest} XHR 
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
 * var xhr = STK.core.io.getXHR();
 */
STK.register('core.io.getXHR', function($){
	return function(){
		var _XHR = false;
		try {
			_XHR = new XMLHttpRequest();
		} 
		catch (try_MS) {
			try {
				_XHR = new ActiveXObject("Msxml2.XMLHTTP");
			} 
			catch (other_MS) {
				try {
					_XHR = new ActiveXObject("Microsoft.XMLHTTP");
				} 
				catch (failed) {
					_XHR = false;
				}
			}
		}
		return _XHR;
	};
});
