$Import('kit.extra.merge');

STK.register('kit.io.ijax', function($) {
	/**
	 -----------args-------------
		'url': '',
		'timeout': 30 * 1000,
		'onComplete': $.core.func.empty,
		'onFail': $.core.func.empty,
		'isEncode' : true,
		'abaurl' : null,
		'responseName' : null,
		'varkey': 'callback',
		'abakey' : 'callback'
	 */
	return function(args){
		
		var conf, that, queue, current, lock, onComplete, onFail;
		
		conf = $.parseParam({
			'url'			: '',
			'timeout'		: 30 * 1000,
			'isEncode'		: true,
			'abaurl'		: null,
			'responseName'	: null,
			'varkey'		: 'callback',
			'abakey'		: 'callback'
		}, args);
		
		onComplete = function(res, query){
			lock = false;
			args.onComplete(res, conf.form, query);
			conf.form = null;
			conf.args = null;
			setTimeout(nextRequest,0);//跳出递归
		};
		onFail = function(res, query){
			lock = false;
			args.onFail(res, conf.form, query);
			conf.form = null;
			conf.args = null;
			setTimeout(nextRequest, 0);//跳出递归
		};
		queue = [];
		current = null;
		lock = false;
		conf.onComplete = onComplete;
		conf.onFail = onFail;
		
		var nextRequest = function(){
			var curArgs;
			if(!queue.length){
				return ;
			}
			if(lock === true){
				return;
			}
			lock = true;
			
			curArgs = queue.shift();
			conf.args = curArgs['args'];
			conf.form = curArgs['form'];
			current = $.ijax(conf);
		};
		
		var abort = function(params){
			while(queue.length){
				queue.shift();
			}
			lock = false;
			if(current){
				try{
					current.abort();
				}catch(exp){
				
				}
				
			}
			current = null;
		};
		
		that = {};
		
		that.request = function(form, params){
			if(!$.isNode(form)) {
				throw '[kit.io.ijax.request] need a form as first parameter';
			}
			if(!params){
				params = {};
			}
			if(args['noQueue']){
				abort();
			}
			queue.push({'form':form,'args':params});
			nextRequest();
		};
		
		that.abort = abort;
		return that;
	};
});