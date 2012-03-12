/**
 * 2012年1月30日 加入与其他模块交互支持
 * 
 * 使用channel(versionTip)进行解决，action-type="callBack"的节点点击时会广播出去一个消息(callBack)，连带callBackId，其它模块根据自身ID进行认领
 */
$Import("kit.dom.parseDOM");
$Import("common.guide.util.tipLayer");
$Import("common.channel.versionTip");
STK.register('common.guide.util.tipManager' , function($) {
    return function(node , showOnce , funArr , opts , transOpt) {
        var that = {};
		if(!$.isNode(node)) {
			return that;			
		}
		var index;
		var nodes = $.kit.dom.parseDOM($.builder(node).list);
        if($.isNode(nodes.items))
        {
                var tempdom = nodes.items;
                nodes.items = [];
                nodes.items.push(tempdom);
        }
         if($.isNode(nodes.arrow))
        {
                var temparrow = nodes.arrow;
                nodes.arrow = [];
                nodes.arrow.push(temparrow);
        }
		var guide = $.common.guide.util.tipLayer();
		var delegate;
		var timer;
		var isIe6 = $.core.util.browser.IE6;
		var lock;
		var clickType , href;

		 var clearInter = function() {
			timer && clearInterval(timer);
		};
		var setPosition = function(node , value) {
			if(isIe6) {
				node.style.position = 'absolute';
			} else {
				node.style.position = value;
			}
		};
		
		//获得要显示的那个层
		var findLayer = function() {
			if (index === undefined) {
				if(nodes.items) {
				for(var i = 0 , len = nodes.items.length ; i < len ; i++) {

					if($.getStyle(nodes.items[i] , 'display') != 'none') {
						index = i;
						break;						
					}					
				}
				}
			} else {
				index++;				
			}
			if(index !== undefined && index < nodes.items.length) {
				return nodes.items[index];					
			} else {
				return undefined;
			}
		};
		
		var currentLayer = findLayer();
		
		if(currentLayer === undefined) {
			return;			
		}
		var findArrow = function() {

			return nodes.arrow[index];			
		};
		
		//获得根据某个节点定位的元素
		var findTarget = function() {
			return funArr[index]();				
		};
		
		var currentArrow = findArrow();

		var getNum = function(str) {
			return parseInt(str , 10) || 0;
		};
						
		var showTip = function() {
			try {
				var pos = guide.getLayerPosition(findTarget(), currentLayer, opts[index].pos , currentArrow);
				var type = opts[index].position;
				if(type == 'fixed' && !isIe6) {
					pos.top -= $.scrollPos().top;	
				}
				if(typeof opts[index].style === 'object') {
					var map = opts[index].style;
					for(var key in map) {
						pos[key] = map[key];
					}
				}
				if(opts[index].offset) {
					var offset = opts[index].offset;
					if(offset.arrow) {
						for(var key in offset.arrow) {
							var num = parseInt(pos.arrow[key]);
							if(isNaN(num)) {
								num = getNum($.getStyle(currentArrow, key));
							} 
							num += offset.arrow[key];
							pos.arrow[key] = num + 'px';
						}
					}
					if(offset.target) {
						for(var key in offset.target) {
							var num = pos[key];
							num += offset.target[key];
							pos[key] = num;
						}
					}
				}
				guide.setPosition({layer:currentLayer, arrow:currentArrow}, pos);
				setPosition(currentLayer , opts[index].position);
				currentLayer.style.visibility = 'visible';
			} catch(e) {
				clearInter();
				if(currentLayer) {
					currentLayer.style.display = 'none';
				}
			}
		};

		var showNext = function() {
			currentLayer = findLayer();
			if(currentLayer !== undefined) {
				currentArrow = findArrow();
				scrollToTarget(showTip);
				bindInterval();
			} else {
				clearInter();				
			}
		};


		var interSuccess = function() {
			if(clickType && clickType == "link") {
				window.location.href = href;
				return;
			}
			lock = 0;
			if(!showOnce) {
				showNext();					
			} else {
				clearInter();				
			}
		};
		
		var interError = function() {
			lock = 0;
			clearInter();
		};

		var trans = transOpt.pointer.getTrans(transOpt.name , {
			onSuccess : interSuccess,
			onError : interError,
			onFail : interError,
			onTimeout : interError
		});

		var scrollToTarget = function(callback) {
			if(typeof opts[index].judge === 'function') {
				var result = opts[index].judge();
				if(result) {
					showNext();
				}
			}
			typeof callback === 'function' && callback();
			/*
			if(isIe6 || opts[index].position == 'absolute') {
				var target = findTarget();
				//height width
				var targetSize = $.core.dom.getSize(target);
				//l t 
				var pos = $.position(target);
				//top left
				var scrollTop = $.scrollPos();
				//height width
				var winSize = $.winSize();
				//算一下位置，看得见的话不滚动
				if(pos.t < scrollTop.top || (pos.t + targetSize.height) > (scrollTop.top + winSize.height)) {
					$.scrollTo(target , {
						top : 150,
						setp : 1,
						onMoveStop : callback
					});							
				} else {
					typeof callback === 'function' && callback();					
				}
			} else {
				typeof callback === 'function' && callback();
			}
			*/
		};		

		$.Ready(function() {
			scrollToTarget(showTip);
		});
				
		var iKnow = function(obj) {
			if(lock) {
				return;
			}
			clickType = obj.data.type;
			href = obj.el.href;
			currentLayer.style.display = 'none';
			clearInter();
			lock = 1;
			trans.request(obj.data);
			return $.preventDefault(obj.evt);
		};
		/**
		 * 进行第三方模块交互的时候绑定的函数
		 * (1)action-data上如果有prevent=1，则会执行preventDefault
		 * (2)action-data上需要填写callBackId，广播出去的时候会带着这个ID，让其他模块进行认领
		 */
		var custCallback = function(obj) {
			var datas = obj.data;
			if(datas && datas.prevent) {
				$.preventDefault(obj.evt);
			}
			if(datas && datas.callBackId) {
				$.common.channel.versionTip.fire("callBack", {callBackId : datas.callBackId});	
			}
		};

		var bindDOMFuns = function() {
			delegate = $.delegatedEvent(node);
			delegate.add("iKnow" , "click" , iKnow);
			/**
			 * action-type为callBack的点击时会广播一个callBack的频道，通知其他模块进行交互
			 */
			delegate.add("callBack" , "click" , custCallback);
		}

		bindDOMFuns();
		var bindInterval = function() {
			timer = setInterval(showTip , 1000);
		};

		bindInterval();
		var destroy = function(){
            delegate && delegate.destroy();
			clearInter();
		};
        that.destroy = destroy;
        return that;
	};

});
