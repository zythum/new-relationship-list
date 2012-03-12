STK.register('common.trans.getmedal',function($){
		var t = $.kit.io.inter();
		var g = t.register;
		g('getmedal', {'url':'http://127.0.0.1/weibo/fakedata.txt', 'method': 'get'});	// URL OK	
		return t;
});