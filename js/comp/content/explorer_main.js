$Import('comp.content.explorer_dragItem');
$Import('comp.content.explorer_dragSelector');
$Import('comp.content.explorer_clickSelector');
$Import('comp.content.explorer_add');
$Import('comp.content.explorer_remove');
$Import('comp.content.explorer_hotkey');
$Import('comp.content.explorer_dblclick');

STK.register('comp.content.explorer_main', function($){
	return function(node){
		var that = {};
		var o_ = {};
		
		o_.selectedList = [];
		o_.list = [];
		o_.tempNodeList = [];
		o_.isAnimating = false;
		o_.lastSelecting = null;


		o_.load = function(){
			var myList = $.sizzle('[node-type=explorer-item]',node);
			o_.lastSelecting = null;
			o_.selectedList = [];
			o_.list = [];
			for(var i=0; i < myList.length ;i++){
				o_.list[i] = {
					index:i,
					DOM:myList[i]
				};
				o_.list[i]['DOM']&&o_.list[i]['DOM'].setAttribute('explorer-index',i);
			}
			// if(selectedList[0]){
			// 	lastSelecting = inList(selectedList[0]).index;
			// }
			console.log('myList');
			console.log(myList);
			o_.paint();
			// console.log(list);
			return that;
		};
		
		o_.targetInItemList = function(target){
			for(var i=0; i<o_.list.length; i++){
				if($.contains(o_.list[i]['DOM'],target) || o_.list[i]['DOM'] === target){
					return true;
				}
			}
			return false;
		}
		
		o_.targetInSelectedList = function(target){
			for(var i=0; i<o_.selectedList.length; i++){
				if($.contains(o_.selectedList[i],target) || o_.selectedList[i] === target){
					return true;
				}
			}
			return false;
		};
		
		o_.getSelectedList = function(){
			var details = {};
			var blocks = $.sizzle('[node-type=explorer-block]');
			for(var i=0; i<blocks.length; i++){
				details[blocks[i].getAttribute('explorer-type')] = $.sizzle('[node-type=explorer-item]',blocks[i]);					
			}
			return {
				nowSelect : STK.unique(o_.selectedList),
				details : details
			};
		};
		
		o_.inSelectedList = function(item){
			var isIn = false;
			for(var i=0; i < o_.selectedList.length; i++){
				if(item === o_.selectedList[i]){
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
		
		o_.inList = function(item){
			var isIn = false;
			for(var i=0; i < o_.list.length; i++){
				if(item === o_.list[i]['DOM']){
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
		
		o_.sycLastSelecting = function(){
			if(o_.inSelectedList.length == 0){
				o_.lastSelecting = null;
			}
		};
		
		o_.paint = function(){
			var selectList = o_.getSelectedList().nowSelect;
			for(var i=0; i < o_.list.length; i++){
				$.removeClassName(o_.list[i]['DOM'],'selected');
				$.removeClassName(o_.list[i]['DOM'],'pointer');
			}
			for(var i=0; i < selectList.length; i++){
				$.addClassName(selectList[i],'selected');
			}
			o_.lastSelecting && $.addClassName(o_.list[o_.lastSelecting]['DOM'],'pointer');
		};
		

		$.comp.content.explorer_dragselector(node,o_);
		$.comp.content.explorer_clickselector(node,o_);
		$.comp.content.explorer_dragItem(node,o_);
		$.comp.content.explorer_dblclick(node,o_);
		$.comp.content.explorer_add(node,o_);
		$.comp.content.explorer_remove(node,o_);
		$.comp.content.explorer_hotkey(node,o_);


		that.load = o_.load; //加载新条目
		that.getSelectedList = o_.getSelectedList;//获取目前选中条目 

		o_.load();
		console.log('a');
		return that;

	}
});