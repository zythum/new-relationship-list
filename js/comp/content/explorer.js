STK.register('comp.content.explorer', function($){
	return function(node){
		var that = {};
		var selectedList = [];
		var list = [];
		var tempNodeList = [];
		var lastSelecting = null;
		var isShiftPress = false;
		// var isCtrlPress = false;
		var dragRct = $.C('div');
		var notice = $.C('div');
		var dragRctPos = {top:null,left:null};
		var dragRctFlag = false;
		var dragItemFlag = false;
		var isAnimating = false;
		var dragItemMousePosPre = {top:null,left:null};
		var dragItemPosPreList = [];
		var dragItemIndex = 10;
		var dragItemTimer;

		var isClone = false;

		var aniCssNormal = ';-webkit-transition:background-color 0.5s ease;-moz-transition:background-color 0.5s ease;-o-transition:background-color 0.5s ease;transition:background-color 0.5s ease;';
		var aniCssTopLeft = ';-webkit-transition:top 0.3s ease,left 0.3s ease,-webkit-transform 0.3s ease;-moz-transition:top 0.3s ease,left 0.3s ease, -moz-transform 0.3s ease;-o-transition:top 0.3s ease,left 0.3s ease, -o-transform 0.3s ease;transition:top 0.3s ease,left 0.3s ease,transform 0.3s ease;';

		$.addClassName(dragRct,'explorer-drag');
		$.addClassName(notice,'explorer-notice');

		var nodeClone = function(node){
			var objClone = $.C(node.tagName.toLowerCase());
			objClone.innerHTML = node.innerHTML;
			objClone.className = node.className;
			objClone.setAttribute('node-type',node.getAttribute('node-type'));
			objClone.setAttribute('action-type',node.getAttribute('action-type'));
			return objClone; 
		}

		var load = function(){
			var myList = $.sizzle('[node-type=explorer-item]',node);
			lastSelecting = null;
			selectedList = [];
			list = [];
			for(var i=0; i < myList.length ;i++){
				list[i] = {
					index:i,
					DOM:myList[i]
				};
				list[i]['DOM']&&list[i]['DOM'].setAttribute('explorer-index',i);
			}
			// if(selectedList[0]){
			// 	lastSelecting = inList(selectedList[0]).index;
			// }
			console.log('myList');
			console.log(myList);
			paint();
			// console.log(list);
			return that;
		};

		var getPointerPos = function(node){
			var pos = $.position(node);
			var xy = $.core.dom.getSize(node);
			return {
				leftTopX : pos.l,
				leftTopY : pos.t,
				rightBottomX : pos.l + xy.width,
				rightBottomY : pos.t + xy.height
			}
		}

		var inDragRect = function(item){
			var itemPointerPos = getPointerPos(item);
			var dragRctPointerPos = getPointerPos(dragRct);
			var pointerLeftTopX = Math.max(itemPointerPos.leftTopX, dragRctPointerPos.leftTopX);
			var pointerLeftTopY = Math.max(itemPointerPos.leftTopY, dragRctPointerPos.leftTopY);
			var pointerRightBottomX = Math.min(itemPointerPos.rightBottomX, dragRctPointerPos.rightBottomX);
			var pointerRightBottomY = Math.min(itemPointerPos.rightBottomY, dragRctPointerPos.rightBottomY);
			// console.log(pointerLeftTopX +','+ pointerLeftTopX + '\n' + pointerRightBottomX + ',' +pointerRightBottomY);
			if(pointerLeftTopX < pointerRightBottomX && pointerLeftTopY < pointerRightBottomY){
				return true;
			}else{
				return false;
			}
		}

		var targetInItemList = function(target){
			for(var i=0; i<list.length; i++){
				if($.contains(list[i]['DOM'],target) || list[i]['DOM'] === target){
					return true;
				}
			}
			return false;
		}

		var targetInSelectedList = function(target){
			for(var i=0; i<selectedList.length; i++){
				if($.contains(selectedList[i],target) || selectedList[i] === target){
					return true;
				}
			}
			return false;
		}		

		var getSelectedList = function(){
			var details = {};
			var blocks = $.sizzle('[node-type=explorer-block]');
			for(var i=0; i<blocks.length; i++){
				details[blocks[i].getAttribute('explorer-type')] = $.sizzle('[node-type=explorer-item]',blocks[i]);					
			}
			return {
				nowSelect : STK.unique(selectedList),
				details : details
			};
		};
		
		var fixTwoNum = function(first,last){
			if(first != Math.min(first,last)){
				first = [last,last=first][0];
			}
			return {
				first : first-0,
				last  : last-0
			}
		};

		var inSelectedList = function(item){
			var isIn = false;
			for(var i=0; i < selectedList.length; i++){
				if(item === selectedList[i]){
					isIn = true;
					break;
				}
			}
			i = isIn? i : -1;
			return {
				isIn: isIn,
				index: i
			};
		};
		
		var inList = function(item){
			var isIn = false;
			for(var i=0; i < list.length; i++){
				if(item === list[i]['DOM']){
					isIn = true;
					break;
				}
			}
			i = isIn? i : -1;
			return {
				isIn: isIn,
				index: i
			};
		};

		var sycLastSelecting = function(){
			if(inSelectedList.length == 0){
				lastSelecting = null;
			}
		};

		var getLineLong = function(p1,p2){
			return Math.sqrt((p1.top - p2.top)*(p1.top - p2.top) + (p1.left - p2.left)*(p1.left - p2.left));
		}

		var getBoxCenterPos = function(obj){
			return {
				left: obj.left + obj.width/2,
				top : obj.top + obj.height/2
			}
		}

		var getMidPointer = function(p1,p2){
			return {
				left : (p1.left + p2.left)/2,
				top  : (p2.top  + p2.top )/2
			}
		}

		var getNodeDragPos = function(preNode,node){
			if(preNode === null){
				var nodePos = $.position(node);
				var nodeSize = $.core.dom.getSize(node);
				return [{
					node : node,
					top  : nodePos.t+nodeSize.height/2,
					left : nodePos.l
				}];
			}else{
				var nodePos = $.position(node);
				var nodeSize = $.core.dom.getSize(node);
				var nodeCenter = getBoxCenterPos({
					top : nodePos.t,
					left: nodePos.l,
					width: nodeSize.width,
					height: nodeSize.height
				});
				var preNodePos = $.position(preNode);
				var preNodeSize = $.core.dom.getSize(preNode);
				var preNodeCenter = getBoxCenterPos({
					top : preNodePos.t,
					left: preNodePos.l,
					width: preNodeSize.width,
					height: preNodeSize.height
				});
				
				if(nodePos.t != preNodePos.t){
					return [{
						node : node,
						top  : nodePos.t+nodeSize.height/2,
						left : nodePos.l	
					},{
						node : node,
						top  : preNodePos.t+nodeSize.height/2,
						left : preNodePos.l	+ preNodeSize.width
					}];
				}
				
				var myMidPointer = getMidPointer(nodeCenter,preNodeCenter);
				return [{
					node : node,
					top  : myMidPointer.top,
					left : myMidPointer.left
				}];
			}
		}

		var clickCallBack = function(spec){
			if(isAnimating) return false;
			var myItem = spec.el;
			var myIndex = myItem.getAttribute('explorer-index');
			

			// if(lastSelecting == null && selectedList.length == 0){
			// 	selectedList.push(myItem);
			// 	lastSelecting = myIndex;
			
			// }else if(!(isCtrlPress||isShiftPress)){
			// 	// console.log('just click');
			// 	selectedList = [];
			// 	selectedList.push(myItem);
			// 	lastSelecting = myIndex;
				
			// }else if(isShiftPress){
			// 	// console.log('shift');
			// 	var fix = fixTwoNum(myIndex,lastSelecting);
			// 	if(!isCtrlPress){
			// 		selectedList = [];
			// 	}else{
			// 		lastSelecting = myIndex;
			// 	}
			// 	// console.log(fix);
			// 	for(var i=fix.first; i<=fix.last; i++){
			// 		var isInSelectedList = inSelectedList(list[i]['DOM']);
			// 		if(!isInSelectedList.isIn){
			// 			selectedList.push(list[i]['DOM']);
			// 		}
			// 	}
			// }else if(isCtrlPress){
			// 	// console.log('ctrl');
			// 	var isInSelectedList = inSelectedList(myItem);
			// 	if(isInSelectedList.isIn){
			// 		selectedList.splice(isInSelectedList.index,1);
			// 	}else{
			// 		selectedList.push(myItem);
			// 	}
			// 	lastSelecting = myIndex;

			// }
			
			
			var isInSelectedList = inSelectedList(myItem);
			if(!isInSelectedList.isIn){
				selectedList.push(myItem);
			}else{
				selectedList.splice(isInSelectedList.index,1);
			}
			if(isShiftPress){
				console.log('shift');
				var fix = fixTwoNum(myIndex,lastSelecting);
				for(var i=fix.first+1; i<=fix.last-1; i++){
					var isInSelectedList = inSelectedList(list[i]['DOM']);
					if(!isInSelectedList.isIn){
						selectedList.push(list[i]['DOM']);
					}else{
						selectedList.splice(isInSelectedList.index,1);
					}
				}
			}
			lastSelecting = myIndex;
			sycLastSelecting();
			console.log(getSelectedList());
			paint();
		};

		var keyCallBack = function(evt,b){
			var flag = b;
			evt = evt||window.event;
			evt.which = evt.charCode || evt.keyCode;
			// if(evt.which == 65){//ctrl  17
			// 	isCtrlPress = flag;
			// }else 
			if(evt.which == 16){//shift
				isShiftPress = flag;
			}
		};

		var bodyClickCallBack = function(e){
			if(isAnimating) return false;
			e = e||$.fixEvent(window.event);
			// if($.contains(node,e.target)){
			// 	return false;
			// }
			console.log(targetInItemList(e.target));
			if(targetInItemList(e.target)){
				return false;
			}
			selectedList = [];
			lastSelecting = null;
			paint();
		}
		var dragRctMousedownCallBack = function(e){
			if(isAnimating) return false;
			e = e||$.fixEvent(window.event);
			if(e.button == 2){
				return false;
			}
			if(targetInItemList(e.target) || isAnimating){
				return false;
			}
			// console.log(e);
			dragRctFlag = true;
			dragRctPos.top = e.pageY;
			dragRctPos.left = e.pageX;
			// console.log(e);
			document.body.appendChild(dragRct);
			dragRct.style.cssText += ';width:0;height:0;left:'+dragRctPos.left+'px;top:'+dragRctPos.top+'px;';
		}

		var dragRctMousemoveCallBack = function(e){
			e = e||$.fixEvent(window.event);
			if(dragRctFlag){
					var top,left,width,height;
				if(e.pageX < dragRctPos.left){
					left = e.pageX;
					width = dragRctPos.left - left;
				}else{
					left = dragRctPos.left;
					width = e.pageX - left;
				}
				if(e.pageY < dragRctPos.top){
					top = e.pageY;
					height = dragRctPos.top - top;
				}else{
					top = dragRctPos.top;
					height = e.pageY - top;
				}
				dragRct.style.cssText += ';display:block;top:'+top+'px;left:'+left+'px;width:'+width+'px;height:'+height+'px;';
				// if(!isShiftPress){
				// 	selectedList = [];
				// }
				// for(var i=0; i<list.length; i++){
				// 	if(inDragRect(list[i]['DOM'])){
				// 		var isInSelectedList = inSelectedList(list[i]['DOM']);
				// 		if(!isInSelectedList.isIn){
				// 			selectedList.push(list[i]['DOM']);
				// 		}else{
				// 			selectedList.splice(isInSelectedList.index,1);
				// 		}
				// 	}
				// }
			}
		}

		var dragRctMouseupCallBack = function(e){
			e = e||$.fixEvent(window.event);
			if(dragRctFlag){
				// selectedList = [];
				// for(var i=0; i<list.length; i++){
				// 	if(inDragRect(list[i]['DOM'])){
				// 		selectedList.push(list[i]['DOM']);
				// 	}
				// }
				// paint();
				
				// if(!isShiftPress){
				// 	selectedList = [];
				// }
				for(var i=0; i<list.length; i++){
					if(inDragRect(list[i]['DOM'])){
						var isInSelectedList = inSelectedList(list[i]['DOM']);
						if(!isInSelectedList.isIn){
							selectedList.push(list[i]['DOM']);
						}else{
							selectedList.splice(isInSelectedList.index,1);
						}
					}
				}
				paint();
				dragRctFlag = false;
				dragRct.style.display = 'none';
				dragRct.style.width = '0';
				dragRct.style.height = '0';
				dragRct.parentNode.removeChild(dragRct);
				console.log(getSelectedList());
			}
		}

		var dragItemMousedownCallBack = function(e){
			e = e || $.fixEvent(window.event);
			dragItemTimer = setTimeout(function(){
				if(e.button == 2){
					return false;
				}
				if(!targetInSelectedList(e.target)){
					return false;
				}
				dragItemFlag = true;
				dragItemMousePosPre.left = e.pageX;
				dragItemMousePosPre.top = e.pageY;

				if(isClone){
					var cloneList = [];
					for(var i=0; i<selectedList.length; i++){
						cloneList[i] = nodeClone(selectedList[i]);
						node.appendChild(cloneList[i]);
					}
					selectedList = cloneList;
					paint();
				}
				for(var i=0; i<selectedList.length; i++){
					dragItemPosPreList[i] = $.position(selectedList[i]);
					selectedList[i]['style']['zIndex'] = dragItemIndex;
					selectedList[i]['style']['position'] = 'absolute';
					$.setXY(selectedList[i],{
						t : dragItemPosPreList[i].t,
						l : dragItemPosPreList[i].l
					});
				}
				setTimeout(function(){
					for(var i=0; i<selectedList.length; i++){
						var deg = Math.random()*45 * (Math.random() > 0.5 ? -1 : 1);
						selectedList[i]['style']['cssText'] += aniCssTopLeft;
						if(i > 0){
							selectedList[i]['style']['cssText'] += ';-webkit-transform:rotate('+deg+'deg);-moz-transform:rotate('+deg+'deg);-o-transform:rotate('+deg+'deg);transform:rotate('+deg+'deg);';
						}
						$.setXY(selectedList[i],{
							l : e.pageX - $.core.dom.getSize(selectedList[i]).height/2,
							t : e.pageY - $.core.dom.getSize(selectedList[i]).width/2
						});
					}
				},10);

				if(selectedList.length > 1){
					document.body.appendChild(notice);
					$.setXY(notice,{
						l : e.pageX - $.core.dom.getSize(notice).height - 10,
						t : e.pageY - $.core.dom.getSize(notice).width - 10
					});
					notice.innerHTML = selectedList.length;
					setTimeout(function(){
						notice.style.opacity = 1;
					},50);
				}
			},100);			
		}

		var dragItemMousemoveCallBack = function(e){
			e = e||$.fixEvent(window.event);
			if(dragItemFlag){
				var pageX = e.pageX;
				var pageY = e.pageY;
				for(var i=0; i<selectedList.length; i++){
					selectedList[i]['style']['cssText'] += aniCssNormal;
					$.setXY(selectedList[i],{
						l : e.pageX - $.core.dom.getSize(selectedList[i]).height/2,
						t : e.pageY - $.core.dom.getSize(selectedList[i]).width/2
					});
				}
				if(selectedList.length > 1){
					$.setXY(notice,{
						l : e.pageX - $.core.dom.getSize(notice).height -10,
						t : e.pageY - $.core.dom.getSize(notice).width -10
					});
				}
			}
		}

		var dragItemMouseupCallBack = function(e){
			e = e||$.fixEvent(window.event);			
			clearTimeout(dragItemTimer);
			if(dragItemFlag){
				dragItemFlag = false;
				var pageX = e.pageX;
				var pageY = e.pageY;
				var dragTempMinNum = 100000000000000000000000;
				var dragTempMinDOM = null;

				
				
				var blocks = $.sizzle('[node-type=explorer-block]',node);
				
				for(var x=0; x<blocks.length; x++){
					
					var noSelectList = [];
					var items = $.sizzle('[node-type=explorer-item],[node-type=explorer-item-add]',blocks[x]);
										
					for(var i=0; i<items.length; i++){
						if(inSelectedList(items[i]).isIn){
							continue;
						}
						noSelectList.push(items[i]);
					}
					
					for(var i=0; i<noSelectList.length; i++){
						var preNode = i > 0 ? noSelectList[i-1] : null;
						var node = noSelectList[i];
						var myNodeDragPos = getNodeDragPos(preNode,node);
						
						for(var j=0; j<myNodeDragPos.length; j++){
							var long = getLineLong({
									top : pageY,
									left: pageX
								},{
									top : myNodeDragPos[j].top, 
									left: myNodeDragPos[j].left
								});
							

							// var a = $.C('div');
							// a.style.cssText += ';width:10px;height:10px;background:red;z-index:1000;';
							// document.body.appendChild(a);
							// $.core.dom.setXY(a,{t : myNodeDragPos[j].top, l: myNodeDragPos[j].left});



							if(long < dragTempMinNum){
								dragTempMinNum = long;
								dragTempMinDOM = myNodeDragPos[j].node;
							}
						}

					}

				
				}


				if(dragTempMinDOM != null){
					for(var i=0; i < selectedList.length; i++){
						var parent = dragTempMinDOM.parentNode;
						parent.insertBefore(selectedList[i],dragTempMinDOM);
					}
				}
				// console.log(dragTempMinDOM);
				isAnimating = true;
				for(var i=0; i<selectedList.length; i++){
					selectedList[i]['style']['position'] = '';
					$.setXY(selectedList[i],{
						t : dragItemPosPreList[i].t - dragItemMousePosPre.top + pageY,
						l : dragItemPosPreList[i].l - dragItemMousePosPre.left + pageX
					});
				}
				load();
				setTimeout(function(){
					for(var i=0; i<list.length; i++){
						list[i]['DOM']['style']['cssText'] += aniCssTopLeft;
						list[i]['DOM']['style']['top'] = '0';
						list[i]['DOM']['style']['left'] = '0';
						list[i]['DOM']['style']['cssText'] += ';-webkit-transform:rotate(0deg);-moz-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg);';
					}
					for(var i=0; i<selectedList.length; i++){
						list[i]['DOM']['style']['cssText'] += aniCssTopLeft;
						list[i]['DOM']['style']['top'] = '0';
						list[i]['DOM']['style']['left'] = '0';
						list[i]['DOM']['style']['cssText'] += ';-webkit-transform:rotate(0deg);-moz-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg);';
					}
				},10);
				setTimeout(function(){
					for(var i=0; i<list.length; i++){
						list[i]['DOM']['style']['position'] = '';
						list[i]['DOM']['style']['zIndex'] = '';
						list[i]['DOM']['style']['top'] = '';
						list[i]['DOM']['style']['left'] = '';
						list[i]['DOM']['style']['cssText'] += aniCssNormal;							
					}
					isAnimating = false;
				},510);
				if(notice.parentNode){
					notice.parentNode.removeChild(notice);
					notice.style.opacity = '';
					notice.innerHTML = '';
				}
			}
		}

		var dblclickCallBack = function(spec){
			var myItem = spec.el;
			selectedList = [];
			paint();
			alert(myItem.innerHTML);
		}

		var removeItemCallBack = function(spec){
			var myItem = spec.el.parentNode;
			myItem.parentNode.removeChild(myItem);
			load();
		}

		var addItemCallBack = function(spec){
			var newItem = $.C('div');
			// <div class="item" node-type="explorer-item" action-type="explorer-item">
			newItem.setAttribute('node-type','explorer-item');
			newItem.setAttribute('action-type','explorer-item');
			$.addClassName(newItem,'item');
			newItem.innerHTML = '<p>99</p><div class="explorerclose" action-type="explorer-item-close">☓</div>';
			spec.el.parentNode.insertBefore(newItem, spec.el);
			load();
		}

		var selectAll = function(){
			load();
			for(var i=0; i<list.length;i++){
				selectedList[i] = list[i]['DOM'];
			}
			console.log('selectAll');
			paint();
		}

		var bind = function(){
			var dEvent = $.delegatedEvent(node);
			$.addEvent(document.body,'keydown',function(evt){
				keyCallBack(evt,true);
				// console.log('isCtrlPress:'+isCtrlPress+'\nisShiftPress:'+isShiftPress);
			});
			$.addEvent(document.body,'keyup',function(evt){
				keyCallBack(evt,false);
				// console.log('isCtrlPress:'+isCtrlPress+'\nisShiftPress:'+isShiftPress);
			});
			
			dEvent.add('explorer-item','click',clickCallBack);			
			dEvent.add('explorer-item','dblclick',dblclickCallBack);	
			dEvent.add('explorer-item-close','click',removeItemCallBack);
			dEvent.add('explorer-item-add','click',addItemCallBack);

			$.addEvent(document.body,'mousedown',dragRctMousedownCallBack);
			$.addEvent(document.body,'mousemove',dragRctMousemoveCallBack);
			$.addEvent(document.body,'mouseup'  ,dragRctMouseupCallBack);
			
			$.addEvent(document.body,'mousedown',dragItemMousedownCallBack);
			$.addEvent(document.body,'mousemove',dragItemMousemoveCallBack);
			$.addEvent(document.body,'mouseup'  ,dragItemMouseupCallBack);

			$.addEvent(document.body,'click',bodyClickCallBack);

			$.hotKey.add(document.body,['ctrl+a'],selectAll);

		};
		
		var paint = function(){
			var selectList = getSelectedList().nowSelect;
			for(var i=0; i < list.length; i++){
				$.removeClassName(list[i]['DOM'],'selected');
				$.removeClassName(list[i]['DOM'],'pointer');
			}
			for(var i=0; i < selectList.length; i++){
				$.addClassName(selectList[i],'selected');
			}
			lastSelecting && $.addClassName(list[lastSelecting]['DOM'],'pointer');
		}

		that.load = load; //加载新条目
		that.bind = bind; //初始化加载事件
		that.getSelectedList = getSelectedList;//获取目前选中条目
		
		that.load().bind();
		
		return that;
	}
});