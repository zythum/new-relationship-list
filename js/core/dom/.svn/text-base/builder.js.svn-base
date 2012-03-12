/**
 * 自动把HTML分析成Dom节点,并返回相应的文档碎片跟带级联的节点列表
 * 不传入规则自动分析node-type属性,传入规则按照传入规则进行分析
 * @id STK.core.dom.builder
 * @alias STK.core.dom.builder
 * @param {String|Node} sHTML 需要被处理的HTML字符串 或者节点引用
 * @param {Object | Null} 参数
 * {
 * // dom对象, 选择器
 * 'input1': 'input[node-type=input1],textarea[node-type=input1]'
 * }
 * @return {Object} 文档碎片跟节点列表
 * {
 * 	'box': 文档碎片
 * 	'list': 节点列表,带级联
 * }
 * @author FlashSoft | fangchao@staff.sina.com.cn
 * @example
 * var sHTML = '' +
 * '<div node-type=div1>' +
 * '<input />' +
 * '<input />' +
 * '<input />' +
 * '<input />' +
 * '<input />' +
 * '<input />' +
 * '<input node-type="feed_item444444" />' +
 * '<input node-type="feed_item" />' +
 * '<textarea style="font-family: Tahoma,宋体;" range="1400" name="status" node-type="poster"></textarea>' +
 * '<ul>' +
 * '<li class="MIB_linedot_l" node-type ="feed_item" dynamic-id="2777763617"></li>' +
 * '<li class="MIB_linedot_l" node-type= "feed_ite43m" dynamic-id="2777763617"></li>' +
 * '<li class="MIB_linedot_l" node-type=              "feed_1item" dynamic-id="2777763617"></li>' +
 * '<li class="MIB_linedot_l" node-type="feed_it2em" dynamic-id="2777763617"></li>' +
 * '<li class="MIB_linedot_l" node-type="feed_item" dynamic-id="2777763617"></li>' +
 * '<li class="MIB_linedot_l" anode-type="1111111111111111111" dynamic-id="2777763617"></li>' +
 * '</ul>' +
 * '</div>' +
 * '<input node-type="input13" />' +
 * '<h1 node-type="h1111" />asdfasdf</h1>';
 * var bd = $.core.dom.builder(sHTML);
 */
$Import('core.arr.inArray');
$Import('core.func.getType');
$Import('core.dom.sizzle');

STK.register('core.dom.builder', function($){
	function autoDeploy(sHTML, oSelector){
		// 如果有传入的选择器,使用传入的选择器,而不仅仅使用内置的node-type这样的选择方式
		if (oSelector) {
			return oSelector;
		}
		// 匹配'<input node-type='input1' />中的
		// input跟input1
		var result, re = /\<(\w+)[^>]*\s+node-type\s*=\s*([\'\"])?(\w+)\2.*?>/g;
		var selectorList = {};
		var node, tag, selector;
		// 遍历所有符合条件的
		while ((result = re.exec(sHTML))) {
			tag = result[1];
			node = result[3];
			selector = tag + '[node-type=' + node + ']';
			selectorList[node] = selectorList[node] == null ? [] : selectorList[node];
			// 产生多条选择器
			if (!$.core.arr.inArray(selector, selectorList[node])) {
				selectorList[node].push(tag + '[node-type=' + node + ']');
			}
		}
		return selectorList;
	}
	return function(sHTML, oSelector){
		
		var _isHTML = $.core.func.getType(sHTML) == "string";
		// 自动配置
		var selectorList = autoDeploy( _isHTML ? sHTML : sHTML.innerHTML, oSelector);
		
		// 写入HTML
		var container = sHTML;
		
		if(_isHTML) {
			container = $.C('div');
			container.innerHTML = sHTML;
		}
		
		// 通过选择器产生domList
		// 默认产生的是数组,所以需要转化下
		
		// modify by Robin Young 
		// 用core.dom.sizzle.matches来提高性能.
		var key, domList, totalList;
		totalList = $.core.dom.sizzle('[node-type]', container);
		domList = {};
		for(key in selectorList){
			domList[key] = $.core.dom.sizzle.matches(selectorList[key].toString(), totalList);
		}
		//end modify
		
		
		// 把结果放入到文档碎片中
		var domBox = sHTML;
		
		if (_isHTML) {
			domBox = $.C('buffer');
			while (container.children[0]) {
				domBox.appendChild(container.children[0]);
			}
		}
		
		// 返回文档碎片跟节点列表
		return {
			'box': domBox,
			'list': domList
		};
	};
});
