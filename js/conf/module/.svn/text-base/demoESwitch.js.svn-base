
/**
 * 电器开关模块
 * 对开和关两个按钮时行封装 初始状态为关闭
 * 在用户点击按钮或调用开关方法时抛出开/关事件
 *
 * @id STK.module.demoESwitch
 * @param {Node} node
 * 	模块使用到的节点的最外节点
 * 	需确保node节点包含属性node-type="open" 和 node-type="close"的节点
 * @param {Object} status
 * {
 * 	status:'off'//状态初始状态 on 开 off关
 * }
 * @return {Object} 实例
 * @example
 * var a = STK.module.demoESwitch(STK.E("test"));
 *
 * var k = STK.core.evt.custEvent.add(a, "on", function() {
 * 	console.log("打开了");
 * });
 *
 * STK.core.evt.custEvent.add(k, "off", function() {
 * 	console.log("关闭了");
 * });
 *
 * a.open();
 * a.close();
 *
 */
STK.register("module.demoESwitch", function($){

	return function(node, options){
		options = $.core.obj.parseParam({
			status: 'off'
		}, options);
		
		var that = {};
		var _open = $.core.dom.sizzle('[node-type="open"]', node)[0];
		var _close = $.core.dom.sizzle('[node-type="close"]', node)[0];
		if (!_open || !_close) {
			return;
		}
		/**
		 * 开关状态
		 * @property _on
		 * @type {boolean}
		 */
		var _on = false
		/**
		 * custEvent的key
		 * @property _custEKey
		 * @type {number}
		 */
		var _custEKey = $.core.evt.custEvent.define(that, "on");
		$.core.evt.custEvent.define(_custEKey, "off");
		_close.style.display = "none";
		_open.style.display = "none";
		
		if (options.status == "on") {//
			_close.style.display = "block";
		}
		else {
			_open.style.display = "block";
		}
		/**
		 * 打开或接通电源
		 * @method open
		 *
		 */
		that.open = function(){
			_on = true;
			_open.style.display = "none";
			_close.style.display = "block";
			$.core.util.log('ESwitch on fire');
			$.core.evt.custEvent.fire(_custEKey, "on");
		};
		/**
		 * 关闭或断开电源
		 * @method close
		 *
		 */
		that.close = function(){
			_on = false;
			_open.style.display = "block";
			_close.style.display = "none";
			$.core.util.log('ESwitch off fire');
			$.core.evt.custEvent.fire(_custEKey, "off");
		};
		/**
		 * 是否为打开状态 或是否接通了电源
		 * @method isOn
		 * @return {boolean} true 打开 false 关闭
		 */
		that.isOn = function(){
			return _on;
		};
		that.destroy = function(){
			$.core.evt.custEvent.undefine(_custEKey);
		};
		
		$.core.evt.addEvent(_open, "click", that.open);
		$.core.evt.addEvent(_close, "click", that.close);
		return that;
	}
	
});
