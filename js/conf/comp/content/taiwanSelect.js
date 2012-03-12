/**
 * 台湾大选模块 
 * @author xinglong1 | xinglong1@staff.sina.com.cn
 */
//$Import('kit.extra.language');
$Import('common.trans.taiwanSelect');
STK.register('comp.content.taiwanSelect', function($) {
		var removeNode=$.core.dom.removeNode,
		jsonp=$.core.io.jsonp,
		//cookie=$.core.util.cookie,
		parseHtml=$.core.str.parseHTML,
		encodeHtml=STK.core.str.encodeHTML,
		getUniqueKey=$.core.util.getUniqueKey;
	return function(node,opts){
		var that	= {};

		//var url='http://news.sina.com.cn/js/730/2012/0110/20.js?rnd=';//只使用一次所以写到这里了
		var url='http://www.sinaimg.cn/dy/deco/2012/0112/20.js?rnd='; //新接口
		var C={
			si:null,
			loop:function(){
				C.si && C.clearLoop();
				var lp=function(){
					var param={
						'url':url+getUniqueKey(),
						'responseName':'__TaiWan_elect',
						'onComplete':function(json){
							C.setHtml(json);
						}
					};
					jsonp(param);
				};
				lp();
				C.si=setInterval(lp,1*60*1000);
			},
			clearLoop:function(){
				clearInterval(C.si);
				C.si=null;
			},
			setHtml:function(json){
				if(json && json.code=='100000' && json.html){
					var rs=checkHtml(json.html);
					if(rs.sta){
						node && (node.style.display="");
						node&& (node.innerHTML=json.html);						
					}else{
						if (node) {
							node.style.display="none";
							node.innerHTML=rs.err;
						}
					}
				}
			},
			request:function(){
				var param={};
				$.common.trans.taiwanSelect.request('close', {
					'onSuccess': function(rs){
					},
					'onError': function(rs){
					},
					'onFail' : function(rs){
					}
				},param);
				$.core.evt.preventDefault();
			}
		};
		
		var checkHtml=function(html){
			var arr=parseHtml(html||'');
			var len=arr.length;
			var tempArr=[];
			for(var i=0;i<len;i++){
				if(arr[i][2]){
					if(arr[i][1]=='/'){
						 if(arr[i][2]==tempArr[tempArr.length-1]){
						 	tempArr.pop();
						 }else{
							tempArr.push(arr[i][1]+arr[i][2]); //将错误信息填进去
						 	return {
								'sta': 0,
								'err': encodeHtml(tempArr.join('> '))
							};
						 }
					}else{
						tempArr.push(arr[i][2]);

					}
				}
			}
			return {'sta':1};
		}
		
		var closeFunc=function(spec){
				C.clearLoop();
				C.request();
				removeNode(node);
				dEvent.remove('twElect_close','click');
		};
		
		var bindDOM = function(){
			dEvent=$.core.evt.delegatedEvent(node);
			dEvent.add('twElect_close','click',closeFunc);
		};
		
		var argsCheck=function(){
			if(!node){
				return false
			}
			return true;
		};
		
		var init = function(){
			if(!argsCheck){return};
			
			bindDOM();
			C.loop();
		};

		var destroy = function(){
			url=C=null;
		};
		that.destroy = destroy;	
		init();
		return that;
	};
});