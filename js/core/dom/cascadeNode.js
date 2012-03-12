/**
 * return a cascaded object for on element
 * @id STK.core.dom.cascadeNode
 * @alias STK.core.dom.cascadeNode
 * @param {Element} node
 * @return {CascadedNode} that = {
		setStyle
		insertAfter
		insertBefore
		addClassName
		removeClassName
		trimNode
		removeNode
		on
		unon
		fire
		appendChild
		removeChild
		toggle
		show
		hide
		scrollTo
		replaceChild
		position
		getPosition
		setPosition
		html
		getHTML
		setHTML
		text
		getText
		setText
		get
		getStyle
		getOriginNode
		destroy
	}
 * @author Robin Young | yonglin@staff.sina.com.cn
 * @example
	var cn = STK.core.dom.cascadeNode($.E('test'));
 */

$Import('core.obj.beget');
$Import('core.dom.setStyle');
$Import('core.dom.insertAfter');
$Import('core.dom.insertBefore');
$Import('core.dom.addClassName');
$Import('core.dom.removeClassName');
$Import('core.dom.trimNode');
$Import('core.dom.removeNode');
$Import('core.evt.addEvent');
$Import('core.evt.removeEvent');
$Import('core.evt.fireEvent');
$Import('core.dom.setXY');
$Import('core.str.encodeHTML');
$Import('core.str.decodeHTML');
$Import('core.dom.getStyle');
STK.register('core.dom.cascadeNode', function($){
	return function(node){
	
		var that = {};
		var display = node.style.display || '';
		display = (display === 'none' ? '' : display);
		
		var eventCache = [];
		
		//method of cascade
		that.setStyle = function(property, value){
			$.core.dom.setStyle(node, property, value);
			if (property === 'display') {
				display = (value === 'none' ? '' : value);
			}
			return that;
		};
		that.insertAfter = function(el){
			$.core.dom.insertAfter(el, node);
			return that;
		};
		that.insertBefore = function(el){
			$.core.dom.insertBefore(el, node);
			return that;
		};
		that.addClassName = function(cn){
			$.core.dom.addClassName(node, cn);
			return that;
		};
		that.removeClassName = function(cn){
			$.core.dom.removeClassName(node, cn);
			return that;
		};
		that.trimNode = function(){
			$.core.dom.trimNode(node);
			return that;
		};
		that.removeNode = function(){
			$.core.dom.removeNode(node);
			return that;
		};
		that.on = function(type, func){
			for(var i = 0, len = eventCache.length; i < len; i += 1){
				if(eventCache[i]['fn'] === func && eventCache[i]['type'] === type){
					return that;
				}
			}
			eventCache.push({'fn':func,'type':type});
			$.core.evt.addEvent(node, type, func);
			return that;
		};
		that.unon = function(type, func){
			for(var i = 0, len = eventCache.length; i < len; i += 1){
				if(eventCache[i]['fn'] === func && eventCache[i]['type'] === type){
					$.core.evt.removeEvent(node, func, type);
					eventCache.splice(i,1);
					break;
				}
			}
			return that;
		};
		that.fire = function(type){
			$.core.evt.fireEvent(type, node);
			return that;
		};
		that.appendChild = function(el){
			node.appendChild(el);
			return that;
		};
		that.removeChild = function(el){
			node.removeChild(el);
			return that;
		};
		that.toggle = function(){
			if (node.style.display === 'none') {
				node.style.display = display;
			}
			else {
				node.style.display = 'none';
			}
			return that;
		};
		that.show = function(){
			if (node.style.display === 'none') {
				if (display === 'none') {
					node.style.display = '';
				}
				else {
					node.style.display = display;
				}
			}
			return that;
		};
		that.hidd = function(){
			if (node.style.display !== 'none') {
				node.style.display = 'none';
			}
			return that;
		};
		that.hide = that.hidd;
		that.scrollTo = function(type, value){
			if (type === 'left') {
				node.scrollLeft = value;
			}
			if (type === 'top') {
				node.scrollTop = value;
			}
			return that;
		};
		that.replaceChild = function(newNode, oldNode){
			node.replaceChild(newNode, oldNode);
			return that;
		};
		
		
		//gands:get and set
		that.position = function(args){
			if (args !== undefined) {
				$.core.dom.setXY(node, args);
			}
			return $.core.dom.position(node);
		};
		
		that.setPosition = function(args){
			if (args !== undefined) {
				$.core.dom.setXY(node, args);
			}
			return that;
		};
		
		that.getPosition = function(args){
			return $.core.dom.position(node);
		};
		
		that.html = function(html){
			if (html !== undefined) {
				node.innerHTML = html;
			}
			return node.innerHTML;
		};
		
		that.setHTML = function(html){
			if (html !== undefined) {
				node.innerHTML = html;
			}
			return that;
		};
		
		that.getHTML = function(){
			return node.innerHTML;
		};
		
		that.text = function(text){
			if (text !== undefined) {
				node.innerHTML = $.core.str.encodeHTML(text);
			}
			return $.core.str.decodeHTML(node.innerHTML);
		};
		
		that.ttext = that.text;
		
		that.setText = function(text){
			if (text !== undefined) {
				node.innerHTML = $.core.str.encodeHTML(text);
			}
			return that;
		};
		
		that.getText = function(){
			return $.core.str.decodeHTML(node.innerHTML);
		};
		
		//getter
		that.get = function(key){
			if (key === 'node') {
				return node;
			}
			return $.core.dom.getStyle(node, key);
		};
		
		that.getStyle = function(key){
			return $.core.dom.getStyle(node, key);
		};
		
		that.getOriginNode = function(){
			return node;
		};
		
		that.destroy = function(){
			for(var i = 0, len = eventCache; i < len; i += 1){
				$.core.evt.removeEvent(node, eventCache[i]['fn'], eventCache[i]['type']);
			}
			display = null;
			eventCache = null;
			node = null;
		};
		return that;
	};
});
