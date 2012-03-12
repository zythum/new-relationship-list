$Import('core.func.timedChunk');
$Import('core.dom.ready');
STK.register('core.util.jobsM', function($){
	return (function(){
		var jobList = [];
		var usedHash = {};
		var running = false;
		
		var that = {};
		
		var startOneJob = function(job){
			var jobName = job['name'];
			var jobFunc = job['func'];
			var staTime = +new Date();
			if(!usedHash[jobName]){
				try{
					jobFunc($);
					jobFunc[jobName] = true;
				}catch(exp){
					$.log('[error][jobs]' + jobName);
				}
			}
		};
		
		var loop = function(items){
			if(items.length){
				$.core.func.timedChunk(items, {
					'process' : startOneJob,
					'callback': arguments.callee
				});
				items.splice(0, items.length);
			}else{
				running = false;
			}
			
		};
		
		
		that.register = function(sJobName, oFunc){
			jobList.push({
				'name': sJobName,
				'func': oFunc
			});
		};
		
		that.start = function(){
			if (running) {
				return true;
			} else {
				running = true;
			}
			loop(jobList);
		};
		
		that.load = function(){
		};
		
		
		$.core.dom.ready(that.start);
		
		return that;
		
	})();
});
