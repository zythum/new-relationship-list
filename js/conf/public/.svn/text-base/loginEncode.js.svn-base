/**
 * xinglong1 | xinglong1@staff.sina.com.cn
 */
WBtopLoginEncode=(function(){
	$Import('core.STK');
	$Import('core.io.jsonp');
	$Import('core.dom.removeNode');
	
	var jsonp = STK.core.io.jsonp,
		removeNode=STK.core.dom.removeNode;
		
	var that = {},
		jsHandle;	
	var local={
		'js':'http://js.t.sinajs.cn/t4/home/js/public/sinaSSOEncoder.js',
		'ticket':'http://login.sina.com.cn/sso/prelogin.php'
	}

	var C={
		getJs:function(opts){
			var url=local['js'];
			if(window.sinaSSOEncoder){
				opts && C.getTicket(opts.args,opts.cbk);
				return;				
			}
			return jsonp({
				'url':url,
				'onComplete':function(){  //因为调用的js自己执行之后，将不再执行这里所有此处未处理 TODO
					//opts && C.getTicket(opts.args,opts.cbk);
				},
				'onTimeout':function(){
					if(jsHandle){
						//removeNode(jsHandle);
						//jsHandle=null;
					};
					jsHandle=C.getJs(url);
				}
			});
		},
		getTicket:function(args,cbk){
			var url=local['ticket'];
			if(!window.sinaSSOEncoder){
				C.getJs({'args':args,'cbk':cbk});
				return;
			};
			return jsonp({
				'url':url,
				'args':{
					'entry':'miniblog',
					'user':encodeURIComponent(args['un'])
				},
				'onComplete': function(spec){
					cbk(spec);
				},
				'onTimeout':function(){
					cbk && cbk();
				}
			});
		}
	};
	//如果票据失败，仍然会按老路线执行登录（不编码）
	that.encode = function(spec){
		var n=spec.un,
			p=spec.pwd,
			servertime='',
			nonce='',
			retcode=1;
		var cbk=function(opts){
			if(opts && (opts.retcode==0)){
				retcode=opts.retcode;
				p=sinaSSOEncoder.hex_sha1(sinaSSOEncoder.hex_sha1(sinaSSOEncoder.hex_sha1(p)) + opts.servertime + opts.nonce);
				n=sinaSSOEncoder.base64.encode(encodeURIComponent(n));
				servertime=opts.servertime;
				nonce=opts.nonce;
			}
			spec.callbk && spec.callbk({'retcode':retcode,'un':n,'pwd':p,'servertime':servertime,'nonce':nonce});
		};
		C.getTicket(spec,cbk);
	};
	
	that.init=function(){
		jsHandle=C.getJs();
	};
	
	that.init();
	return that;
})();
