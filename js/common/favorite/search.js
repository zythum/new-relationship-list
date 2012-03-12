/**
 * 我的收藏页搜索功能
 * @id STK.kit.dom.smartInput
 * @param {Node} node
 * @author Finrila | wangzheng4@staff.sina.com.cn
 */
$Import('kit.dom.smartInput');
$Import('common.dialog.publish');
$Import('ui.tipAlert');
$Import('kit.extra.language');
$Import('common.trans.favorite');

STK.register("common.favorite.search", function($) {
	
	return function(node) {
		var that = {};
		var isSubmit = false;
		 var $L = $.kit.extra.language;
		if(!node) {
			$.log("common.favorite.search: node is not defined!");
			return;
		}
		
		var nodeBuilderList = $.builder(node).list; 
		var searchKey = nodeBuilderList["search_key"][0];
		var searchBtn = nodeBuilderList["search_btn"][0];
		var wbSend = nodeBuilderList["wb_send"][0];
		$.custEvent.define(that,["success"]);
		if(!searchKey || !searchBtn || !wbSend) {
			$.log("common.favorites.search: node search_key or search_btn or wb_sendis not defined!");
			return;
		}
		
		var defaultKeyNotice = searchKey.value = searchKey.getAttribute("notice");
		
		var publishDialog = $.common.dialog.publish({
			'styleId':'0'
		});
		
		var onSubmit = function() {
			$.preventDefault();
			if(isSubmit) return;
			isSubmit = true;
			var key =searchKey.value;
			if( $.trim(key).length > 0 && key != defaultKeyNotice) {
				if ($CONFIG['bigpipe'] !== 'true')
				{
					window.location.href = "/favSearch?key="+ encodeURIComponent(key);
					return;
				}
				$.common.trans.favorite.getTrans('getFav',{
					'onComplete': function(json){
						 isSubmit = false;
						if(json.code == "100000")
						{
							$.custEvent.fire(that,"success",{'html':json.data,'key':key});
						}
					}
				}).request({key:key});
			}
            else
            {
                   var _tipAlert = $.ui.tipAlert(
                            {
                                showCallback:function() {},
                                type : "warn",
                                msg : $L('#L{请输出查询的关键字}')+"!"
                            });
					        _tipAlert.setLayerXY(searchKey);
                           _tipAlert.aniShow();
						 isSubmit = false;
                           setTimeout(function(){
                                if( _tipAlert)
                                {
                                    _tipAlert.destroy();
                                   _tipAlert = null;
                                }
                            },3000);
            }
            return false;
		};
		var publish = function() {
			publishDialog.show();
		};
  		
		$.addClassName(searchKey, "input_default");
		var searchKeySmart = $.kit.dom.smartInput(searchKey, {
			notice: defaultKeyNotice,
			noticeClass: "input_default"
		});
		$.hotKey.add(searchKey, "enter", onSubmit);
		$.addEvent(searchBtn, "click", onSubmit);
		$.addEvent(wbSend, "click", publish);
		
		that.destroy = function() {

			$.hotKey.remove(searchKey, "enter", onSubmit);
			$.removeEvent(searchBtn, "click", onSubmit);
			$.removeEvent(wbSend, "click", publish);
			$.custEvent.undefine('that',['success']);
			publishDialog.destroy();
			searchKeySmart.destroy();
			searchKeySmart = null;

		};
		
		return that;
	};
	
});