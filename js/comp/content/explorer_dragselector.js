STK.register('comp.content.explorer_dragselector', function($){
	return function(node,o_){
		var dragRct = $.C('div');
		var dragRctPos = {top:null,left:null};
		var dragRctFlag = false;
		$.addClassName(dragRct,'explorer-drag');

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

		var dragRctMousedownCallBack = function(e){
			if(o_.isAnimating) return false;
			e = e||$.fixEvent(window.event);
			if(e.button == 2){
				return false;
			}
			if(o_.targetInItemList(e.target) || o_.isAnimating){
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
				for(var i=0; i<o_.list.length; i++){
					if(inDragRect(o_.list[i]['DOM'])){
						var isInSelectedList = o_.inSelectedList(o_.list[i]['DOM']);
						if(!isInSelectedList.isIn){
							o_.selectedList.push(o_.list[i]['DOM']);
						}else{
							o_.selectedList.splice(isInSelectedList.index,1);
						}
					}
				}
				o_.paint();
				dragRctFlag = false;
				dragRct.style.display = 'none';
				dragRct.style.width = '0';
				dragRct.style.height = '0';
				dragRct.parentNode.removeChild(dragRct);
				console.log(o_.getSelectedList());
			}
		}

		var bodyClickCallBack = function(e){
			if(o_.isAnimating) return false;
			e = e||$.fixEvent(window.event);
			// if($.contains(node,e.target)){
			// 	return false;
			// }
			console.log(o_.targetInItemList(e.target));
			if(o_.targetInItemList(e.target)){
				return false;
			}
			o_.selectedList = [];
			o_.lastSelecting = null;
			o_.paint();
		}

		var bind = function(){
			var dEvent = $.delegatedEvent(node);			
			$.addEvent(document,'mousedown',dragRctMousedownCallBack);
			$.addEvent(document,'mousemove',dragRctMousemoveCallBack);
			$.addEvent(document,'mouseup'  ,dragRctMouseupCallBack);
			$.addEvent(document,'click',bodyClickCallBack);
		};

		o_.load();
		bind();



	}
});