STK.register('kit.dom.treewalker',function($){
	var next = function(dom){
		var next = dom.nextSibling;
		if(!next){
			return null;
		}else if(next.nodeType !== 1){
			next = arguments.callee(next);
		}
		return next;
	};
	var prev = function(dom){
		var prev = dom.previousSibling;
		if(!prev){
			return null;
		}else if(prev.nodeType !== 1){
			prev = arguments.callee(prev);
		}
		return prev;
	};
	var parent = function(dom){
		if(dom != document.body){
			return dom.parentNode;
		}else{
			return null;
		}
	};
	return function(spec){
		var that = {};
		var start = spec.start;
		var current = spec.start;
		var footprint = [current];
		that.next = function(){
			if(next(current) !== null){
				current = next(current);
			}else{
				throw 'this dom do not have next element';
			}
			footprint.push(current);
			return that;
		};
		that.prev = function(){
			if(prev(current) !== null){
				current = prev(current);
			}else{
				throw 'this dom do not have previous element';
			}
			footprint.push(current);
			return that;
		};
		that.parent = function(){
			if(parent(current) !== null){
				current = parent(current);
			}else{
				throw 'this dom do not have parent element';
			}
			footprint.push(current);
			return that;
		};
		that.child = function(index){
			if(current.children[index || 0]){
				current = current.children[index || 0];
			}else{
				throw 'this dom do not have the child element';
			}
			footprint.push(current);
			return that;
		};
		that.getCurrent = function(){
			return current;
		};
		that.getStart = function(){
			return start;
		};
		that.getFootprint = function(){
			return footprint;
		};
		that.walkTest = function(key){
			if(key === 'next'){
				if(next(current) !== null){
					return true;
				}else{
					return false;
				}
			}
			if(key === 'prev'){
				if(prev(current) !== null){
					return true;
				}else{
					return false;
				}
			}
			if(key === 'parent'){
				if(parent(current) !== null){
					return true;
				}else{
					return false;
				}
			}
			if(key === 'child'){
				if(current.children.length){
					return true;
				}else{
					return false;
				}
			}
		}
		return that;
	}
});