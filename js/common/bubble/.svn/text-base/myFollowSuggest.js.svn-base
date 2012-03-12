/**
 * @fileoverview
 * 我关注的人suggest
 * @author L.Ming | liming1@staff.sina.com.cn
 * @history
 * @example
	var sugg = new $.common.bubble.myFollowSuggest({
		'textNode' : btn.followList,
//		'list_template' : '',		// UL 的模板，可选参数，暂不支持
		'callback' : function (user){
			alert(user);
		}
	});
	sugg.show();
	//todo 希望使用layoutPos by WK
 */

$Import("module.suggest");
$Import('common.trans.global');
STK.register("common.bubble.myFollowSuggest", function ($){
	
	var CONTAINER = '<div style="position: absolute; top: -2000px; left: -2000px;'
		+' z-index: 100001;" node-type="___followListSuggest___" class="layer_menu_list"></div>';

	var TEMPLATE = ''
	+ '<#et userlist data>'
	+ '<ul>'
		+ '<#list data.users as list>'
			+ '<li action-type="followItem" action-data="index=${list.uid}">'
				+ '<a href="#" onclick="return false;">${list.screen_name}</a>'
			+ '</li>'
		+ '</#list>'
	+ '</ul>';
	
	return function (opts) {
		var suggest,	// suggest 对象
			trans,		// 我关注的人接口
			textNode,	// 文本框节点
			listNode,	// 下拉列表节点
//			selectedIndex,	// 当前选择的第几个
			oldValue,	// 保存文本框的值，以便在值有变化的时候重新获取数据
			isOpen,		// 保存 suggest 的自定义事件 open状态
			lastIndex,	// 保存上一次选择的 index
			itemList,	// 当前下拉的  LI 列表
			cacheData,	// 保存当前的 suggest 列表值
			isFromSuggest,	// 表示当前是 suggest 选择的值，并非用户输入
			callback;
		if(opts == null ||(opts != null && opts.textNode == null)){
			throw new Error('[common.bubble.myFollowSuggest]Required parameter opts.textNode is missing');
		}
		textNode = opts.textNode;
		callback = opts.callback;
		if(opts.list_template){
			TEMPLATE = opts.list_template;
		}
		if(!$.isNode(textNode)){
			throw new Error('[common.bubble.myFollowSuggest]Required parameter opts.textNode is NOT a html node.');
		}
		
		var that = {};
		// 监听键盘 keyup 事件的处理函数
		function keyHandler (){
			if(!isOpen){
				$.custEvent.fire(textNode, 'open', textNode);
				isOpen = true;
			}
			// 判断值有变化，才请求接口
			if($.trim(textNode.value) != "" && textNode.value != oldValue){
				oldValue = textNode.value;
				getSuggestData();
			} else if($.trim(textNode.value) == "") {
				hide();
				oldValue = "";
			}
			
		}
		// 从接口获取 suggest 数据
		function getSuggestData (){
			trans.request($.parseParam({q:textNode.value,type:0},opts));
		}
		// 接口成功
		function success (ret, params) {
			var pos;
			listNode.innerHTML = $.core.util.easyTemplate(TEMPLATE, {
				'users' : ret.data || []
			});
			// 点击页面其他位置隐藏 suggest
			$.addEvent(document.body, 'click', hide);

			cacheData = ret.data;
			pos = $.position(textNode);
			// TODO 根据输入框位置定位
			$.setStyle(listNode, 'left', pos.l + 'px');
			$.setStyle(listNode, 'top', (pos.t + textNode.scrollHeight) + 'px');
			getItemList();
			$.custEvent.fire(textNode, 'indexChange', 0);
			if (!ret.data.length) {
				hide();
			}
		}
		// 接口失败
		function error (ret, params) {
			hide();
		}
		// 获取 suggest 的 LI 列表，以便键盘上下移动改变样式
		function getItemList () {
			var list = $.sizzle('li', listNode);
			itemList = list;
		}
		// 高亮某一条 suggest
		function showIndex (type, index) {
			if(!itemList || itemList.length == 0) return;
			if(lastIndex != null){
				itemList[lastIndex] && (itemList[lastIndex].className = '');
			}
			if(index == null){
				index = 0;
			}
			itemList[index].className = 'cur';
			lastIndex = index;
		}
		// 设定文本框的值为用户选择的项
		function setIndex (type, index) {
			if(index == null || index < 0){
				return;
			}
			oldValue = cacheData[index].screen_name;
			oldValue = oldValue.replace(/\(.*\)/,""); //微号支持
			textNode.value = oldValue;
			hide();
			callback && callback(cacheData[index]);
		}
		function reset () {
			selectedIndex = -1;
		}

		// 产生外容器
		function createDom () {
			var node = $.sizzle('div[node-type="___followListSuggest___"]', document.body);
			if($.objIsEmpty(node) && !!!listNode){
				node = $.builder(CONTAINER);
				document.body.appendChild(node.box);
				node = $.sizzle('div[node-type="___followListSuggest___"]', document.body);
				!$.objIsEmpty(node) && (node = node[0]);
			}
			//因为可能没有消除该节点，导致打开过，也许会出现这种情况
			listNode = $.isArray(node)?node[0]:node;
			opts.width&& (listNode.style.width=opts.width+"px");
		}
		// 取得接口
		function getTrans () {
			trans = $.common.trans.global.getTrans(opts.transName || 'followList',{
				'onSuccess'	: success,
				'onError'	: error,
				'onFail'	: error
			});
		}
		// 绑定事件处理函数
		function bindEvent () {
			suggest = $.module.suggest({
				'textNode' : textNode,
				'uiNode'   : listNode,
				'actionType': 'followItem',
				'actionData': 'index'
			});
			// 监听鼠标滑过事件
			$.custEvent.add(suggest, 'onIndexChange', showIndex);
			// 监听用户确定事件
			$.custEvent.add(suggest, 'onSelect', setIndex);
			$.custEvent.add(suggest, 'onClose', hide);
			
//			$.custEvent.fire(textNode, 'indexChange', 0);
//			$.custEvent.fire(textNode, 'close');
			
			// 绑定 keydown 查接口事件
			$.addEvent(textNode, 'keyup', keyHandler);
		}
		// 初始化
		function init () {
			oldValue = textNode.value;
			createDom();
			getTrans();
			bindEvent();
		}
		// 显示 suggest
		function show () {
			reset();
			if(!suggest){
				init();
			}
		}
		// 隐藏 suggest
		function hide () {
			listNode.innerHTML = '';
			$.setStyle(listNode, 'left', '-2000px');
			$.setStyle(listNode, 'top', '-2000px');
			//$.custEvent.fire(textNode, 'close');
			isOpen = null;
			$.removeEvent(document.body, 'click', hide);
		};
		
		function destroy(){
			$.removeEvent(textNode, 'keyup', keyHandler);
			textNode = null;
		};
		
		that.show = show;
		that.hide = hide;
		that.destroy = destroy;
		
		return that;
	};
});