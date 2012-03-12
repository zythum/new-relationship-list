/**
 * 在指定位置写入dom对象
 * 注意,使用此方法进行写入时,使用的是appendChild方法,所以不会存在两份dom元素
 * @id STK.core.dom.insertElement
 * @alias STK.core.dom.insertElement
 * @param {Element} node 
 * @param {Element} element 需要写入的节点
 * @param {String} where beforebegin/afterbegin/beforeend/afterend
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * STK.core.dom.insertElement($.E('test'),document.createElement('input'),'beforebegin');
 */
STK.register('core.dom.insertElement', function($){
	return function(node, element, where){
		node = $.E(node) || document.body;
		
		where = where ? where.toLowerCase() : "beforeend";
		switch (where) {
			case "beforebegin":
				node.parentNode.insertBefore(element, node);
				break;
			case "afterbegin":
				node.insertBefore(element, node.firstChild);
				break;
			case "beforeend":
				node.appendChild(element);
				break;
			case "afterend":
				if (node.nextSibling) {
					node.parentNode.insertBefore(element, node.nextSibling);
				}
				else {
					node.parentNode.appendChild(element);
				}
				break;
		}
	};
});
