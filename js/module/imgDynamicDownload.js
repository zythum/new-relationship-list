/**
 * 将容器下所有元素dynamic-src属性的值赋予src,将dynamic-backgroundImage属性的值赋予.style.backgroundImage
 * @author gaoyuan3@staff.sina.com.cn
 */
STK.register('module.imgDynamicDownload', function($){
	return function (node) {
		var aList = $.sizzle('*', node);
		var sSrcUrl;
		$.foreach(aList, function(o) {
			sSrcUrl = o.getAttribute('dynamic-src');
			if(sSrcUrl) {
				o.src = sSrcUrl;
			}
			o.removeAttribute('dynamic-src');

			sBackgroundImageUrl = o.getAttribute('dynamic-backgroundImage');
			if(sBackgroundImageUrl) {
				o.style.backgroundImage = 'url(' + sBackgroundImageUrl + ')';
			}
			o.removeAttribute('dynamic-backgroundImage');
		});
	}
});