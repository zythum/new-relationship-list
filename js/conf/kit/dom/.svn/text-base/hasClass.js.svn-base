/**
 * @author wangliang3@staff.sina.com.cn
 */
STK.register('kit.dom.hasClass',function($){
	var documentElement = document.documentElement, CLASS = (!documentElement.hasAttribute) ? 'className' : 'class';
	
	return function(el, className){
        var ret = false, current;
        if (el && className) {
            current = el.getAttribute(CLASS) || '';
            if (className.exec) {
                ret = className.test(current);
            }
            else {
                ret = className && (' ' + current + ' ').indexOf(' ' + className + ' ') > -1;
            }
        }
        else {
        }
        return ret;
    };
});