/**
 * @author Runshi Wang|runshi@staff.sina.com.cn
 * 
 * 热门话题
 */
$Import('comp.ad.jsonpAD');

STK.register('comp.content.promotetopic', function($) {
	return function(node, opts){
		var it = {};
		var options = {
			ad : {}
		};
		options = $.parseParam(options, opts || {});
		
		//cash items
		var devt,listUls={};
			listUls.item=[];
			listUls.isview = null;
			listUls.length = 0;
		//act 
		var handler = {
			init: function(){
				//cash items
				listUls.item = $.sizzle('ul[action-data=refresh]');
				listUls.isview = 0;
				listUls.length = listUls.item.length;
				//init devt
				devt = $.delegatedEvent(node);
				//bind evt
				handler.bindEvt();
				//start AD
				handler.startAD();
			},
			bindEvt: function(){
				//事件代理扩展
				var acts = ['topic_refresh'];
				for(var i=0,l=acts.length;i<l;i++){
					handler[acts[i]]&&devt.add(acts[i],'click',handler[acts[i]]);
				}
			},
			topic_refresh: function(){
				listUls.item[listUls.isview].style.display='none';
				var i=listUls.isview;
				i = (i+1)>=listUls.length?0:(i+1);
				listUls.isview = i;
				listUls.item[i].style.display='';
			},
			startAD: function(){
				var adSt = $.sizzle("#ads_46", node)[0];
				adSt && $.comp.ad.jsonpAD(adSt, options.ad);
			},
			destory: function(){
				
			}
		};
		//init fun
		handler.init();
		it.destory=handler.destory;
		
		return it;
	};
	
});
