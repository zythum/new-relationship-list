STK.register('comp.content.explorer_clickselector', function($){
	return function(node,o_){
		var isShiftPress = false;
		var fixTwoNum = function(first,last){
			if(first != Math.min(first,last)){
				first = [last,last=first][0];
			}
			return {
				first : first-0,
				last  : last-0
			}
		};
		var clickCallBack = function(spec){
			if(o_.isAnimating) return false;
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
			
			
			var isInSelectedList = o_.inSelectedList(myItem);
			if(o_.selectedList.length == 0){
				o_.selectedList.push(myItem);
			}else{
				if(!isInSelectedList.isIn){
					o_.selectedList.push(myItem);
				}else{
					o_.selectedList.splice(isInSelectedList.index,1);
				}
				if(isShiftPress){
					console.log('shift');
					var fix = fixTwoNum(myIndex,o_.lastSelecting);
					for(var i=fix.first+1; i<=fix.last-1; i++){
						var isInSelectedList = o_.inSelectedList(o_.list[i]['DOM']);
						if(!isInSelectedList.isIn){
							o_.selectedList.push(o_.list[i]['DOM']);
						}else{
							o_.selectedList.splice(isInSelectedList.index,1);
						}
					}
				}
			}
			o_.lastSelecting = myIndex;
			o_.sycLastSelecting();
			console.log(o_.getSelectedList());
			o_.paint();
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
			$.addEvent(document.body,'keydown',function(evt){
				keyCallBack(evt,true);
				// console.log('isCtrlPress:'+isCtrlPress+'\nisShiftPress:'+isShiftPress);
			});
			$.addEvent(document.body,'keyup',function(evt){
				keyCallBack(evt,false);
				// console.log('isCtrlPress:'+isCtrlPress+'\nisShiftPress:'+isShiftPress);
			});			
			dEvent.add('explorer-item','click',clickCallBack);			
			$.addEvent(document.body,'click',bodyClickCallBack);
		};

		o_.load();
		bind();






	}
});