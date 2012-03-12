$Import('kit.dom.parents');
$Import('common.trans.profile');
STK.register('comp.profile.gameMayInterest' , function($) {
	return function(node) {
		var nodes , that = {} , instArr , instArrCopy , trans = $.common.trans.profile , eventName , deleObj , idArr;
		var parseDOM = function() {
			nodes = $.kit.dom.parseDOM($.builder(node).list);
			custFuncs.getCurrentIds();
		};
		var ioFuns = {
			onSuccess : function(data) {
				instArr = data.data;
				custFuncs.buildDomArr();
				if(eventName == 'click') {
					custFuncs.changeOneGroup();
				}
			},
			onError : function() {}
		};
		var bindTrans = function() {
			trans = trans.getTrans('gameInterest' , {
				onSuccess : ioFuns.onSuccess,
				onError : ioFuns.onError,
				onFail : ioFuns.onError,
				onTimeout : ioFuns.onError
			});
		};
		var custFuncs = {
			getCurrentIds : function(frag) {
				var $content;
				if(frag) {
					$content = frag;					
				} else {
					$content = nodes.interestContent;						
				}
				var currentArr = $.sizzle("[node-type='item']" , $content);
				idArr = {};
				if(currentArr && currentArr.length) {
					for(var i = 0 ; i < currentArr.length ; i++) {
						var gid = custFuncs.getGid(currentArr[i]);
						idArr[gid] = 1;
					}
				}
			} ,
			showPanel : function(el , endFun){
				var setStyle = $.core.dom.setStyle;
				el.style.cssText = '';
				setStyle(el, 'opacity', 0);
				setStyle(el, 'display', '');
				var opa = 0,
				bas = 10,
				g = 1.5,
				time = 50,
				interval = null;
				var interFunc = function(){
					bas *= g;
					opa += bas;
					if (opa >= 100){
						clearInterval(interval);
						typeof endFun == 'function' && endFun();
						setStyle(el, 'opacity', 1);
					}
					else{
						setStyle(el, 'opacity', opa / 100);
					}
				};
				interval = setInterval(interFunc, time);
			},
			getGid : function(node) {
				var param = node.getAttribute("action-data");
				var gid = param.match(/\d+/);
				if(gid && gid[0]) {
					return gid[0];
				} else {
					return 0;
				}
			},
			buildDomArr : function() {
				var frag = $.C("div");
				frag.innerHTML = instArr;
				var arr = $.sizzle('[node-type="item"]' , frag);
				frag = null;
				instArr = arr;
				instArrCopy = instArr.concat([]);
			},
			getInterest : function() {
				$.removeEvent(node , 'mouseover' , custFuncs.getInterest);
				eventName = 'mouseover';
				!instArr && trans.request();	
			},
			changeGame : function() {
				if(instArr) {
					custFuncs.changeOneGroup();
				} else {
					eventName = 'click';
				}
			},
			removeRepeat : function() {
				for(var i = instArr.length - 1 ; i >= 0 ; i--) {
					var gid = custFuncs.getGid(instArr[i]);
					if(idArr[gid]) {
						var slice = instArr.splice(i , 1);
					}												
				}
			},
			changeOneGroup : function() {
				if(!instArr || !instArr.length) {
					return;					
				}
				var $content = nodes.interestContent;
				//去除掉重复的数据
				custFuncs.removeRepeat();
				//如果数据少于3条，则从头开始
				if(instArr.length < 3) {
					instArr = instArrCopy.concat([]);
					//不需要继续拍重了。
				}
				//从这里开始能够保证取出3个来了
				var slice = instArr.slice(0 , 3);
				var frag = $.C('div');
				for(var i = 0 ; i < slice.length ; i++) {
					frag.appendChild(slice[i]);
				}
				var endFun = function() {
					var items = $.sizzle("[node-type='item']" , frag);
					for(var i = 0 ; i < items.length ; i++) {
						var tip = $.sizzle("[node-type='layerTips']" , items[i]);
						if(tip.length) {
							if(i == 0) {
								tip[0].style.display = '';														
							} else {
								tip[0].style.display = 'none';							
							}										
						}
					}
					$content.innerHTML = frag.innerHTML;
				};
				custFuncs.showPanel($content , endFun);
				custFuncs.getCurrentIds(frag);
			},
			toggleTips : function(opts) {
				var el = opts.el;
				var items = $.kit.dom.parents(el , {
					expr : "[node-type='item']"
				});
				if(items.length) {
					var tips = $.sizzle('[node-type="layerTips"]' , items[0]);
					if(tips.length) {
						tips = tips[0];
						var isShow = tips.style.display != 'none';
						tips.style.display = isShow ? 'none' : '';
					}
				}
				$.preventDefault(opts.evt);
			}
		};
		var bindDOM = function() {
			if(!nodes.changeGame) {
				return;
			}
			$.addEvent(node, 'mouseover' , custFuncs.getInterest);
			$.addEvent(nodes.changeGame , 'click' , custFuncs.changeGame);
			deleObj = $.delegatedEvent(node);
			deleObj.add("toggleTips" , "click" , custFuncs.toggleTips);
		};
		var init = function() {
			parseDOM();
			bindTrans();
			bindDOM();
		};
		var destroy = function() {
			if(!nodes.changeGame) {
				return;				
			}
		};
		init();
		that.destroy = destroy;
		return that;
	};
});