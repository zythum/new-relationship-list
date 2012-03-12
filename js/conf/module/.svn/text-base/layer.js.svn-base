/**
 * 层
 * @id STK.module.layer
 * @param {String} template html
 * @example 
 * 
 * var a = STK.module.layer('<div node-type="outer"><div node-type="title"></div><div node-type="inner"></div></div>');
 * document.body.appendChild(a.getDom("outer"));
 * a.show();
 * a.getDom("title");
 * @author Robin Young | yonglin@staff.sina.com.cn
 * 		Finrila | wangzheng4@staff.sina.com.cn
 */

STK.register('module.layer', function($){
	
	var getSize = function(box){
		var ret = {};
		if (box.style.display == 'none') {
			box.style.visibility = 'hidden';
			box.style.display = '';
			ret.w = box.offsetWidth;
			ret.h = box.offsetHeight;
			box.style.display = 'none';
			box.style.visibility = 'visible';
		}
		else {
			ret.w = box.offsetWidth;
			ret.h = box.offsetHeight;
		}
		return ret;
	};
	var getPosition = function(el, key){
		key = key || 'topleft';
		var posi = null;
		if (el.style.display == 'none') {
			el.style.visibility = 'hidden';
			el.style.display = '';
			posi = $.core.dom.position(el);
			el.style.display = 'none';
			el.style.visibility = 'visible';
		}
		else {
			posi = $.core.dom.position(el);
		}
		
		if (key !== 'topleft') {
			var size = getSize(el);
			if (key === 'topright') {
				posi['l'] = posi['l'] + size['w'];
			}
			else 
				if (key === 'bottomleft') {
					posi['t'] = posi['t'] + size['h'];
				}
				else 
					if (key === 'bottomright') {
						posi['l'] = posi['l'] + size['w'];
						posi['t'] = posi['t'] + size['h'];
					}
		}
		return posi;
	};
	
	return function(template){
		var dom = $.core.dom.builder(template);
		var outer = dom.list['outer'][0]
			,inner = dom.list['inner'][0];
		var uniqueID = $.core.dom.uniqueID(outer);
		var that = {};
		//事件 显示 隐藏
		var custKey = $.core.evt.custEvent.define(that, "show");
		$.core.evt.custEvent.define(custKey, "hide");
		
		var sizeCache = null;
		/**
		 * 显示
		 * @method show
		 * @return {Object} this
		 */
		that.show = function(){
			outer.style.display = '';
			$.core.evt.custEvent.fire(custKey, "show");
			return that;
		};
		/**
		 * 隐藏
		 * @method hide
		 * @return {Object} this
		 */
		that.hide = function(){
			outer.style.display = 'none';
			//modify by zhaobo 201105111623 转发私信层Ctrl+Enter提交后到此处会有报错。原因未知。添加timeout，问题解决。
			//window.setTimeout(function(){$.core.evt.custEvent.fire(custKey, "hide");}, 0);
			$.custEvent.fire(custKey, "hide");
			return that;
		};
		/**
		 * 层位置获取
		 * @method getPosition
		 * @param {String} key
		 * 		topleft: 左上 topright: 右上 bottomleft: 左下 bottomright: 右下
		 * @return {Object} 
		 * {
		 * 	l: ,//左位置
		 * 	t: //上位置
		 * }
		 */
		that.getPosition = function(key){
			return getPosition(outer, key);
		};
		/**
		 * 层大小获取
		 * @method getSize
		 * @param {Boolean} isFlash 是否重新获取大小
		 * @return {Object} 
		 * {
		 * 	w: ,//宽度
		 * 	h: //高度
		 * }
		 */
		that.getSize = function(isFlash){
			if(isFlash || !sizeCache){
				sizeCache = getSize.apply(that, [outer]);
			}
			return sizeCache;
		};
		/**
		 * 设置html
		 * @method html
		 * @param {String} html html字符串
		 * @return {Object} this
		 */
		that.html = function(html){
			if (html !== undefined) {
				inner.innerHTML = html;
			}
			return inner.innerHTML;
		};
		/**
		 * 设置文本
		 * @method html
		 * @param {String} str 字符串
		 * @return {Object} this
		 */
		that.text = function(str){
			if (text !== undefined) {
				inner.innerHTML = $.core.str.encodeHTML(str);
			}
			return $.core.str.decodeHTML(inner.innerHTML);
		};
		/**
		 * 添加子节点
		 * @method appendChild
		 * @param {Node} node 子节点
		 * @return {Object} this
		 */
		that.appendChild = function(node){
			inner.appendChild(node);
			return that;
		};
		/**
		 * 返回node的iniqueID
		 * @method getIniqueID
		 * @return {String} uniqueID 
		 */
		that.getUniqueID = function(){
			return uniqueID;
		};
		/**
		 * 返回outer
		 * @method getOuter
		 * @return {Node} outer
		 */
		that.getOuter = function(){
			return outer;
		};
		/**
		 * 返回inner
		 * @method getInner
		 * @return {Node} inner
		 */
		that.getInner = function(){
			return inner;
		};
		/**
		 * 返回outer node的父节点
		 * @method getParentNode
		 * @return {Node} outer的父节点 
		 */
		that.getParentNode = function(){
			return outer.parentNode;
		};
		/**
		 * 返回节点node-type列表对象
		 * @method getDomList
		 * @return {Object} 列表对象
		 */
		that.getDomList = function(){
			return dom.list;
		};
		/**
		 * 返回某个node-type对应的节点列表
		 * @method getDomList
		 * @return {Object} 列表对象
		 */
		that.getDomListByKey = function(key){
			return dom.list[key];
		};
		/**
		 * 返回使用node-type="xxx"定义的节点
		 * @method getDom
		 * @param {String} key 节点node-type值
		 * @param {number} index 节点数组的下标 默认为0
		 * @return {Node} 对应的节点
		 */
		that.getDom = function(key, index){
			if(!dom.list[key]){
				return false;
			}
			return dom.list[key][index || 0];
		};
		/**
		 * 返回cascaded节点
		 * @method getCascadeDom
		 * @param {String} key 节点node-type值
		 * @param {number} index 节点数组的下标 默认为0
		 * @return {Node} 对应的cascaded节点
		 */
		that.getCascadeDom = function(key,index){
			if(!dom.list[key]){
				return false;
			}
			return $.core.dom.cascadeNode(dom.list[key][index || 0]);
		};
		return that;
	};
});
