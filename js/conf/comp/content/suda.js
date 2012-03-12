/**
 *
 * @id pl.content.atMeWeibo
 * @return {Object} 实例
 * @example
 */
STK.register("comp.content.suda", function($){
    //suda启动前设定配置参
    window['SUDA'] = window['SUDA'] || [];
    if (Math.ceil(Math.random() * 10000) == 1) {
        SUDA.push(['setPerformance', 15]);
    }
    
//	//白名单，统计的action-type这里扔
//	var directory = ['inviteFollow'];
//	var initMonitor = function(args){
//		var el = args.el;
//		var type = el.getAttribute('action-type');
//		/*
//		 * stem参数说明
//		 * 相同功能不同应用情况下的参数区分，如关注在不同页面，参数不同（默认返回type）
//		 */
//		var stem = el.getAttribute('suda-data')||type;
//		SUDA.uaTrack&&SUDA.uaTrack(type,stem);
//	};

//	//SUDA升级自行托管click事件
//	var clickEvent = function(e){
//		var evt = $.core.evt.fixEvent(e);
//		var el = evt.target;
//		while(el && el.getAttribute && !el.getAttribute('suda-data')){
//			if(el == document.body){
//				return;
//			}
//			el = el.parentNode;
//		}
//		var stem = el && el.getAttribute && el.getAttribute('suda-data') || '';
//		/*
//		 * suda-data 格式
//		 * <span suda-data="key=clickbtn&value=1900-1-01||click||home">
//		 * value说明：多个不同的参数使用||分割，遵守默认suda的数据格式
//		 */
//		if(stem){
//			var _data = $.core.json.queryToJson(stem);
//			_data['key']&&SUDA.uaTrack&&SUDA.uaTrack(_data['key'],_data['value']||_data['key']);
//		}
//	};
    
    return function(){
        var s = false, doc = document, wa = doc.createElement('script'), es = doc.getElementsByTagName('script')[0];
        wa.type = 'text/javascript';
        wa.charset = 'utf-8';
        wa.async = true;
//		wa.onload = wa.onreadystatechange = function(){
//            if (!s && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
//                s = true;
//                wa.onload = wa.onreadystatechange = null;
////				//白名单统计行为
////              var devt = $.delegatedEvent(doc.body);
////				for(var i=0,l=directory.length;i<l;i++){
////					devt.add(directory[i],'click',initMonitor);
////				}
//				$.addEvent(doc.body,'click', clickEvent);
//            }
//        }
        wa.src = ('https:' == doc.location.protocol ? 'https://' : 'http://') + 'js.t.sinajs.cn/open/analytics/js/suda.js?version=' + $CONFIG['version'];
        es.parentNode.insertBefore(wa, es);
    }
});
