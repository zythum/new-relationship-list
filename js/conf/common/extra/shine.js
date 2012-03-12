STK.register('common.extra.shine', function($){
	var revList = function(list){
		return list.slice(0,list.length - 1).concat(list.concat([]).reverse());//[1,2,3,4] ===> [1,2,3,4,3,2,1]
	};
	
	return function(el,spec){
		var conf = $.parseParam({
			'start' : '#fff',
			'color' : '#fbb',
			'times' : 2,//2^n
			'step'  : 5
		},spec);
		var starts = conf['start'].split('');
		var colors = conf['color'].split('');
		var orbit = [];
		for(var i = 0; i < conf['step']; i += 1){// step for shine
			var str = starts[0];
			for(var j = 1; j < 4; j += 1){//about rgb
				var sta = parseInt(starts[j],16);
				var end = parseInt(colors[j],16);
				str += Math.floor(parseInt(sta + (end - sta)*i/conf['step'],10)).toString(16);
			}
			orbit.push(str);
		}
		for(var i = 0; i < conf['times']; i += 1){//shine times 2^n
			orbit = revList(orbit);
		}
		var key = false;
		var timer = $.timer.add(function(){
			if(!orbit.length){
				$.timer.remove(timer);
				return;
			}
			if(key){
				key = false;
				return;
			}else{
				key = true;
			}
			el.style.backgroundColor = orbit.pop();
		});
	};
});