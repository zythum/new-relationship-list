/**
 * 遮罩工具
 * @id STK.core.util.mask
 * @author Finrila|wangzheng4@staff.sina.com.cn
 * @example 
 * STK.core.util.mask.show()
 * STK.core.util.mask.showUnderNode(node)
 * STK.core.util.mask.hide()
 */

$Import('kit.dom.fix');

STK.register("module.mask", function($) {
	var maskNode,
		nodeRegList = [],
		domFix,
		maskInBody = false,
		maskNodeKey = "STK-Mask-Key";
	
	var setStyle = $.core.dom.setStyle,
		getStyle = $.core.dom.getStyle,
		custEvent = $.core.evt.custEvent;
	
	//初始化遮罩容器
	function initMask() {
		maskNode = $.C("div");
		var _html = '<div node-type="outer">'
		if ($.core.util.browser.IE6) {
			//'<iframe style="position:absolute;z-index:-1;width:100%;height:100%;filter:mask();"></iframe>'+
			_html += '<div style="position:absolute;width:100%;height:100%;"></div>';
		}
		_html += '</div>';
		maskNode = $.builder(_html).list["outer"][0];
		document.body.appendChild(maskNode);
		maskInBody = true;
		domFix = $.kit.dom.fix(maskNode, "lt");
		var _beforeFixFn = function () {
			var _winSize = $.core.util.winSize();
			maskNode.style.cssText = $.kit.dom.cssText(maskNode.style.cssText)
					.push("width", _winSize.width + "px")
					.push("height", _winSize.height + "px").getCss();
		};
		custEvent.add(domFix, "beforeFix", _beforeFixFn);
		_beforeFixFn();
	}
	
	function getNodeMaskReg(node) {
		var keyValue;
		if(!(keyValue = node.getAttribute(maskNodeKey))) {
			node.setAttribute(maskNodeKey, keyValue = $.getUniqueKey());
		}
		return '>'+node.tagName.toLowerCase() + '['+maskNodeKey+'="'+keyValue+'"]';
	}
	
	var that = {
		
		getNode: function() {
			return maskNode;
		},
		/**
		 * 显示遮罩
		 * @method show
		 * @static
		 * @param {Object} option 
		 * {
		 * 	 opacity: 0.5,
		 * 	 background: "#000000"
		 * }
		 */
		show: function(option, cb) {
			if (maskInBody) {
				option = $.core.obj.parseParam({
					opacity: 0.3,
					background: "#000000"
				}, option);
				maskNode.style.background = option.background;
				setStyle(maskNode, "opacity", option.opacity);
				maskNode.style.display = "";
				domFix.setAlign("lt");
				cb && cb();
			} else  {
				
                    
					initMask();
					that.show(option, cb);
                    
				
			}
			return that;
		},
		/**
		 * 隐藏遮罩
		 * @method hide
		 * @static
		 * @param {Node} node 
		 */
		hide: function() {
			maskNode.style.display = "none";
			nowIndex = undefined;
			nodeRegList = [];
			return that;
		},
		/**
		 * 将node显示于遮罩之上
		 * @method showUnderNode
		 * @static
		 * @param {Node} node 
		 * @param {Object} option 
		 * {
		 * 	 opacity: 0.5,
		 * 	 background: "#000000"
		 * }
		 */
		showUnderNode: function(node, option) {
			if ($.isNode(node)) {
				that.show(option, function() {
					setStyle(maskNode, 'zIndex', getStyle(node, 'zIndex'));
					var keyValue = getNodeMaskReg(node);
					var keyIndex = $.core.arr.indexOf(nodeRegList, keyValue);
					if(keyIndex != -1) {
						nodeRegList.splice(keyIndex, 1);
					}
					nodeRegList.push(keyValue);
					$.core.dom.insertElement(node, maskNode, "beforebegin");
				});
			}
			return that;
		},
		back: function() {
			if(nodeRegList.length < 1) {
                return that;
            }
			var node,
				nodeReg;
			nodeRegList.pop();
			if(nodeRegList.length < 1) {
				that.hide();
			} else if((nodeReg = nodeRegList[nodeRegList.length - 1]) && (node = $.sizzle(nodeReg, document.body)[0])) {
				setStyle(maskNode, 'zIndex', getStyle(node, 'zIndex'));
				$.core.dom.insertElement(node, maskNode, "beforebegin");
			} else {
				that.back();
			}
			return that;
		},
		/**
		 * 销毁
		 * @method destroy
		 */
		destroy: function() {
			custEvent.remove(domFix);
			maskNode.style.display = "none";
			lastNode = undefined;
			_cache = {};
		}
	};
	return that;
});
