/**
* lianyi@staff.sina.com.cn
* 改变url上面的hash，针对bigpipe进行了专门的处理，使用了historyM的setPlainHash，
* 因为historyM进行了url监听，直接改变hash会有问题
* 而非bigpipe模式的浏览器可以直接更改hash
*/
STK.register('kit.extra.setPlainHash', function($){
	return function(hash){
		try{
			var cfg = window.$CONFIG;
			if(cfg && cfg['bigpipe'] === 'true' && $.historyM){
				$.historyM.setPlainHash(hash);
			}else{
				window.location.hash = hash;
			}
		}catch(e){}
	};
});