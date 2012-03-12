/**
 * tip原型
 */
$Import('module.layer');

STK.register('ui.tipPrototype', function($) {
	var zIndex = 10003;
	return function(spec) {
		var conf,tipPrototype,box,content,tipWH;
		var template = '<div node-type="outer" style="position: absolute; clear: both; display:none;overflow:hidden;z-index:10003;" >' +
				'<div node-type="inner" ></div>' +
				'</div>';

		conf = $.parseParam({
			direct:"up",
			showCallback:$.core.func.empty,
			hideCallback:$.core.func.empty
		}, spec);
		tipPrototype = $.module.layer(template, conf);

		box = tipPrototype.getOuter();       //外框
		content = tipPrototype.getInner();      //内容区域

		tipPrototype.setTipWH=function(){
			tipWH = this.getSize(true);    //重新获取宽高
			this.tipWidth = tipWH.w;
			this.tipHeight = tipWH.h;
			return this;
		};

//		tipWH = tipPrototype.getSize(true);    //获取宽高
//		this.tipWidth = tipWH.w;
//		this.tipHeight = tipWH.h;
		tipPrototype.setTipWH();

		/**
		 * 设置tip的内容
		 * @param cont   内容
		 */
		tipPrototype.setContent = function(cont) {
			if (typeof cont == 'string') {
				content.innerHTML = cont;
			} else {
				content.appendChild(cont);
			}
//			var tipWH = this.getSize(true);    //重新获取宽高
//			this.tipWidth = tipWH.w;
//			this.tipHeight = tipWH.h;
			this.setTipWH();
			return this;
		};


		/**
		 *  设置初始位置
		 * @param pNode  参照节点，根据该节点的中间位置居中对齐
		 */
		tipPrototype.setLayerXY = function (pNode) {
			if (!pNode) {
				throw 'ui.tipPrototype need pNode as first parameter to set tip position';
			}
			var pNodePosition = STK.core.dom.position(pNode);       //参照节点的位置
			var pNodePositionLeft = pNodePosition.l;

			var pNodeWidth = pNode.offsetWidth;           //参照节点的宽
			var pNodeHeight = pNode.offsetHeight;


			var tipPositionLeft = Math.min(Math.max((pNodePositionLeft + (pNodeWidth - this.tipWidth) / 2), $.scrollPos().left), ($.scrollPos().left + STK.winSize().width) - this.tipWidth);             //tip初始位置
			var tipPositionTop = pNodePosition.t;
			if (conf.direct === 'down') {
				tipPositionTop += pNodeHeight;
			}

		   //todo 改成核心包中的方法实现
//			var arr = [];
			var arr = [";"];       //ie 6,7,8      box.style.cssText会把最后的分号去掉，cao！
			arr.push("z-index:", (zIndex++), ";");
			arr.push("width:", this.tipWidth, "px;");
			arr.push("height:", this.tipHeight, "px;");
			arr.push("top:", tipPositionTop, "px;");
			arr.push("left:", tipPositionLeft, "px;");
			box.style.cssText += arr.join("");             //设置外框的样式
		};

		/**
		 * 动画效果展现
		 */
		tipPrototype.aniShow = function() {
			var outer = this.getOuter();
			outer.style.height = "0px";
			outer.style.display = "";
			
			var ani = $.core.ani.tween(outer,{
				'end': conf.showCallback,
				'duration': 250,
				'animationType': 'easeoutcubic'
			});
			if (conf.direct === 'down') {
				ani.play({ 'height' : this.tipHeight },{
					'staticStyle' : 'overflow:hidden;position:absolute;'
				});
			} else {
				var top = (parseInt(outer.style.top, 10) - this.tipHeight);
				ani.play({
						'height' : this.tipHeight,
						'top' : Math.max(top,$.scrollPos().top)
					},{
					'staticStyle' : 'overflow:hidden;position:absolute;'
				});
			}
		};
		/**
		 * 动画效果隐藏
		 */
		tipPrototype.anihide = function() {
			var outer = this.getOuter();
			var _this = this;
			var ani = $.core.ani.tween(outer,{
				'end': function(){
					outer.style.display= "none";
					outer.style.height = _this.tipHeight+"px";
					conf.hideCallback();
				},
				'duration': 300,
				'animationType': 'easeoutcubic'
			});
			if (conf.direct === 'down') {
				ani.play({ 'height' : 0 }, {
					'staticStyle' : 'overflow:hidden;position:absolute;'
				});
			} else {
				var top = (parseInt(outer.style.top, 10) + this.tipHeight);
				ani.play({
						'height' : 0,
						'top' : top
					},{
					'staticStyle' : 'overflow:hidden;position:absolute;'
				});
			}
		};

		document.body.appendChild(box);

		/**
		 * 销毁方法
		 */
		tipPrototype.destroy = function() {
			document.body.removeChild(box);
			tipPrototype = null;
		};
		return tipPrototype;
	};
});
