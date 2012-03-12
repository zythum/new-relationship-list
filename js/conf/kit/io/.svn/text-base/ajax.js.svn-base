$Import('kit.extra.merge');

STK.register('kit.io.ajax', function($) {
	//modify by Robin Young | yonglin@staff.sina.com.cn | 2011-11-30;做接口异常的统计
	var sendErrLog = function (conf, type, msg) {
		type = (type|0) || 1;
		msg = msg || 'fail';
		var args = conf['args'];
		if(args['__rnd']){
			delete args['__rnd'];
		}
		(new Image()).src = 'http://weibolog.sinaapp.com/?t=' + type + 
			'&u=' + encodeURIComponent(conf['url']) + 
			'&p=' + encodeURIComponent($.core.json.jsonToQuery(args)) + 
			'&m=' + msg;
	};
	//end modify by Robin
	
	/*** url			: 
	 -----------args-------------
	 * onComplete	: 
	 * onTraning	: 
	 * onFail		: 
	 * method		: 
	 * asynchronous	: 
	 * contentType	: 
	 * encoding		: 
	 * responseType	: 
	 * timeout		: 
	 * 
	 */
	return function(args){
		var conf, that, queue, current, lock, complete, fail;
		
		complete = function(res){
			lock = false;
			args.onComplete(res, conf['args']);
			setTimeout(nextRequest,0);//跳出递归
		};
		
		fail = function(res){
			lock = false;
			if(typeof args.onFail === 'function'){
				args.onFail(res, conf['args']);
			}
			setTimeout(nextRequest,0);//跳出递归
			//modify by Robin Young | yonglin@staff.sina.com.cn | 2011-11-30;做接口异常的统计
			try{
				sendErrLog(conf);
			}catch(exp){
				
			}
			//end modify by Robin
		};
		
		queue = [];
		current = null;
		lock = false;
		
		conf = $.parseParam({
			'url'			: '',
			'method'		: 'get',
			'responseType'	: 'json',
			'timeout'		: 30 * 1000,
			'onTraning'		: $.funcEmpty,
			'isEncode' 		: true
		}, args);
		
		conf['onComplete'] = complete;
		conf['onFail'] = fail;
		
		//modify by Robin Young | yonglin@staff.sina.com.cn | 2011-11-30;做接口超时的统计
		conf['onTimeout'] = function(){
			try{
				sendErrLog(conf);
			}catch(exp){
			
			}
		};
		//end modify by Robin
		
		
		var nextRequest = function(){
			if(!queue.length){
				return ;
			}
			if(lock === true){
				return;
			}
			lock = true;
			conf.args = queue.shift();
			
			if(conf.method.toLowerCase() == 'post') {
				var url = $.core.util.URL(conf.url);
				url.setParam('__rnd', new Date().valueOf());
				conf.url = url.toString();
			}
			
			current = $.ajax(conf);
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
		
		that.request = function(params){
			if(!params){
				params = {};
			}
			if(args['noQueue']){
				abort();
			}
			if(!args['uniqueRequest'] || !current){
				queue.push(params);
				params['_t'] = 0;
				nextRequest();
			}
		};
		
		that.abort = abort;
		return that;
	};
});