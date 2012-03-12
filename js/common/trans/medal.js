STK.register('common.trans.medal',function($){
		var t = $.kit.io.inter();
		var g = t.register;
		g('getMedalInfo', {'url':'http://localhost/fakedata.html', 'method': 'get'});	// URL OK	
		return t;
});