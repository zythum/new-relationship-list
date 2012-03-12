/**
 * 得到满足指定条件的某个祖先节点 
 * @id $.kit.dom.parentElementBy
 * @param {htmlElement} srcNode 此节点开始向上搜寻父节点  必
 * @param {htmlElement} rangeNode 在此节点下搜寻  必
 * @param {Function} fn  判断方法 必
 * @author gaoyuan3@staff.sina.com.cn
 * @example
	//得到#child的title为‘kkk’ 的祖先元素
	var oPB = $.kit.dom.parentElementBy($.E('#child'), document.HTMLElement, function (el) {
		if(el.title == 'kkk') {
			return true;
		}
	});
 */
STK.register('kit.dom.parentElementBy',function($){
	return function(srcNode, rangeNode, fn) {
		if(!srcNode || !rangeNode) {throw new Error('传入的参数为空');}
		var i = 0, oR;
		srcNode = srcNode.parentNode;

		while(srcNode.parentNode) {
			i++;
			oR = fn(srcNode);
			if(oR === false) {
				return false;
			}else if(oR === true) {
				return srcNode;
			}else if(oR === rangeNode) {
				return null;
			}

			srcNode = srcNode.parentNode;
			if(i >30000) {
				return false;
			}
		}
		return null;
	};
});