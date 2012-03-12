//1) 8点定位(每边2点)
//2) 解析a链接,拦截请求,先发一个带自定义参数的jsonp接口,关闭层,打开新链接;提供回调函数
//3) 每1s重新定位;参照节点有fixed祖先节点时可不重新定位
$Import('kit.io.ajax');
$Import('ui.tipsBubble');
STK.register('ui.bubbleBox', function($){
	var OFFSET				= 5,
		ARROW_OFFSET_HEIGHT	= 30,//箭头高度偏移量
		ARROW_OFFSET_WIDTH	= 30;//箭头宽度偏移量
		
	/**
	 * @param {HTMLElement} node 		: 相对定位的dom节点
	 * @param {String} url 				: jsonp请求的地址
	 * @param {String} dir 				: tr, tl, br,bl,lt,lb,rt,rb 8个位置
	 * @param {Funtion} onComplete 		: 请求成功回调
	 * @param {Funtion} onTimeout 		: 请求超时回调
	 * */
	function BubbleBox(config){
		this.node = config['node'];
		this.url = config['url'];
		this.dir = config['dir'];
		this.arrow = config['arrow'] || 'auto';
		this.order = config['order'] || 'b,r,t,l';
		this.onComplete = config['onComplete'];
		this.onTimeout = config['onTimeout'];
		this.bubLayer = $.ui.tipsBubble();
		this.cardPanel	= this.bubLayer.getOuter();
	};
	
	BubbleBox.prototype = {
		_initBindDom: function(){
			if(this._parsed){ return; }
			var clsBtn = this.bubLayer.getDom('closeBtn'), me = this;
			var _click = function(e){
				$.core.evt.preventDefault(e);
				var el = $.fixEvent(e).target, data;
				while(el && el !== me.cardPanel){
					if(el.tagName.toLowerCase() === 'a'){
						data = el.getAttribute('action-data');
						el.href.match(/^\s*javascript\s*:/i) || window.open(el.href);
						return me._request({
							'url': me.url,
							'callback': function(){
								me.hide();
								me.onComplete && me.onComplete();
							},
							'data': $.queryToJson(data || '')
						});
					}
					el = el.parentNode;
				}
				
			};
			
			$.addEvent(this.cardPanel, 'click', _click);
			this._parsed = true;
		},
		
		_request:function(params){
			var me = this;
			$.kit.io.ajax({
				url: params.url,
				onComplete: params.callback
			}).request(params.data);
		},
		
		rePosition:function(){
			var pNode = this.node, isFixed = false;
			while( pNode != document){
				if ($.getStyle(pNode, 'position') !== 'fixed') {
					pNode = pNode.parentNode;
				} else {
					isFixed = true;
					break;
				}
			}
			if (isFixed) {
				this.cardPanel.style.position = 'fixed';
				return;
			}
			var me = this;
			clearInterval(this.timer);
			this.timer = setInterval(function(){
				me.position();
			}, 1000);
		},
		
		
		/**
		 * @param{Object} such as {'content':sHTML,'node':oRefNode}
		 * */
		show: function(spec){
			this.spec = spec;
			this.cardPanel.style.zIndex = spec['zIndex'] || 999;
			this.bubLayer.setContent(spec.content, spec.hasClose).show();
			this.node = this.node || spec['node'];
			this._initBindDom();
			this.position();
			this.rePosition();
			return this;
		},
		/**
		 * @param{String}content
		 * */
		setContent: function(content, hasClose){
			this.bubLayer.setContent(content, hasClose);
			return this;
		},
		hide: function(){
			this.bubLayer.hide();
			return this;
		},
		position:function(){
			var scrPos = $.core.util.scrollPos(),
				pos = $.core.dom.position(this.node), 
				box = this.bubLayer.getOuter(), 
				arrowDom = this.bubLayer.getDom('arrow'),
				refNodeHeight = Math.max(this.node.clientHeight,this.node.offsetHeight),
				refNodeWidth = Math.max(this.node.clientWidth,this.node.offsetWidth),
				boxWidth = Math.max(box.clientWidth,box.offsetWidth),
				boxHeight = Math.max(box.clientHeight,box.offsetHeight),
				arrowHeight = Math.max(arrowDom.clientHeight,arrowDom.offsetHeight),
				arrowWidth = Math.max(arrowDom.clientWidth,arrowDom.offsetWidth),
				offsetX =  this.spec['offsetX'],
				offsetY =  this.spec['offsetY'],
				arrowClass = 'arrow_up';
			switch(this.dir){
//				case 'tr':
//					pos.t = pos.t + refNodeHeight + arrowHeight ;
//					pos.l = pos.l - boxWidth + ARROW_OFFSET_WIDTH + refNodeWidth/2 ;
//					var left = boxWidth - ARROW_OFFSET_WIDTH - ARROW_WIDTH/2;
//					this.bubLayer.setPosition(pos).setArrow({'className': 'arrow_up', 'style': 'left:'+left+'px;'});
//					break;
//				case 'br':
//					pos.t = pos.t  - boxHeight - arrowHeight ;
//					pos.l = pos.l - (boxWidth  -  refNodeWidth/2 ) + ARROW_OFFSET_WIDTH;
//					this.bubLayer.setPosition(pos).setArrow({'className': 'arrow_down'});
//					break;
				case 'bl':
					pos.t = pos.t  - boxHeight - arrowHeight;
					pos.l = pos.l +  refNodeWidth/2  - ARROW_OFFSET_WIDTH;
					arrowClass = 'arrow_down';
					break;
				case 'rt':
					pos.t = pos.t  + refNodeHeight/2 - ARROW_OFFSET_HEIGHT ;
					pos.l = pos.l -  boxWidth - arrowHeight;
					arrowClass = 'arrow_right';
					break;
//				case 'rb':
//					pos.t = pos.t  - boxHeight + refNodeHeight/2 + ARROW_OFFSET_HEIGHT ;
//					pos.l = pos.l -  boxWidth ;
//					this.bubLayer.setPosition(pos).setArrow({'className': 'arrow_right'});
//					break;
				case 'lt':
					pos.t = pos.t  + refNodeHeight/2 - ARROW_OFFSET_HEIGHT ;
					pos.l = pos.l + refNodeWidth + arrowHeight;
					arrowClass = 'arrow_left';
					break;
//				case 'lb':
//					pos.t = pos.t  - boxHeight +  refNodeHeight/2 + ARROW_OFFSET_HEIGHT;
//					pos.l = pos.l + refNodeWidth;
//					this.bubLayer.setPosition(pos).setArrow({'className': 'arrow_left'});
//					break;
				default:
				case 'tl':
					pos.t = pos.t + refNodeHeight + arrowHeight;
					pos.l = pos.l + refNodeWidth/2 - ARROW_OFFSET_WIDTH;
					arrowClass = 'arrow_up';
					break;
			}
			this.bubLayer.setPosition({
				'l': pos.l + (isNaN(offsetX) ? 0 : offsetX),
				't': pos.t + (isNaN(offsetY) ? 0 : offsetY)
			}).setArrow({'className': arrowClass});
		}
	};
	
	return BubbleBox;
});
