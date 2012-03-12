/**
 * qbaty || yuheng@staff.sina.com.cn
 * 图片切换
 */
STK.register('common.mobile.shiftImg',function($){
	return function(parent, opts){

		var nodes, node, lsn;
		var options = {
			timer : 2
		}

		function shift(){
			lsn = setInterval(function(){
				nodes = node.getElementsByTagName('img');
				if(nodes.length){
					node.appendChild(nodes[0]);
				}
			}, options.timer * 1000);
		}

		
		if(!parent){
			throw 'common.mobile.shiftImg need a parentNode!'
		}
		
		options = $.parseParam(options, opts || {});
		
		node = parent;
		shift();
		
		return {
			destroy : function(){
				window.clearInterval(lsn);
			}
		};
	}
})