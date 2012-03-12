/**
 * qbaty || yuheng@staff.sina.com.cn
 * option 渲染
 */
$Import('common.trans.mobile');

STK.register('common.mobile.rendOption',function($){
	var dataCache = {};
	var brandCache;

	function rend(select ,data){
		var opts = select.options;
		opts.length = 0;

		for(var i = 0; i < data.length ; i++){
			var toption = new Option(data[i].model);
			toption.setAttribute('download_url',data[i].url);
			opts[opts.length] = toption ;
		}
	}
	
	var trans = $.common.trans.mobile.getTrans('download',{
		'onSuccess' : function(data){
			if(data.data){
				dataCache[brandCache] = data.data;
			}
			rend(modelSelect, data.data);
		},
		'onComplete': function(){}
	});



	var bind = function(){
		$.core.evt.addEvent(modelSelect,'change',function(){
			var mindex = modelSelect.selectedIndex;
			var moptions = modelSelect.options;
			linkNode.href = moptions[mindex].getAttribute('download_url');
		});

		$.core.evt.addEvent(brandSelect,'change',function(){
			var bindex = brandSelect.selectedIndex;
			var boptions = brandSelect.options;
			var brand = boptions[bindex].getAttribute('brand');
			var data = dataCache[brand];

			if(typeof data !== "undefined"){
					rend(modelSelect, data);
			}else{
				brandCache = brand;
				trans.request({
					'platform' : platform,
					'brand' : brand
				});
			}
		});
	};

	var brandSelect, modelSelect, linkNode, data, platform;
	
	return function(specs){
		brandSelect = specs.brand;
		modelSelect = specs.model;
		linkNode = specs.link;
		platform = specs.platform;
		
		bind();
	};
});