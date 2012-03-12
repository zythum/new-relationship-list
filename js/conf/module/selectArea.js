/**
 * @author wangliang3
 * 实例：可参见widget.component.selectArea
 */
$Import('kit.extra.merge');

STK.register('module.selectArea', function($){
	var gb = {
		source: '3818214747',//appkey
		language: $CONFIG['lang']||'zh-cn'
	};
	//请求地址 
	var path = 'http://i.api.weibo.com/2/common/';
	var urls = {
		country:path+'get_country.json',
		province:path+'get_province.json',
		city:path+'get_city.json'
	};
	//缓存已经获取到的区域列表
	var cache = {
		list: ['country','province','city'],//有顺序依赖
		map: {
			main: 'country',
			country: 'province',
			province: 'city'
		},
		data: {},
		codes: {}//默认值反解区域码
	};
	return function(selects,pars){
		var it = {};
		//select
		var select = {
			init: function(){
				select.pars();
				select.onview();
				select.render();
			},
			pars: function(){
				var value = pars['value']||'';
				var num = value.length;
				if(num>0&&num%3==0){
				    for(var i=0,len=num/3;i<len;i++){
				        cache.codes[cache.list[i]]=value.substring(0,(i+1)*3);
				    }
				}
			},
			onview: function(){
				for(var k in selects){
					//创建默认选项
					var opt = $.C('option');
					opt.value = pars['text'];
					opt.innerHTML = pars['text'];
					selects[k].appendChild(opt);
				}				
			},
			render: function(){
				var list = cache.list;
				for(var i=0,len=list.length;i<len;i++){
					var link = (i==0)?'main':list[i-1];
					(function(map){
						var key = cache.map[map]
						var conf = $.parseParam(gb, {});
						var el = selects[key];
						conf[map] = cache.codes[map]||'';//Open API参数特定
						//
						select.getArea(urls[key], conf, function(data){
							select.build(el, data);
							if (cache.codes[key]) {
								//cache data
//								cache.data[cache.codes[key]] = data;
								//default value
								if($.core.util.browser.IE6){
									$.sizzle('option[value='+cache.codes[key]+']',el)[0].selected = true;
								}else{
									el.value = cache.codes[key];
								}
							}
						});
					})(link);
				}
			},
			change: function(e,call){
				var el = (e.tagName=='SELECT')?e:$.fixEvent(e).target;
				var key;
				for(var k in selects ){
					if(el==selects[k]){
						key = k;
						break;
					}
				}
				var linkpage = cache.map[k];
				//
				select.reset(key);
				//
				if(el.selectedIndex==0){
					return;
				}
				//
				if (cache.data[el.value]) {
					select.build(selects[linkpage],cache.data[el.value]);
				}else{
					var conf = $.parseParam(gb,{});
					conf[key] = el.value;
					select.getArea(urls[linkpage],conf,function(data){
						select.build(selects[linkpage],data);
						//cache data
						cache.data[el.value]=data;
						//
						call&&call();
					});
				}
			},
			build: function(el,data){
				var count = 0;
				//创建新选项
				for (var k in data) {
					count++;
					var option = $.C('option');
					option.value = k;
					option.innerHTML = data[k];
					el.appendChild(option);
				}
				//根据count来设定disabled属性
				if(count) {
					el.removeAttribute('disabled');
				} else {
					el.setAttribute('disabled' , 'disabled');
				}
			},
			getArea: function(url,conf,call){
				$.jsonp({
					url: url,
					args: conf,
					onComplete: function(resp){
						var data = select.fishData(resp.data);
						call&&call(data);
					},
					onFail: function(data){
						throw 'i.api.weibo.com 数据请求异常';
					}
				});
			},
			clear: function(el){
				var options = el.options;
				for(var i=options.length-1;i>0;i--){
					el.removeChild(options[i]);
				}
			},
			fishData: function(data){
				var _data = {};
				for(var i in data){
					var item = data[i];
					for(var k in item){
						_data[k] = item[k];
					}
				}
				return _data;
			},
			reset: function(key){
				var map = cache.map;
				var fun = function(key){
					var _key = map[key];
					selects[_key].disabled = 'disabled';
					select.clear(selects[_key]);
					if(map[_key]){
						fun(_key);
					}
				};
				fun(key);
			}
		};
		
		//
		var handler = {
			init: function(){
				//初始化组件对象
				select.init();
				//绑定事件
				handler.bind();
			},
			bind: function(){
				if(selects){
					for(var k in selects){
						if(k==cache.list[cache.list.length-1]){
							continue;
						}
						$.addEvent(selects[k],'change',select.change);
					}
				}
			},
			destory: function(){
				for(var k in selects){
					$.removeEvent(selects[k],'change',select.change);
				}
			}
		};
		//启动函数
		handler.init();
		//外抛函数
		it.destory = handler.destory;
		return it;
		
	}
});
