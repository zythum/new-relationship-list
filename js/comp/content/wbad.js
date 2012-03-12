/**
 * @author Maze
 */
$Import('common.relation.followPrototype');
$Import('common.dialog.setGroup');

STK.register("comp.content.wbad", function($){
	//扩展广告内部加关注功能
	var init = function(){
		//初始化广告参数
		window['WBAD'] = window['WBAD'] || {};
		WBAD={
			uid: $CONFIG['uid'] || scope.$uid
		};
		//
		var items = $.sizzle('[ad-data]',document.body);
		for(var i=0,len=items.length;i<len;i++){
			var item = items[i];
			var devt = $.delegatedEvent(item);
			devt.add('followBtn','click',function(spec){
				$.preventDefault();
				
				var _el = spec.el,
					_data = spec.data;
				_data.onSuccessCb = function(data){
					var btns = $.sizzle('a',_el.parentNode);
					for(var i=0,len=btns.length;i<len;i++){
						var tmp = btns[i];
						tmp.style.display=(tmp==_el)?'none':'';
					}
					$.common.dialog.setGroup().show({
						'uid': data.uid,
						'fnick': data.fnick,
						'groupList': data.group,
						'hasRemark': true
					});
				};
				$.common.relation.followPrototype.follow(_data);
			})
		}
	};
	
	return function(){
		init();
		//
        var s = false, doc = document, wa = doc.createElement('script'), es = doc.getElementsByTagName('script')[0];
        wa.type = 'text/javascript';
        wa.charset = 'utf-8';
        wa.async = true;
		wa.src = ('https:' == doc.location.protocol ? 'https://' : 'http://') + 'js.t.sinajs.cn/t4/home/static/wbad.js?version=' + $CONFIG['version'];
        es.parentNode.insertBefore(wa, es);
    }
});