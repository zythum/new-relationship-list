/**
 * @author liusong@staff.sina.com.cn
 */

STK.jobsM.register('pl.map.gmap', function($){
	//test url
	//http://js.wcdn.cn/t4/home/static/map/gmap.html?latitude=39.983847&longitude=116.333547&head=http%3A%2F%2Ftp2.sinaimg.cn%2F1505834385%2F50%2F1293425916%2F1&addr=aasdfadsf

	//局部变量声名
	var qs        = $.core.str.queryString,
		zoomIn    = $.E('zoomIn'),
		zoomOut   = $.E('zoomOut'),
		longitude = qs('longitude'),
		latitude  = qs('latitude'),
		head      = decodeURIComponent(qs('head',true))||"",
		addr      = decodeURIComponent(qs('addr'))||"";
	//地址参数安全性验证
	if(
		//头像不符合安全标准
		!/^[\:\w\/\.]*$/.test(head) ||
		//经度坐标不符合安全标准
		!/^[0-9\.]*$/.test(longitude) ||
		//纬度坐标不符合安全标准
		!/^[0-9\.]*$/.test(latitude) ||
		//地址不符合安全标准
		!/^[^<>\/]*$/.test(addr)
	){
		return false;
	}
	//初始化地图
	var mapoption = new MMapOptions();  
		mapoption.zoom=14;  
		mapoption.center=new MLngLat(longitude, latitude);  
		mapoption.overviewMap = HIDE;
		mapoption.isCongruence=true;  
	var map = new SMap("wrap", mapoption);
	//初始化mark
	var tip = $.C("div");
		tip.id = "tip";
		tip.style.cssText = "position:absolute;z-index:9999;cursor:url(\'http://dituapi.iask.com:8080/FMP-sina/Ajax/js/theme/default/img/openhand.cur\'), pointer;";
		$.E("wrap").appendChild(tip);
		tip.innerHTML = '<div class="bubble"><img style="width:30px;height:30px;cursor:url(\'http://dituapi.iask.com:8080/FMP-sina/Ajax/js/theme/default/img/openhand.cur\'), pointer;" title='+ addr +' src="' + head + '"></div>';
	var resetCenter, setMark;
	//Mark调置居中
	(setMark = function(){
		var ll = new MLngLat(longitude, latitude,1);
		var pt = map.fromLngLatToContainerPixel(ll);
		tip.style.top = (pt.y * 1 - 41) + "px";
		tip.style.left = (pt.x * 1 - 20) + "px";
	})();
	//Map调置居中
	(resetCenter = function(event, level){
		if(latitude && longitude){
			level = level||(map.getZoomLevel());
			zoomIn.className = ['map_zoomIn', (level==17?'_no':'')].join('');
			zoomOut.className = ['map_zoomOut', (level==3?'_no':'')].join('');
			map.setZoomAndCenter(level||14,new MLngLat(longitude,latitude),1);
		}
	})({},14);

	//缩小
	$.addEvent('zoomIn', 'click', function(){
		map.zoomIn();
	});
	//放大
	$.addEvent('zoomOut', 'click', function(){
		map.zoomOut();
	});
	//地图移动中
	map["addEventListener"](map, MAP_MOVING, setMark);
	//地图移动结束
	map["addEventListener"](map, MAP_MOVE_END, setMark);
	//大小改变
	map["addEventListener"](map, ZOOM_CHANGED, resetCenter);
});
