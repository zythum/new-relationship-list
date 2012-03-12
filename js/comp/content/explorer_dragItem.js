STK.register('comp.content.explorer_dragItem', function($){
	return function(node,o_){
		var notice = $.C('div');
		var dragItemFlag = false;
		var dragItemMousePosPre = {top:null,left:null};
		var dragItemPosPreList = [];
		var dragItemIndex = 10;
		var dragItemTimer;
		var isClone = true;
		var aniCssNormal = ';-webkit-transition:background-color 0.5s ease;-moz-transition:background-color 0.5s ease;-o-transition:background-color 0.5s ease;transition:background-color 0.5s ease;';
		var aniCssTopLeft = ';-webkit-transition:top 0.3s ease,left 0.3s ease,-webkit-transform 0.3s ease;-moz-transition:top 0.3s ease,left 0.3s ease, -moz-transform 0.3s ease;-o-transition:top 0.3s ease,left 0.3s ease, -o-transform 0.3s ease;transition:top 0.3s ease,left 0.3s ease,transform 0.3s ease;';
		$.addClassName(notice,'explorer-notice');

		var nodeClone = function(node){
			var objClone = $.C(node.tagName.toLowerCase());
			objClone.innerHTML = node.innerHTML;
			objClone.className = node.className;
			objClone.setAttribute('node-type',node.getAttribute('node-type'));
			objClone.setAttribute('action-type',node.getAttribute('action-type'));
			return objClone; 
		}

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

		var dragItemMousedownCallBack = function(e){
			e = e || $.fixEvent(window.event);
			dragItemTimer = setTimeout(function(){
				if(e.button == 2){
					return false;
				}
				if(!o_.targetInSelectedList(e.target)){
					return false;
				}
				dragItemFlag = true;
				dragItemMousePosPre.left = e.pageX;
				dragItemMousePosPre.top = e.pageY;

				if(isClone){
					var cloneList = [];
					for(var i=0; i<o_.selectedList.length; i++){
						cloneList[i] = nodeClone(o_.selectedList[i]);
						node.appendChild(cloneList[i]);
					}
					o_.selectedList = cloneList;
					o_.paint();
				}
				for(var i=0; i<o_.selectedList.length; i++){
					dragItemPosPreList[i] = $.position(o_.selectedList[i]);
					o_.selectedList[i]['style']['zIndex'] = dragItemIndex;
					o_.selectedList[i]['style']['position'] = 'absolute';
					$.setXY(o_.selectedList[i],{
						t : dragItemPosPreList[i].t,
						l : dragItemPosPreList[i].l
					});
				}
				setTimeout(function(){
					for(var i=0; i<o_.selectedList.length; i++){
						var deg = Math.random()*45 * (Math.random() > 0.5 ? -1 : 1);
						o_.selectedList[i]['style']['cssText'] += aniCssTopLeft;
						if(i > 0){
							o_.selectedList[i]['style']['cssText'] += ';-webkit-transform:rotate('+deg+'deg);-moz-transform:rotate('+deg+'deg);-o-transform:rotate('+deg+'deg);transform:rotate('+deg+'deg);';
						}
						$.setXY(o_.selectedList[i],{
							l : e.pageX - $.core.dom.getSize(o_.selectedList[i]).height/2,
							t : e.pageY - $.core.dom.getSize(o_.selectedList[i]).width/2
						});
					}
				},10);

				if(o_.selectedList.length > 1){
					document.body.appendChild(notice);
					$.setXY(notice,{
						l : e.pageX - $.core.dom.getSize(notice).height - 10,
						t : e.pageY - $.core.dom.getSize(notice).width - 10
					});
					notice.innerHTML = o_.selectedList.length;
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
				for(var i=0; i<o_.selectedList.length; i++){
					o_.selectedList[i]['style']['cssText'] += aniCssNormal;
					$.setXY(o_.selectedList[i],{
						l : e.pageX - $.core.dom.getSize(o_.selectedList[i]).height/2,
						t : e.pageY - $.core.dom.getSize(o_.selectedList[i]).width/2
					});
				}
				if(o_.selectedList.length > 1){
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
						if(o_.inSelectedList(items[i]).isIn){
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
					for(var i=0; i < o_.selectedList.length; i++){
						var parent = dragTempMinDOM.parentNode;
						parent.insertBefore(o_.selectedList[i],dragTempMinDOM);
					}
				}
				// console.log(dragTempMinDOM);
				isAnimating = true;
				for(var i=0; i<o_.selectedList.length; i++){
					o_.selectedList[i]['style']['position'] = '';
					$.setXY(o_.selectedList[i],{
						t : dragItemPosPreList[i].t - dragItemMousePosPre.top + pageY,
						l : dragItemPosPreList[i].l - dragItemMousePosPre.left + pageX
					});
				}
				o_.load();
				setTimeout(function(){
					for(var i=0; i<o_.list.length; i++){
						o_.list[i]['DOM']['style']['cssText'] += aniCssTopLeft;
						o_.list[i]['DOM']['style']['top'] = '0';
						o_.list[i]['DOM']['style']['left'] = '0';
						o_.list[i]['DOM']['style']['cssText'] += ';-webkit-transform:rotate(0deg);-moz-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg);';
					}
					// for(var i=0; i<o_.selectedList.length; i++){
					// 	o_.list[i]['DOM']['style']['cssText'] += aniCssTopLeft;
					// 	o_.list[i]['DOM']['style']['top'] = '0';
					// 	o_.list[i]['DOM']['style']['left'] = '0';
					// 	o_.list[i]['DOM']['style']['cssText'] += ';-webkit-transform:rotate(0deg);-moz-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg);';
					// }
				},10);
				setTimeout(function(){
					for(var i=0; i<o_.list.length; i++){
						o_.list[i]['DOM']['style']['position'] = '';
						o_.list[i]['DOM']['style']['zIndex'] = '';
						o_.list[i]['DOM']['style']['top'] = '';
						o_.list[i]['DOM']['style']['left'] = '';
						o_.list[i]['DOM']['style']['cssText'] += aniCssNormal;							
					}
					o_.isAnimating = false;
				},510);
				if(notice.parentNode){
					notice.parentNode.removeChild(notice);
					notice.style.opacity = '';
					notice.innerHTML = '';
				}
			}
		}

		var bind = function(){
			var dEvent = $.delegatedEvent(node);			
			$.addEvent(document.body,'mousedown',dragItemMousedownCallBack);
			$.addEvent(document.body,'mousemove',dragItemMousemoveCallBack);
			$.addEvent(document.body,'mouseup'  ,dragItemMouseupCallBack);
		};

		o_.load();
		bind();



	}
});