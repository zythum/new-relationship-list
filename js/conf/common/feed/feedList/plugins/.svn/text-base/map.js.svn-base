/**
 * 地图插件
 * @author wangzheng4@staff.sina.com.cn
 */

$Import('common.map');
$Import('common.feed.feedList.utils');
$Import('common.trans.map');

STK.register('common.feed.feedList.plugins.map', function($){
	var utils = $.common.feed.feedList.utils;
	
	return function(base) {
		
		if (!base) {
			$.log("map : need object of the baseFeedList Class");
			return;
		}
		
		var mapObj, mapEl;
		
		base.getDEvent().add("feed_list_geo_info", "click", function(obj) {
			var el = obj.el;
			var elData = obj.data;
			var elGeo = elData.geo;
			if(!elGeo) {
				$.log("map: feed_list_geo_info node geo is empty");
				return;
			}
			var onFail = function(json){
				
			};
			var onSuccess = function(json){
				if(typeof json=='object' && json.code == 1){
					var internal = json.data.geo.type;
					var geo = elGeo.split(",");
					if (!mapObj) {
						mapObj=$.common.map();
					}
					mapEl!=el&&mapObj&&mapObj.refresh();
					mapObj.show(el, {
						"latitude" : geo[1],
						"longitude": geo[0],
						"head": elData["head"],
						"addr": elData["title"],
						"internal": internal
					});
					mapEl = el;
					return;
				}
				onFail();
			};
			
			$.common.trans.map.getTrans("getInternalInfo", {
				 onComplete : onSuccess
				,onFail     : onFail
			}).request({
				 'coordinates': elGeo + ',geo'
				,'source': '4526198296'
			});//, template_name
			return utils.preventDefault(obj.evt);
		});
		
		var docClickFn = function(event) {
			if(!mapEl) return;
			
			var obj = $.fixEvent(event).target;
			
			if(mapEl!=obj&&!$.contains(mapEl,obj)) {
				mapObj&&mapObj.hide();
			};
		};
		
		$.addEvent(document, "click", docClickFn);
		
		$.custEvent.add(mapObj, "hide", function() {
			mapShowed = false;
			mapEl = undefined;
		});
		
		var that = {
			destroy: function() {
				$.removeEvent(document, "click", docClickFn);
				$.custEvent.remove(mapObj);
				mapObj && mapObj.destroy();
			}
		};
		
		return that;
	};
});