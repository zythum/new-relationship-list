/**
 * @author liusong@staff.sina.com.cn
 */

STK.jobsM.register('pl.map.gmap', function($){

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
			!/^[0-9\.\-]*$/.test(longitude) ||
			//纬度坐标不符合安全标准
			!/^[0-9\.\-]*$/.test(latitude) ||
			//地址不符合安全标准
			!/^[^<>\/]*$/.test(addr)
		){
			return false;
		}
		if(!google){return}
		//创建一个Marker类
		google.maps.SMarker = function(latlng, opt){
			this.latlng = latlng;
			this.html = opt.innerHTML || '';
			this.className = opt.className || '';
			this.css = opt.css || {};
			this.id = opt.id || '';
		};
		//继承google的overlay
		google.maps.SMarker.prototype = new google.maps.Overlay();
		google.maps.SMarker.prototype.initialize = function(){
			var c = map.fromLatLngToDivPixel(this.latlng);
			var div = $.C("div");
			div.style.left = (c.x - 20)+"px";
			div.style.top = (c.y - 49)+"px";
			div.style.position = "absolute";
			div.innerHTML = this.html;
			map.getPane(G_MAP_MAP_PANE).appendChild(div); 
			this.map = map;  
			this.container = div;
		};
		//可以移除Marker的方法
		google.maps.SMarker.prototype.remove = function(){
			var c = this.container.parentNode;
			c.removeChild(this.container);
			this.container.style.display = "none";
		};
		//可以重绘Marker的方法
		google.maps.SMarker.prototype.redraw = function(force){
			if (!force) return;
			var c = this.map.fromLatLngToDivPixel(this.latlng);
			this.container.style.left = (c.x - 20) + "px";
			this.container.style.top = (c.y - 41) + "px";
			map.getPane(G_MAP_MAP_PANE).appendChild(this.container); 
		};
		//地图初始化
		var marker,
			wrap = $.E("wrap"),
			map = new GMap2($.E("wrap"));
			map.enableScrollWheelZoom();
			marker = new google.maps.SMarker(new GLatLng(latitude, longitude), {
				innerHTML : '<div class="bubble"><img style="width:30px;height:30px;cursor:url(\'http://dituapi.iask.com:8080/FMP-sina/Ajax/js/theme/default/img/openhand.cur\'), pointer;" title='+ addr +' src="' + head + '"></div>'
			});
		var resetCenter = function(level){
			if(latitude && longitude){
				level = level||map.getZoom();
				zoomIn.className = ['map_zoomIn', (level==21?'_no':'')].join('');
				zoomOut.className = ['map_zoomOut', (level==0?'_no':'')].join('');
				map.setCenter(new GLatLng(latitude, longitude), level||map.getZoom());
			}
		};
		
		
		//缩小
		$.addEvent('zoomIn', 'click', function(){
			map.zoomIn();
		});
		//放大
		$.addEvent('zoomOut', 'click', function(){
			map.zoomOut();
		});
		
		//移动重置mark位置
		GEvent.addListener(map, "moveend", function(){
			marker.redraw(true);
		});
		//改变zoomLevel重置中心位置
		GEvent.addListener(map, "zoomend", function(){
			resetCenter();
		});
		map.addOverlay(marker);
		
		setTimeout(function(){
			resetCenter(14)
		}, 1000);
	
});
