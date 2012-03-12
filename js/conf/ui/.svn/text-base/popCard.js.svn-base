/**
 * 卡片基础组件
 * @author ZhouJiequn | jiequn@staff.sina.com.cn
 * 
 * 提供了一个可以自动适应屏幕边界的卡片组件
 * 
 * @history
 * ZhouJiequn @2011.05.06	增加设置分组域设置备注
 * ZhouJiequn @2011.05.27	删除设置分组域设置备注，原有功能移至上层组件；
 * 							增加卡片箭头中间位置的支持
 * ZhouJiequn @2011.10.02	修改标签折行后造成名片卡定位错误
 * 							修改常量的命名规范
 */
$Import('ui.bubbleLayer');
$Import('kit.extra.language');
STK.register('ui.popCard', function($){
	var OFFSET				= 5,//名片卡间距偏移量
		ARROW_OFFSET_HEIGHT	= 28,//箭头高度偏移量
		ARROW_OFFSET_WIDTH	= 38,//箭头宽度偏移量
		HIDE_DELAY			= 200,//名片卡隐藏延迟时间
		DEF_CARD_HEIGHT		= 200;//名片卡默认计算高度

	/**
	 * 获取元素距离屏幕四边的距离
	 * @param {Node} node
	 * @param {Number} nodeW node节点的offsetWidth
	 * @param {Number} nodeH node节点的offsetHeight
	 */
	var getDistance = function(node, nodeW, nodeH){
		var l,r,t,b,w,h;
		var sp	= $.core.util.scrollPos(),
			pos	= $.core.dom.position(node),
			win	= $.core.util.winSize();
		w = node.offsetWidth;
		h = node.offsetHeight;
		t = pos.t - sp.top;
		l = pos.l - sp.left;
		r = win.width - l - w;
		b = win.height - t - h;
		return {
			't': t,
			'l': l,
			'r': r,
			'b': b,
			'w': w,
			'h': h,
			'x': pos.l,
			'y': pos.t
		};
	};
	
	/**
	 * 更具箭头位置获得卡片需要显示的坐标
	 * @param {Object} spec
	 */
	var getPositionByArrow = function(spec){
		var width	= spec.nodeW,//当前触发事件的节点的宽度
			height	= spec.nodeH,//当前触发事件的节点的高度
			dis		= spec.dis,//当前触发时间的坐标
			cW		= spec.cardWidth,//card的宽度
			cH		= spec.cardHeight,//card的高度
			arrow	= spec.arrow,//箭头的位置
			node	= spec.node,
			ofH		= spec.offsetH,
			ofW		= spec.offsetW,
			arPos	= spec.arPos,
			pos		= {};
		switch(arrow){
			case 't':
				pos.l = dis['x'] - ofW + width/2;
				pos.t = dis['y'] - OFFSET - cH;
				break;
			case 'r':
				pos.l = dis['x'] + width + OFFSET;
				pos.t = dis['y'] - ofH + height/2;
				break;
			case 'b':
				pos.l = dis['x'] - ofW + width/2;
				pos.t = dis['y'] + height + OFFSET;
				break;
			case 'l'://默认显示在左面
			default :
				pos.l = dis['x'] - cW - OFFSET;
				pos.t = dis['y'] - ofH + height/2;
				break;
		}
		return pos;
	};
	
	/**
	 * 获取箭头需要显示的方向
	 * @param {Node} node 
	 * @param {Number} cW card的宽度
	 * @param {Number} cH card的高度
	 * @param {String} order 优先顺序。例：'l,b,t,r' 为'左,下,上,右'
	 */
	var getDirection = function(spec){
		var node	= spec.node,
			cW		= spec.cardWidth,
			cH		= spec.cardHeight,
			arPos	= spec.arrowPos || 'auto',
			order	= (spec.order || 'b,r,t,l').split(','),
			dire	= order[0],
			maxH	= Math.max(cH, DEF_CARD_HEIGHT),
			hash	= { 'l': cW, 'b': maxH, 't': maxH, 'r': cW },
			map		= { 'l': 'r', 'b': 't', 't': 'b', 'r': 'l' },
			dis		= getDistance(node),
			nodeW	= dis['w'],
			nodeH	= dis['h'],
			offsetH	= ARROW_OFFSET_HEIGHT,//名片卡的高度偏移量
			offsetW	= ARROW_OFFSET_WIDTH,//名片卡的宽度偏移量
			//TextRectangle 对象实例，具体参见MSDN/MDN
			textRg	= node.getClientRects ? node.getClientRects() : null,
			lineH	= parseInt($.getStyle(node, 'lineHeight'), 10),
			evt		= $.fixEvent(spec['event']);
		//当标签折行后的特殊处理(如果浏览器不支持getClientRects函数，则暂时不做处理)
		if (textRg && textRg.length > 1) {
			var temp;
			if (evt.pageX - dis['x'] > nodeW/2) { //鼠标在第一行
				temp = textRg[0];
				dis['x'] = temp['left'];
				dis['l'] += temp['left'] - textRg[1]['left'];
				nodeH = temp['bottom'] - temp['top'];
				nodeW = temp['right'] - temp['left'];
			} else { //鼠标在第二行
				temp = textRg[1];
				dis['y'] += temp['top'] - textRg[0]['top'];
				dis['r'] += textRg[0]['right'] - temp['right'];
				nodeH = temp['bottom'] - temp['top'];
				nodeW = temp['right'] - temp['left'];
			}
		}
		for (var i = 0, len = order.length; i < len; i++) {
			var d = order[i];
			if (dis[d] > hash[d]) {
				dire = d;
				break;
			}
		}
		//如果是自动模式，则根据名片卡距屏幕实际距离计算出名片卡的定位
		if (arPos === 'auto') {
			if ((dire === 't' || dire === 'b')
					&& nodeW / 2 + dis['r'] < cW - ARROW_OFFSET_WIDTH) {
				arPos = 'right';
			} else if (nodeH / 2 + dis['b'] < cH - ARROW_OFFSET_HEIGHT) {
				arPos = 'bottom';
			}
		}
		
		if (arPos === 'right') {
			offsetW = cW - ARROW_OFFSET_WIDTH;
		} else if (arPos === 'bottom') {
			offsetH = cH - ARROW_OFFSET_HEIGHT;
		} else if (arPos === 'center') {
			offsetW = cW/2;
		}
		
		//根据显示方向确定card显示坐标
		var pos = getPositionByArrow({
			'nodeW'		: nodeW,
			'nodeH'		: nodeH,
			'dis'		: dis,
			'cardWidth'	: cW,
			'cardHeight': cH,
			'arrow'		: dire,
			'node'		: node,
			'offsetH'	: offsetH,
			'offsetW'	: offsetW
		});
		return {
			'dire'	: map[dire],
			'pos'	: pos,
			'arPos'	: arPos
		};
	};
	
	/**
	 * 改变函数调用对象
	 * @param {Function} fun 需要绑定作用域的函数
	 * @param {Object} ns 需要绑定的作用域
	 */
	var binds = function(fun, ns){
		return function(){
			return fun.apply(ns, arguments);
		};
	};
	
	var UserCard = function(){
		this.bubLayer	= $.ui.bubbleLayer();
		this.cardPanel	= this.bubLayer.getOuter();
		this.initBind();
	};
	
	UserCard.prototype = {
		initBind: function(){
			var stopHideHandler = binds(this.stopHide, this);
			var hideCardHandler = binds(this.hideCard, this);
			
			$.addEvent(this.cardPanel, 'mouseover', stopHideHandler);
			$.addEvent(this.cardPanel, 'mouseout', hideCardHandler);
			
			this.dEvent = $.core.evt.delegatedEvent(this.cardPanel);
		},
		
		stopShow: function(){
			this.showTimer && clearTimeout(this.showTimer);
		},
		
		stopHide: function(){
			this.hideTimer && clearTimeout(this.hideTimer);
		},
		
		showCard: function(spec){
			var zIndex = spec['zIndex'] || 9999;
			this.cardPanel.style.zIndex = zIndex;
			this.bubLayer.setContent(spec.content).show();
			this.node = spec['node'];
			this.arrowPos = spec['arrowPos'];
			this.order = spec['order'];
			this.direPos	= getDirection({
				'node'		: this.node,
				'cardWidth'	: this.cardPanel.offsetWidth,
				'cardHeight': this.cardPanel.offsetHeight,
				'arrowPos'	: this.arrowPos,
				'order'		: this.order,
				'event'		: spec['event']
			});
			this.bubLayer.setPostion(this.direPos.pos).setArrow(this.direPos.dire, this.direPos.arPos);
		},
		
		setContent: function(content){
			var oldHeight = this.cardPanel.offsetHeight;
			this.bubLayer.setContent(content);
			if (this.direPos.dire === 'b') {
				//目前名片卡的宽度暂时是固定的，所以不考虑宽度的变化
				var dH = this.cardPanel.offsetHeight - oldHeight;
				this.bubLayer.setPostion({
					'l': this.direPos.pos.l,
					't': this.direPos.pos.t - dH
				});
			}
		},
		
		hideCard: function(){
			var _this = this;
			this.hideTimer = setTimeout(function(){
				_this.bubLayer.hide();
			}, HIDE_DELAY);
		}
	};
	return function(){
		return new UserCard();
	};
});