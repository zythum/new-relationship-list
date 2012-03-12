STK.register('common.guide.util.tipLayer', function($) {

	//+++ 常量定义区 ++++++++++++++++++
	/*var TEMPLATE = '<div class="layer_tips" node-type="outer">' +
			'<ul node-type="inner"></ul>' +
			'<span class="arrow_up" node-type="arrow"></span>' +
			'</div>';*/
	var that = {}, getSize = $.core.dom.getSize , canNotShow = 1;
	/**
	 *  获取弹层应在的位置
	 * @param {Element} target 目标元素
	 * @param {Element} self 弹层元素
	 * @param {number|string}   position 方位，上右下左，值为1,2,3,4或者"top", "right", "bottom", "left"
	 * @param {Element} arrowObj 箭头对象
	 */
	that.getLayerPosition = function(target, self, position, arrowObj) {
		var pos = null;
		if (target.style.display == 'none') {
			target.style.visibility = 'hidden';
			target.style.display = '';
			pos = $.position(target);
			target.style.display = 'none';
			target.style.visibility = 'visible';
		}
		else {
			pos = $.position(target);
		}
		var targetSize = getSize(target);
		var selfSize = getSize(self);
		var arrowSize = arrowObj ? getSize(arrowObj) : {width:0,height:0};
		position = position || 1;
		var left , top, arrow = {};
		switch (position) {
			case 1:
			case "top":
				left = pos.l + targetSize.width / 2 - selfSize.width / 2;
				top = pos.t - selfSize.height;
				arrow.className = "arrow_down";
				arrow.left = (selfSize.width - arrowSize.width) / 2 + "px";
				arrow.top = "";
				break;
			case 2:
			case "right":
				left = pos.l + targetSize.width;
				top = pos.t - selfSize.height / 2;
				arrow.className = "arrow_left";
				arrow.left = "";
				arrow.top = (selfSize.height - arrowSize.height) / 2 + "px";
				break;
			case 3:
			case "bottom":
				left = pos.l + targetSize.width / 2 - selfSize.width / 2;
				top = pos.t + targetSize.height;
				arrow.className = "arrow_up";
				arrow.left = (selfSize.width - arrowSize.width) / 2 + "px";
				arrow.top = "";
				break;
			case 4:
			case "left":
				left = pos.l - selfSize.width;
				top = pos.t - selfSize.height / 2;
				arrow.className = "arrow_right";
				arrow.left = "";
				arrow.top = (selfSize.height - arrowSize.height) / 2 + "px";
				break;
		}
		return {
			left : left,
			top : top,
			arrow:arrow
		};
	};
	/**
	 * 设置位置
	 * @param layerObj 浮层对象
	 * @param opts 配置参数
	 */
	that.setPosition = function(layerObj, opts){
		var layerClsArr = [], arrowClsArr = [], val;
		for(var key in opts){
			if(key == "arrow"){
				for (var key2  in opts[key]){
					val = opts[key][key2];
					if(typeof val === "number") val += "px";
					val && arrowClsArr.push(key2 + " : " + val)
				}
			}else{
				val = opts[key];
				if(typeof val === "number") val += "px";
				val && layerClsArr.push(key + " : " + val);
			}
		}
		layerObj.arrow.className = opts.arrow.className;
		layerObj.arrow.style.cssText = arrowClsArr.join(";");
		layerObj.layer.style.cssText = layerClsArr.join(";");
	};

	that.setPositionByOpts = function(posOpts, offsetopts){
		var pos = that.getLayerPosition(posOpts.target, posOpts.layer, posOpts.pos, posOpts.arrow);
		for(var key in offsetopts){
			pos[key] += offsetopts[key];
		}
		that.setPosition(posOpts, pos);
	};
	//-------------------------------------------

	return function() {
		//var dom = $.core.dom.builder(TEMPLATE);


		return that;
	};
});